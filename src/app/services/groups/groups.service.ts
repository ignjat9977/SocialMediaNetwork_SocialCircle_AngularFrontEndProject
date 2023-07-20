import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpOptions, pathLinks } from 'src/app/config/config';
import { IGroup } from 'src/app/interfaces/i-group';
import { IPageResponse } from 'src/app/interfaces/i-page-response';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor(private http: HttpClient) { }

  getAllGroups(query:string):Observable<IPageResponse<IGroup>>{
    return this.http.get<IPageResponse<IGroup>>(pathLinks.globalUrl+"Group" + query,httpOptions);
  }
}
