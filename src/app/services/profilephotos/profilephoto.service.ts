import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpOptions, pathLinks } from 'src/app/config/config';
import { IPhoto } from 'src/app/interfaces/i-photo';

@Injectable({
  providedIn: 'root'
})
export class ProfilephotoService {

  constructor(private http:HttpClient) { }


  getAllProfilePhotosOfUser(query:string): Observable<Array<IPhoto>>{
    return this.http.get<Array<IPhoto>>(pathLinks.globalUrl + "ProfilePhoto" + query, httpOptions)
  }
  deleteProfilePhoto(id:number):any{
    return this.http.delete(pathLinks.globalUrl + "ProfilePhoto/" + id, httpOptions)
  }
  updateActivePhoto(id:number):any{
    return this.http.put(pathLinks.globalUrl + "ProfilePhoto/" + id,{},httpOptions)
  }
}
