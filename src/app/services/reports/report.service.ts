import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpOptions, pathLinks } from 'src/app/config/config';
import { IPageResponse } from 'src/app/interfaces/i-page-response';
import { IReport } from 'src/app/interfaces/i-report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor( private http: HttpClient) { }

  sendReprot(body:any):any{
    return this.http.post(pathLinks.globalUrl + "Reports", body, httpOptions)
  }

  getAllReports(query:string) : Observable<IPageResponse<IReport>>{

    return this.http.get<IPageResponse<IReport>>(pathLinks.globalUrl + "Reports"+query,httpOptions )             
  }
}
