import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { getUser } from 'src/app/config/config';
import { IInbox } from 'src/app/interfaces/i-inbox';
import { IPageResponse } from 'src/app/interfaces/i-page-response';
import { ChatService } from 'src/app/services/chat/chat.service';
import { InboxPartComponent } from '../../shared/inbox-part/inbox-part.component';
import { EventService } from 'src/app/services/events/event.service';
import { UserService } from 'src/app/services/users/user.service';
import { IMessages } from 'src/app/interfaces/i-messages';
import { IUser } from 'src/app/interfaces/i-user';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  @ViewChildren(InboxPartComponent) childComponents: QueryList<InboxPartComponent>;
  usersWhoTextedMe: IPageResponse<IUser>
  userId: number
  users: Array<IUser> = []
  usersExist: boolean = false
  myArrUsers : Array<IUser> = []
  myUser : any
  perPage:number
  page:number = 1
  totalCount:number
  @ViewChild("keyword") keyw : ElementRef
  constructor(private chatService: ChatService,
    private eventService: EventService,
    private userService:UserService,
    private changeDetectorRef: ChangeDetectorRef){}
  ngOnInit(): void {

    this.userId = getUser().UserId
    this.getUsers("")
    this.eventService.childComponentEmitter.subscribe((value:boolean)=>{
      if(value)
      {
        this.childComponents.forEach((component:InboxPartComponent)=>{
          const liElements = component.liElements.toArray();
          liElements.forEach((li:any)=>{
            li.nativeElement.classList.remove("active")
          })
        })
      }
    })

    this.eventService.messageFriend$.subscribe((id:any)=>{
      this.userService.getOneUser(id).subscribe({
        next:(data:IUser)=>{
          console.log("TTTtttTTT")
          this.myUser = {
            id:data.id,
            firstName : data.firstName,
            lastName : data.lastName,
            imagesPath : data.imagesPath
          }
          // if(this.users.length != 0)
          //   this.changeDetectorRef.detach(); 
          var counter = 0
          this.users.forEach((d)=>{
            if(d.id == data.id){
              counter ++
            }
          })
          if(counter == 0){
            this.users.unshift(this.myUser)
            console.log("PPP")
          }
            

          this.usersExist = true
          // if(this.users.length == 1)
          //   this.changeDetectorRef.detectChanges()
        },
        error:(err:any)=>{

        }
      })
    }) 
        
  }
  search(){
    var keyword = "?Keyword="

    if(this.keyw.nativeElement.value != ""){
      keyword+=this.keyw.nativeElement.value
    }
    keyword += "&page=" + this.page
    this.getUsers(keyword)
  }
  getUsers(keyword:string){
    this.chatService.getUsersITextedWith(keyword).subscribe({
      next: (data:IPageResponse<IUser>)=>{
        this.users = data.items
        this.totalCount = data.totalCount
        this.page = data.currentPage,
        this.perPage = data.itemsPerPage

        if(this.users.length != 0){
          this.usersExist = true
        }else{
          this.usersExist = false
        }
      }
    })
  }
  onPageChange(page: any) {
    this.page = page

    if(page!=1)
      this.search();
    else{
      this.page = 1
      this.search()
    }
  }

}
