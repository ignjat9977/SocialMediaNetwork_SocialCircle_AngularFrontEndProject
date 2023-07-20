import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getUser } from 'src/app/config/config';
import { IUser } from 'src/app/interfaces/i-user';
import { EventService } from 'src/app/services/events/event.service';
import { FriendService } from 'src/app/services/friends/friend.service';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent implements OnInit {

  @Input() friend: IUser
  @Input() isYourFriend: boolean
  idCurrentUser: number

  constructor(private friendService: FriendService,
    private eventService: EventService,
    private router:Router){}

  ngOnInit(): void {
    var user = getUser()
    this.idCurrentUser = user.UserId
  }
  messageFriend(friendId:number):void{
    this.eventService.sendMessageFriend(friendId);

    this.router.navigate(["/index/messages"])
  }
  addFriend(id:number):void{
    var user = getUser()
    var idCurrentUser = user.UserId
    var body = {
      "friendId":id,
      "userId":idCurrentUser
    }
    this.friendService.addFriend(body).subscribe({
      next: (data:any)=>{
        console.log(data);
        this.isYourFriend = false
        this.eventService.emitGetFriends(true)
      },
      error: (error:any)=>{
        console.log(error)
      }
    })
  }
}
