import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ILog } from 'src/app/interfaces/i-log';
import { IPageResponse } from 'src/app/interfaces/i-page-response';
import { Observable } from 'rxjs';
import { httpOptions, pathLinks } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http: HttpClient) { }

  getAllLogs(keyword:string):Observable<IPageResponse<ILog>>{
    return this.http.get<IPageResponse<ILog>>(pathLinks.globalUrl + "AuditLog" +keyword, httpOptions)
  }
}
