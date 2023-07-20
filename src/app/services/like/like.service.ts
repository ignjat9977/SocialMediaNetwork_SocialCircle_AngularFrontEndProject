import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpOptions, pathLinks } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  constructor( private http: HttpClient) { }

  likePost(body: any): any {
    return this.http.post(pathLinks.globalUrl+"LikePost",body,httpOptions)
  }
  likeComment(body: any): any{
    return this.http.post(pathLinks.globalUrl+"LikeComment",body,httpOptions)
  }
}
