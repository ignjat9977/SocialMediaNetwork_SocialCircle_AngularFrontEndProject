import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpOptions, pathLinks } from 'src/app/config/config';
import { IGroup } from 'src/app/interfaces/i-group';
import { IGroupSpecific } from 'src/app/interfaces/i-group-specific';
import { IPageResponse } from 'src/app/interfaces/i-page-response';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) { }

  getAllGroups(query:string):Observable<IPageResponse<IGroup>>{
    return this.http.get<IPageResponse<IGroup>>(pathLinks.globalUrl+"Group" + query,httpOptions);
  }

  getSpecificGroup(id:number):Observable<IGroupSpecific>{
    return this.http.get<IGroup>(pathLinks.globalUrl + "Group/" + id, httpOptions)
  }

  deleteGroup(id:number):any{
    return this.http.delete(pathLinks.globalUrl+"Group/"+id,httpOptions)
  }

  getAllGroupMembersById(id:number):Observable<Array<number>>{
    return this.http.get<Array<number>>(pathLinks.globalUrl + "GroupMembers/" + id, httpOptions)
  }
  makeAGroup(body:any):any{
    return this.http.post(pathLinks.globalUrl + "Group", body, httpOptions)
  }
  becomeGroupMember(body:any):any{
    return this.http.post(pathLinks.globalUrl + "GroupMembers", body, httpOptions)
  }
  leaveGroupMemberShip(id:number):any{
    return this.http.delete(pathLinks.globalUrl + "GroupMembers/" + id, httpOptions)
  }

}
