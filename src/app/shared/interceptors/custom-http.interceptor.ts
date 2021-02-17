import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaderResponse, HttpSentEvent, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, catchError, switchMap, filter, take, finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { ApplicationType, ResponseStatusEnum } from '../enumerations';



// REFERENCE --> https://github.com/SyntakSoftware/ApothecaricNgUI

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    isRefreshingToken: boolean = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    intercept(request: HttpRequest<any>, next: HttpHandler) : Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any> | any> {

        // override the request url...
        request = request.clone({url: this.overrideUrlWithDomainPrefix(request.url)});

        // override request body...
        if(this.authService.currentUserValue && (request.method.toLowerCase() == 'post' || request.method.toLowerCase() == 'put')){
            let escapeUrls = environment.escapeUrls;
            if (request.body instanceof FormData) {
                request.body.append('applicationVersion', environment.appVersion)
                request.body.append('applicationType', String(ApplicationType.Web))
                if (this.authService.currentUserValue.tenantId && !escapeUrls.includes(request.url)) {
                    request.body.append('tenantId', this.authService.currentUserValue.tenantId)
                }
                if(this.authService.currentUserValue.userId){
                    request.body.append('userId', this.authService.currentUserValue.userId)
                }
                request =  request.clone({
                  body: request.body
                })
            } else {
                const newBody = {}; 
                newBody['applicationVersion'] = environment.appVersion;
                newBody['applicationType'] = String(ApplicationType.Web);
                if (this.authService.currentUserValue.tenantId && !escapeUrls.includes(request.url)) {
                    newBody['tenantId'] = this.authService.currentUserValue.tenantId;
                }
                if(this.authService.currentUserValue.userId){
                    newBody['userId'] = this.authService.currentUserValue.userId;
                }
                if (request.body.paginator) {
                    newBody['pageNumber'] = request.body.paginator.page;
                    newBody['pageSize'] = request.body.paginator.pageSize;
                }
                if (request.body.filter) {
                    newBody['searchCriteriaList'] = [];
                    Object.keys(request.body.filter).forEach(f => {
                        if(["skipPagination", "customerId", "tenantId"].indexOf(f) > -1){
                            newBody[f] = request.body.filter[f];
                        } else {
                            newBody['searchCriteriaList'].push({propertyName: f, propertyValue: request.body.filter[f]});
                        }
                    });
                }
                request =  request.clone({
                  body: {...request.body, ...newBody}
                })
            } 
        }

        return next.handle(this.addTokenToRequest(request, this.authService.getAuthToken()))
        .pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // change the response body here

                    let body = event.body;
                    if(body){
                        body.total = body.count;
                        body.items = body.results;
                    }

                    if(body.status && body.status.statusCode == 1){
                        body.errorMessage = body.status.errorMessages.map(er => er.messageDescription).join(", ");
                    } 

                    return event.clone({ body });
                }
                return event;
            }),
            catchError(err => {
                if (this.authService.getAuthToken() && err instanceof HttpErrorResponse) {
                    switch ((<HttpErrorResponse>err).status) {
                        case 401: 
                            return this.handle401Error(request, next);
                        case 400:
                            // this.authService.logout(); 
                    }
                }
            	return this.handleError(err);
            }));
    }

    private addTokenToRequest(request: HttpRequest<any>, token: string) : HttpRequest<any> {
    	request = request.clone({ headers: request.headers.set('application-type', String(ApplicationType.Web)) });
    	
        if(request.url.indexOf("oauth/token") > -1 || request.url.indexOf("auth/createotp") > -1 || request.url.indexOf("user/signup") > -1){
            request = request.clone({ headers: request.headers.set('Authorization', 'Basic MTpteS1zZWNyZXQta2V5') });
        } else if (token){
            request = request.clone({ headers: request.headers.set('intensifyat', `Bearer ${token}`) });
        }
        
        if(request.url.indexOf("oauth/token") > -1){
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/x-www-form-urlencoded') });
        } else {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
        
        return request;
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {

        if(!this.isRefreshingToken) {
            this.isRefreshingToken = true;
 
            // Reset here so that the following requests wait until the token
            // comes back from the refreshToken call.
            this.tokenSubject.next(null);
 
            return this.authService.refreshToken()
                .pipe(
                    switchMap((tokenInfo: any) => { 
                        if(tokenInfo) {
                        	return next.handle(this.addTokenToRequest(request, this.authService.getAuthToken()));
                        }
                        return <any>this.authService.logout();
                    }),
                    catchError(err => {
                        this.authService.logout();
                        return throwError(err);
                    }),
                    finalize(() => {
                        this.isRefreshingToken = false;
                    })
                );
        } else {
            this.isRefreshingToken = false;
            
            return this.tokenSubject
                .pipe(filter(token => token != null),
                take(1),
                switchMap(token => {
                    return next.handle(this.addTokenToRequest(request, token));
                }));
        }
    }

    private handleError(err: any) {
    	let msg = "";
    	if(err){
    		if(err.status == 0){
    			msg = "No internet connectivity";
    		} else if (err.status && err.status.statusCode == ResponseStatusEnum.Failure) {
	            if (err.status.errorMessages.length > 0) {
	                msg = err.status.errorMessages[0].messageDescription;
	            }
	        } else if(err.error && err.error.error == "invalid_token" && err.error.error_description.indexOf("Invalid refresh token") > -1){
				err.error.error_description = "Session expired";
				msg = err.error.error_description;
				this.authService.logout();
			} else if(err.error && err.error.error && err.error.error_description){
	        	msg = err.error.error_description;
	        } else {
	            msg = 'Something went wrong. Please try again.';
	        }
    	}
		
		// if(msg) this.alertService.error(msg);

		return throwError(err);
    }

    private overrideUrlWithDomainPrefix(url: string) {
        if (url.indexOf('assets/') >= 0 || url.indexOf('http://') >= 0 || url.indexOf('https://') >= 0) {
            return url;
        }
        return environment.getApiUrl(this.skipApiPrefix(url)) + url;
    }
    
    private skipApiPrefix(url){
        return url.indexOf("oauth/token") > -1;
    }
}