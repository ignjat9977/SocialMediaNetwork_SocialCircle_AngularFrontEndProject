import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { getUser } from 'src/app/config/config';
import { IInbox } from 'src/app/interfaces/i-inbox';
import { IMessages } from 'src/app/interfaces/i-messages';
import { ChatService } from 'src/app/services/chat/chat.service';
import { EventService } from 'src/app/services/events/event.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-inbox-messages',
  templateUrl: './inbox-messages.component.html',
  styleUrls: ['./inbox-messages.component.scss']
})
export class InboxMessagesComponent implements OnInit{
  messages: Array<IMessages> = []
  userId:number
  message : IMessages
  userToTextId:number
  userTOTextName:string
  userToTextImg: string
  @ViewChild("messageContainer") messCont: ElementRef
  @ViewChild("messageInput") messageInput: ElementRef
  
  @ViewChild("scrollDiv") scrollDiv: ElementRef

  constructor(private eventService: EventService,
    private chatService: ChatService,
    private userService: UserService){

  }
  ngOnInit(): void {
    this.userId = getUser().UserId
      this.eventService.messagesToShow$.subscribe((data:any)=>{
        if(data)
          this.chatService.getAllMessagesFromOneUserWhoTextedYou(data.chatUserId).subscribe({
            next: (messages:any)=>{
              
              this.messages = messages
              console.log("aAA")
              this.messages.forEach((data)=>{
                if(data.reciverId == this.userId){
                  this.userToTextId = data.senderId
                  this.userTOTextName = data.senderName
                  return
                }else{
                  this.userToTextId = data.reciverId
                  this.userTOTextName = data.reciverName
                  return
                }
              })
              this.messCont.nativeElement.classList.remove("hide-tab")
              this.messCont.nativeElement.classList.add("show-tab")

              setTimeout(() => {
                this.scrollDiv.nativeElement.scrollTop = this.scrollDiv.nativeElement.scrollHeight;
              }, 0);
            },
            error:err=>{
              if(err.status = 404){
                this.messages = []
                this.userService.getOneUser(data.chatUserId).subscribe({
                  next:(data)=>{
                    this.userToTextId = data.id
                    this.userTOTextName = data.firstName + " " + data.lastName
                    this.messCont.nativeElement.classList.remove("hide-tab")
                    this.messCont.nativeElement.classList.add("show-tab")
                  },
                  error:(data)=>{

                  }
                })
              }
            }
          })
      })
      this.eventService.messages$.subscribe((data:any)=>{
        if(data)
        if(this.userToTextId == data.reciverId){
          this.messages.push({
            reciverName:JSON.parse(getUser().ActorData).Identity, 
            reciverId:this.userId,
            senderId: this.userToTextId,
            senderName: this.userTOTextName,
            message:data.message,
            createdAt: new Date()
          })
        }
      })
  }
  sendMessage(reciver:number, sender:number):void{
    this.messageInput.nativeElement.value

    var body = {
      SenderId: String(sender),
      ReciverId: String(reciver),
      Message: this.messageInput.nativeElement.value
    }
    this.chatService.sendMessage(body).subscribe({
      next: (data:any)=>{
        this.message = 
        {
          reciverName:this.userTOTextName, 
          reciverId:this.userToTextId,
          senderId: this.userId,
          senderName: JSON.parse(getUser().ActorData).Identity,
          message:body.Message,
          createdAt: new Date()
        }
        this.messages.push(this.message)
      },
      error: (err:any)=>{

      }
    })
  }

  ngAfterViewInit(): void {
    
  }
}
