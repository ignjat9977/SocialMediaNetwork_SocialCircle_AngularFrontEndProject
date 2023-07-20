import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getLocalStorage, getUser, isLoggedIn, removeToken, setLocalStorage } from 'src/app/config/config';
import { IUser } from 'src/app/interfaces/i-user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EventService } from 'src/app/services/events/event.service';
import { FriendService } from 'src/app/services/friends/friend.service';
import { SignalRService } from 'src/app/services/signalR/signal-r.service';
import { UserService } from 'src/app/services/users/user.service';
import { BaseComponent } from '../../shared/base/base.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  
  @ViewChild("userBox") userBox: ElementRef
  @ViewChild("notifications") notifications: ElementRef
  @ViewChild("messagesBox") messages: ElementRef
  @ViewChild("userName") userNameBox: ElementRef
  @ViewChild("imgHeader") imgHeader: ElementRef
  @ViewChild("nav") nav: ElementRef
  @ViewChild("menuBtn") menuBtn: ElementRef
  @ViewChild("search") search: ElementRef
  notificiationMessages: any = []
  messagesCounter: number = 0
  userObj: IUser
  notificationNotification : any = []
  notificationCounter: number = 0

  constructor(private userService: UserService,
     private router: Router, 
     private route: ActivatedRoute, 
     private eventService: EventService,
     private render: Renderer2,
     private friendService: FriendService,
     private authService: AuthService,
     private signalRService: SignalRService) {
      
  }
  ngOnInit(): void {

    this.eventService.profilePhotoChangeEmitter.subscribe((value:boolean)=>{
      if(value){
        this.userService.getOneUser(getUser().UserId).subscribe({
          next:(data:any)=>{
            this.userObj = data
          }
          ,error:(err:any)=>{
            
          }
        })
      }
    })

    this.signalRService.startConnection()
    getLocalStorage("messages")?this.notificiationMessages = getLocalStorage("messages"):""
    
    this.messagesCounter = this.notificiationMessages.length
    this.signalRService.registerMessageHandler((user: any, message: any) => {
      const date = new Date();
      const formattedDate = date.toLocaleString();
      var messageObj= {
        "user":user,
        "message":message.message,
        "createdAt": formattedDate,
        "senderId":message.reciverId,
        "reciverId":message.senderId
      }
      this.notificiationMessages.push(messageObj)
      this.eventService.sendMessages(messageObj)
      setLocalStorage("messages", this.notificiationMessages)
      this.messagesCounter = this.notificiationMessages.length
    });
    this.notificationCounter = this.notificationNotification.length
    this.signalRService.registerNotificationHandler((user: any, message: string) => {
    console.log("Notification successs")

      const date = new Date();
      const formattedDate = date.toLocaleString();
      var notificationObj= {
        "user":user,
        "message":message,
        "createdAt": formattedDate
      }
      this.notificationNotification.push(notificationObj)
      setLocalStorage("notifications", this.notificationNotification)
      
      this.notificationCounter = this.notificationNotification.length
    });
    var user = getUser()
    var id = user.UserId
    console.log(user.UserId)
    this.userService.getOneUser(id).subscribe({
      next:(data)=>{
        this.userObj = data
          
        this.eventService.sendData(data)
        
      },
      error:(error)=>{
        location.reload();
      }
    })
    this.friendService.getFriendsAndFriendsOfFriends("?Id="+id).subscribe({
      next:(data)=>{
          this.eventService.sendFriends(data.friends)
          this.eventService.sendFriendsAndFOf(data)
      },
      error: error=>{

      }
    })
    this.render.removeClass(document.body,"sign-in")
  }
  ngAfterViewInit(): void {
    var isLogged = isLoggedIn()

    if(!isLogged){
      this.router.navigate(['/sign-up']);
    }

    
    
    
   
  }
  emptyNotification():void{
    setLocalStorage("notifications", "")
    this.notificationNotification = []
    this.notificationCounter = 0
  }
  viewAllMessages():void{
    this.messagesCounter = 0
    this.notificiationMessages = []
    this.router.navigate(["/index/messages"])
  }
  showUserBox():void{

    if(this.userBox.nativeElement.classList.contains("show-tab")){
      this.userBox.nativeElement.classList.add("hide-tab");
      this.userBox.nativeElement.classList.remove("show-tab");
    }else{
      this.userBox.nativeElement.classList.add("show-tab");
      this.userBox.nativeElement.classList.remove("hide-tab");
    }
  }
  showNotifications():void{
    if(this.notifications.nativeElement.classList.contains("show-tab")){
      this.notifications.nativeElement.classList.add("hide-tab");
      this.notifications.nativeElement.classList.remove("show-tab");
    }else{
      this.notifications.nativeElement.classList.add("show-tab");
      this.notifications.nativeElement.classList.remove("hide-tab");
    }
  }
  showMessages():void{
    if(this.messages.nativeElement.classList.contains("show-tab")){
      this.messages.nativeElement.classList.add("hide-tab");
      this.messages.nativeElement.classList.remove("show-tab");
    }else{
      this.messages.nativeElement.classList.add("show-tab");
      this.messages.nativeElement.classList.remove("hide-tab");
    }
  }
  
  showNav():void{
    if(this.nav.nativeElement.classList.contains("active")){
      this.nav.nativeElement.classList.remove("active");
    }else{
      this.nav.nativeElement.classList.add("active");
    }
  }
  goToSearchPage():void{
    var search = this.search.nativeElement.value
    if(search == "")
      search = null
    this.router.navigate(["/index/search/users"]);
    this.eventService.sendSearch(search)
  }
  logOut():void{
    
    this.authService.removeToken().subscribe({
      next: (data:any)=>{
        console.log(data);
        removeToken()
        this.signalRService.stopConnection();
        this.router.navigate(['/sign-up'])
      },
      error: (error:any)=>{
        console.log(error)
      }
    })
    
  }
}
