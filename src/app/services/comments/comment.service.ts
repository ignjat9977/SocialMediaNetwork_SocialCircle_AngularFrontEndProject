import { query } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpOptions, pathLinks } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor( private http: HttpClient) { }

  insertComment(obj:any):any{
      return this.http.post(pathLinks.globalUrl+"Comments", obj, httpOptions)
  }
}
