import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getUser } from 'src/app/config/config';
import { IPageResponse } from 'src/app/interfaces/i-page-response';
import { IUser } from 'src/app/interfaces/i-user';
import { EventService } from 'src/app/services/events/event.service';
import { FriendService } from 'src/app/services/friends/friend.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: IPageResponse<IUser> = { items: [], totalCount: 0, itemsPerPage: 0, currentPage: 0 };
  totalCount: number
  perPage: number
  page: number = 1
  isActive: boolean
  search: string
  friends:any
  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private userService: UserService,
    private friendService: FriendService,
    private  router: Router
  ) {}

  ngOnInit(): void {
    this.eventService.search$.subscribe(search => {
      if (search == undefined) {
        search = "";
      }
      this.search = search
      this.page =1
      
      this.getUsers("?Keyword=" + this.search + "&Page=" + this.page)
      
    });
  }
  messageFriend(friendId:number):void{
    this.eventService.sendMessageFriend(friendId);

    this.router.navigate(["/index/messages"])
  }
  addFriend(friendId:number):void{
    var user = getUser()
    var idCurrentUser = user.UserId
    var body = {
      "friendId":friendId,
      "userId":idCurrentUser
    }
    this.friendService.addFriend(body).subscribe({
      next: (data:any)=>{
        console.log(data);
        this.users.items.forEach((f:any)=>{
          if(f.id==friendId){
            f.isAlreadyMyFriend = true
          }
        })
        this.eventService.emitGetFriends(true)
      },
      error: (error:any)=>{
        console.log(error)
      }
    })
  }
  getUsers(keyword: string | null): void {
    this.isActive = true
    this.users = { items: [], totalCount: 0, itemsPerPage: 0, currentPage: 0 }
    this.userService.getAllUsers(keyword).subscribe({
      next: (data: IPageResponse<IUser>) => {
        this.users = data;
        console.log(this.users.items)
        if(data.items.length==0)
          this.isActive = false
        this.totalCount = data.totalCount
        this.perPage = data.itemsPerPage
        this.page = data.currentPage

        this.friendService.getFriendsAndFriendsOfFriends("?Id="+ getUser().UserId).subscribe({
          next:(data:any)=>{
            this.friends = data.friends
            
            this.users.items.forEach((u: any) => {
              let found = false
  
              this.friends.forEach((f: any) => {
                if (u.id == f.id) {
                  found = true
                }
              })
              u.isAlreadyMyFriend = found ? true : false
            });

            console.log(this.users.items)
          },
          error: error=>{
  
          }
        })
        
      },
      error: err => {
        
      }
    });
  }

  onPageChange(page: any) {
    this.page = page

    this.getUsers("?Keyword=" + this.search + "&Page=" + this.page);
  }
}
