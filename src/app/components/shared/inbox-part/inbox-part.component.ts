import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { getLocalStorage, setLocalStorage } from 'src/app/config/config';
import { IInbox } from 'src/app/interfaces/i-inbox';
import { IMessages } from 'src/app/interfaces/i-messages';
import { EventService } from 'src/app/services/events/event.service';

@Component({
  selector: 'app-inbox-part',
  templateUrl: './inbox-part.component.html',
  styleUrls: ['./inbox-part.component.scss']
})
export class InboxPartComponent implements OnInit{
  constructor(private eventService: EventService){}
  
  @Input() chatUserName: string
  @Input() chatUserId: number
  @Input() messages: IInbox
  @Input() imageUrl: string
  ids:any = []
  counter:number = 0
  @ViewChildren('liElement') liElements: QueryList<any>;
  @ViewChild('noti') noti: ElementRef
  beforeActive: HTMLLIElement = null
  mess: Array<any> = []
  newMess: Array<any> = []

  ngOnInit(): void {
    this.mess = getLocalStorage("messages")
    if(this.mess != null){
      this.mess.forEach((el:any) => {
        console.log(el.senderId)
        console.log(this.chatUserId)
        if(el.reciverId == this.chatUserId){
          this.counter++
          console.log("BBB")
        }
      })
    }
    
  }
  ngAfterViewInit():void{
    
    if(this.noti){

      this.noti.nativeElement.classList.remove("hide-tab")
      this.noti.nativeElement.classList.add("show-tab")
    }
  }

  showMessagesFromInboxPart(s:HTMLLIElement, id:number):void{
    this.mess = getLocalStorage("messages")
    if(this.mess){
      this.mess.forEach((el:any) => {
        if(el.reciverId != this.chatUserId){
          this.newMess.push(el)
        }
      })

    }
    this.mess = this.newMess
    setLocalStorage("messages", this.newMess)
    this.counter = 0
    this.eventService.emitChildElements(true)

    s.classList.add("active")
    var obj = {
      chatUserId: this.chatUserId,
      imgUrl: this.imageUrl
    }
    this.eventService.sendMessagesToShow(obj)
  }
  
}
