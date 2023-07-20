import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpOptions, httpOptionsMTD, pathLinks } from 'src/app/config/config';
import { IMainPost } from 'src/app/interfaces/i-main-post';
import { IPageResponse } from 'src/app/interfaces/i-page-response';
import { IPost } from 'src/app/interfaces/i-post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor( private http: HttpClient) { }

  searchPostsOnUserWall(query:string):Observable<IPageResponse<IPost>>{
    return this.http.get<IPageResponse<IPost>>(pathLinks.globalUrl+"Posts" + query,httpOptions);
  }
  searchPostsOnGroupWall(query:string):Observable<IPageResponse<IMainPost>>{
    return this.http.get<IPageResponse<IMainPost>>(pathLinks.globalUrl+"PostGroup" + query,httpOptions);
  }
  getAllPostsForMainPage(query:string):Observable<IPageResponse<IMainPost>>{
    return this.http.get<IPageResponse<IMainPost>>(pathLinks.globalUrl+"AllPosts" + query,httpOptions);
  }
  addPostText(body:any):any{
    return this.http.post(pathLinks.globalUrl + "Posts",body,httpOptions);
  }
  addGroupPost(body:any):any{
    return this.http.post(pathLinks.globalUrl + "PostGroup",body,httpOptions);
  }
  addPostPhotoOrVideo(body:any){
    return this.http.post(pathLinks.globalUrl + "UploadPostPhotoVideo", body, httpOptionsMTD)
  }
  editPost(body:any){
    return this.http.put(pathLinks.globalUrl + "Posts/"+body.id, body, httpOptions)
  }
  deletePost(id:number){
    return this.http.delete(pathLinks.globalUrl + "Posts/" + id, httpOptions)
  }
}
