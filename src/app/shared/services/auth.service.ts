import { Injectable, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";
import { catchError, finalize, map, mergeMap, switchMap } from "rxjs/operators";
import { AuthModel } from "src/app/auth/_models/auth.model";
import { UserModel } from "src/app/auth/_models/user.model";
import { environment } from "src/environments/environment";
import { AuthHTTPService } from "./auth-http.service";


@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnDestroy {
    private unsubscribe: Subscription[] = [];
    private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

    isLoading$: Observable<boolean>;
    isLoadingSubject: BehaviorSubject<boolean>;
    currentUserSubject: BehaviorSubject<UserModel>;
    currentUser$: Observable<UserModel>;

    constructor( private http: AuthHTTPService,private router: Router){
        this.isLoadingSubject = new BehaviorSubject<boolean>(false);
        this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
        this.currentUser$ = this.currentUserSubject.asObservable();
        this.isLoading$ = this.isLoadingSubject.asObservable();
    }

    login(email: string, password: string): Observable<UserModel> {
     this.isLoadingSubject.next(true);
     return this.http.login(email, password).pipe(
        map((auth: AuthModel) => {
          const result = this.setAuthFromLocalStorage(auth);
          return result;
        }),
        switchMap(() => this.getUserByToken()),
        mergeMap(() => this.findCustomerTemplates()),
        catchError((err) => {
          console.error('err', err);
          return of(undefined);
        }),
        finalize(() => this.isLoadingSubject.next(false))
      );
    }
   
private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth access_token/refresh_token/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.access_token) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  getUserByToken(): Observable<UserModel> {
    let auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    let loggedInUserGuid = "";
    try{
        loggedInUserGuid = JSON.parse(atob(auth.access_token.split(".")[1])).sub;
    }catch(e){}

    this.isLoadingSubject.next(true);
    return this.http.getUserByToken({ skipUserId: true, userId: loggedInUserGuid, guid: loggedInUserGuid }).pipe(
      map((result: any) => {
        if (result && result.message) {
          auth = Object.assign(auth, result.message);
          this.setAuthFromLocalStorage(auth)
          this.currentUserSubject = new BehaviorSubject<UserModel>(result.message);
        } else {
          this.logout();
        }
        return result;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  findCustomerTemplates(): Observable<UserModel> {
    let auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    let loggedInUserGuid = "";
    try{
        loggedInUserGuid = JSON.parse(atob(auth.access_token.split(".")[1])).sub;
    }catch(e){}

    this.isLoadingSubject.next(true);
    return this.http.findCustomerTemplates().pipe(
      map((result: any) => {
        let customerTemplates = {};
        if (result && result.message && result.message.labels && result.message.labels.length > 0) {
           result.message.labels.map(d => {
              customerTemplates[d.code] = d.name;
          });
        }
        
        // this.currentUserValue.setCustomerTemplates(customerTemplates);
        this.currentUserValue.customerTemplates = customerTemplates;
        auth.customerTemplates = customerTemplates;
        this.setAuthFromLocalStorage(auth)

        return this.currentUserValue;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserModel) {
    this.currentUserSubject.next(user);
  }

  private getAuthFromLocalStorage(): UserModel {
    try {
      const authData = JSON.parse(
        localStorage.getItem(this.authLocalStorageToken)
      );
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }


  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }
  getAuthToken(){
    return this.getAuthFromLocalStorage()?.access_token;
  }
  refreshToken(): Observable<UserModel> {
    this.isLoadingSubject.next(true);
    return this.http.refreshToken(this.getRefreshToken()).pipe(
      map((auth: AuthModel) => {
        const result = this.setAuthFromLocalStorage(auth);
        return result;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  getRefreshToken(){
    return this.getAuthFromLocalStorage()?.refresh_token;
  }
  
  ngOnDestroy(){
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
}


}