import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pathLinks , token, httpOptions, getUser} from 'src/app/config/config';
import { IPageResponse } from 'src/app/interfaces/i-page-response';
import { IUser } from 'src/app/interfaces/i-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private http: HttpClient) { }

  getOneUser(id:number):Observable<IUser>{
    console.log(httpOptions)
    return this.http.get<IUser>(pathLinks.globalUrl+"Friend/" + id,httpOptions);
  }
  getAllUsers(keyword:string):Observable<IPageResponse<IUser>>{
    return this.http.get<IPageResponse<IUser>>(pathLinks.globalUrl + "User" +keyword, httpOptions)
  }
  blockUser(id:number):any{
    return this.http.delete(pathLinks.globalUrl + "User/" + id, httpOptions)
  }
  updateUserInfo(body:any):any{
    return this.http.put(pathLinks.globalUrl + "User/" + getUser().UserId, body,httpOptions)
  }
  insertNewProfilePhoto(body:any):any{
    return this.http.post(pathLinks.globalUrl + "User", body, httpOptions)
  }
}
