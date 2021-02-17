import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from 'src/app/auth/_models/user.model';
import { AuthModel } from 'src/app/auth/_models/auth.model';


const API_USERS_URL = `users`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) { }

  // public methods
  login(email: string, password: string): Observable<any> {
    return this.http.post<AuthModel>('oauth/token', `grant_type=password&username=${email}&password=${password}`);
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_USERS_URL}/forgot-password`, {
      email,
    });
  }

  getUserByToken(body): Observable<UserModel> {
    return this.http.post<UserModel>('auth/webLogin', body);
  }

  findCustomerTemplates(): Observable<any> {
    return this.http.post<UserModel>('template/findCustomerTemplates', {});
  }

  refreshToken(token): Observable<any> {
    return this.http.post<AuthModel>('oauth/token', `grant_type=refresh_token&refresh_token=${token}`);
  }
}
