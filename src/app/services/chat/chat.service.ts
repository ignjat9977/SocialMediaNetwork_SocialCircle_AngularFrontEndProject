import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpOptions, pathLinks } from 'src/app/config/config';
import { IInbox } from 'src/app/interfaces/i-inbox';
import { IMessages } from 'src/app/interfaces/i-messages';
import { IPageResponse } from 'src/app/interfaces/i-page-response';
import { IUser } from 'src/app/interfaces/i-user';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  getUsersITextedWith(keyword: string): Observable<IPageResponse<IUser>>{
    return this.http.get<IPageResponse<IUser>>(pathLinks.globalUrl+"Chat"+keyword,httpOptions)
  }
  getAllMessagesFromOneUserWhoTextedYou(id:number): Observable<IMessages>{
    return this.http.get<IMessages>(pathLinks.globalUrl + "Chat/"+id,httpOptions)
  }
  sendMessage(body:any):any{
    return this.http.post(pathLinks.globalUrl + "Chat", body, httpOptions)
  }
}
