import { ChatService } from './chat.service';
import { localUrl } from './../../constants';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, config } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { ProcessHttpmsgService } from './process-httpmsg.service';

interface AuthResponse {
  status: string;
  success: string;
  token: string;
}

interface JWTResponse {
  status: string;
  success: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  tokenKey = 'JWT';
  isAuthenticated: Boolean = false;
  username: Subject<string> = new Subject<string>();
  authToken: string = undefined;
  id: Subject<string> = new Subject<string>();
  loggedIn: Subject<Boolean> = new Subject<Boolean>();
  loggedOut: Subject<Boolean> = new Subject<Boolean>();
  firstname: Subject<string> = new Subject<string>();
  lastname: Subject<string> = new Subject<string>();
  company: Subject<any> = new Subject<any>();
  education: Subject<any> = new Subject<any>();
  skills: Subject<any> = new Subject<any>();
  response: any;
  fname: string;
  lname: string;
  role: Subject<string> = new Subject<string>();
  string_id: string;
  string_user: string;

  constructor(private http: HttpClient, private processHTTPMsgService: ProcessHttpmsgService, private router: Router, private chatService: ChatService) { }

  checkJWTtoken() {
    this.http.get<JWTResponse>(localUrl + 'users/checkJWTToken', {headers: new HttpHeaders({'Authorization': 'bearer ' + this.authToken})})
    .subscribe(res => {
      console.log('JWT Token Valid: ', res);
      this.sendUsername(res.user.username);
      this.sendId(res.user._id);
      this.chatService.sendId(res.user._id);
      this.sendLoggedIn(true);
    },
    err => {
      console.log('JWT Token invalid: ', err);
      this.destroyUserCredentials();
      this.logOut();

    });
  }

  sendRole(role: string) {
    this.role.next(role);
  }

  getRole() {
    return this.role.asObservable();
  }

  sendUsername(name: string) {
    this.string_user = name;
    this.username.next(name);
  }

  sendId(id: string) {
    this.id.next(id);
  }

  sendLoggedIn(status: Boolean) {
    this.loggedIn.next(status);
  }

  sendLoggedOut(status: Boolean) {
    this.loggedOut.next(status);
  }

  sendFirstname(fname: string) {
    this.fname = fname;
    this.firstname.next(fname);
  }

  sendLastname(lname: string) {
    this.lname = lname;
    this.lastname.next(lname);
  }

   clearUsername() {
     this.username.next(undefined);
   }

   loadUserCredentials() {

     const credentials = JSON.parse(localStorage.getItem(this.tokenKey));
     console.log('loadUserCredentials ', credentials);
     if (credentials && credentials.username !== undefined) {
      this.useCredentials(credentials);
      if (this.authToken) {
        this.checkJWTtoken();
      }

    }

  }

   storeUserCredentials(credentials: any) {
     console.log('storeUserCredentials ', credentials);
     localStorage.setItem(this.tokenKey, JSON.stringify(credentials));
     this.useCredentials(credentials);
   }

   useCredentials(credentials: any) {
     this.isAuthenticated = true;
     this.sendUsername(credentials.username);
     this.authToken = credentials.token;
     console.log('token is ' + this.authToken);
     const helper = new JwtHelperService();
     // console.log(helper.decodeToken(this.authToken));
     // this.id = helper.decodeToken(this.authToken)._id;
     // this.userid = helper.decodeToken(this.authToken)._id;
     // console.log('id is ' + this.id);
     this.sendId(helper.decodeToken(this.authToken)._id);
     this.sendLoggedIn(true);
     this.sendLoggedOut(false);
   }

   destroyUserCredentials() {
     this.authToken = undefined;
     this.clearUsername();
     this.isAuthenticated = false;
     localStorage.removeItem(this.tokenKey);
     this.sendLoggedOut(true);
     this.sendLoggedIn(false);
   }

   logIn(user: any): Observable<any> {
        return this.http.post<AuthResponse>(localUrl + 'users/login',
      {'username': user.username, 'password': user.password})
      .pipe( map(res => {
        const helper = new JwtHelperService();
        console.log(helper.decodeToken(res.token)._id);
        this.sendId(helper.decodeToken(res.token)._id);
        if (this.string_id) {
          console.log('Id to be sent for chat[if]: ' + this.string_id);
          this.chatService.sendId(this.string_id);
        } else {
          this.getId().subscribe(user_id => {
            this.string_id = user_id;
            console.log('Id to be sent for chat[else]: ' + this.string_id);
            this.chatService.sendId(this.string_id);
          });
      }
        this.response = res;
        this.sendFirstname(this.response.firstname);
        this.sendLastname(this.response.lastname);
        this.sendUsername(user.username);
          this.storeUserCredentials({username: user.username, token: res.token});
          return {'success': true, 'username': user.username, 'firstname': this.response.firstname, 'lastname': this.response.lastname };
      }),
       catchError(error => this.processHTTPMsgService.handleError(error)));

  }

  logOut() {
    this.destroyUserCredentials();
    this.chatService.sendDisconnect();
    this.sendLoggedIn(false);
    this.sendLoggedOut(true);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): Boolean {
    return this.isAuthenticated;
  }

  getUsername(): Observable<string> {
    return this.username.asObservable();
  }

  getId(): Observable<string> {
   return this.id.asObservable();
 }

  getToken(): string {
    return this.authToken;
  }

  getLoggedIn(): Observable<Boolean> {
    return this.loggedIn.asObservable();
  }

  getLoggedOut(): Observable<Boolean> {
   return this.loggedOut.asObservable();
 }

 getFirstName(): Observable<string> {
   return this.firstname.asObservable();
 }

 getLastName(): Observable<string> {
  return this.lastname.asObservable();
}

  signup(body: any): Observable<any> {
    return this.http.post<any>(localUrl + 'users/signup', body);
  }
}
