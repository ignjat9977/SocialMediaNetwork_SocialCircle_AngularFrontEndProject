import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token } from '@angular/compiler';
import { httpOptions, pathLinks } from 'src/app/config/config';
import { IToken } from 'src/app/interfaces/token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private http: HttpClient) { }


  getToken(authInfo:any): Observable<IToken>{
    return this.http.post<IToken>(pathLinks.globalUrl + "Token", authInfo)
  }
  removeToken() :any{
    return this.http.delete(pathLinks.globalUrl + "Token",httpOptions)
  }
  registerUser(body:any):any{
    return this.http.post(pathLinks.globalUrl + "Register", body);
  }
}
