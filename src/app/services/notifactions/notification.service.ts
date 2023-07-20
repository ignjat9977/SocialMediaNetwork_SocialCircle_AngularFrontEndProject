import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpOptions, pathLinks } from 'src/app/config/config';
import { INotification } from 'src/app/interfaces/i-notification';
import { IPageResponse } from 'src/app/interfaces/i-page-response';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }


  getAllNotifications(query:string): Observable<IPageResponse<INotification>>{
    return this.http.get<IPageResponse<INotification>>(pathLinks.globalUrl + "Notification" + query, httpOptions)
  }
  deleteNotification(id:number):any{
    return this.http.delete(pathLinks.globalUrl + "Notification/" + id, httpOptions)
  }
}
