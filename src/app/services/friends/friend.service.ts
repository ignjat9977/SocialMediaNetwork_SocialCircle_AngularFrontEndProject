import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { httpOptions, pathLinks } from 'src/app/config/config';
import { IFriendsAndFriendsOfFriends } from 'src/app/interfaces/i-friends-and-friends-of-friends';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  constructor( private http: HttpClient) { }

  getFriendsAndFriendsOfFriends(query: string): Observable<IFriendsAndFriendsOfFriends> {
    return this.http.get<IFriendsAndFriendsOfFriends>(pathLinks.globalUrl + "Friend" + query, httpOptions)
      .pipe(
        map((response:any)=> response as IFriendsAndFriendsOfFriends)
      );
  }
  addFriend(body: any): any{
    return this.http.post(pathLinks.globalUrl+"Friend",body,httpOptions)
  }
  removeFriend(id:number){
    return this.http.delete(pathLinks.globalUrl + "Friend/" + id, httpOptions);
  }
}
