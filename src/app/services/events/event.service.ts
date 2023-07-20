import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from 'src/app/interfaces/i-user';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private dataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private friendsSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  private friendsAndFOfSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  private messagesSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  private postSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  private idPostSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  private searchSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  private messagesToShowSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  private messageFriendSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  private reportUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)

  data$: Observable<any> = this.dataSubject.asObservable();
  friendsData$: Observable<any> = this.friendsSubject.asObservable();
  friendsAndFofData$: Observable<any> = this.friendsAndFOfSubject.asObservable();
  messages$: Observable<any> = this.messagesSubject.asObservable();
  post$: Observable<any> = this.postSubject.asObservable();
  idPost$: Observable<any> = this.idPostSubject.asObservable();
  search$:Observable<any> = this.searchSubject.asObservable();
  messagesToShow$:Observable<any> = this.messagesToShowSubject.asObservable();
  messageFriend$:Observable<any> = this.messageFriendSubject.asObservable();
  reportUserData$: Observable<any> = this.reportUserSubject.asObservable()
  

  getPostsEmitter: EventEmitter<boolean> =new EventEmitter<boolean>()
  addFriendEmitter: EventEmitter<boolean> =new EventEmitter<boolean>()
  popUpEmitter: EventEmitter<boolean> =new EventEmitter<boolean>()
  okModalClickEmitter: EventEmitter<boolean> =new EventEmitter<boolean>()
  cancleModalClickEmitter: EventEmitter<boolean> =new EventEmitter<boolean>()
  childComponentEmitter: EventEmitter<boolean> =new EventEmitter<boolean>()
  profilePhotoChangeEmitter: EventEmitter<boolean> =new EventEmitter<boolean>()
  
  


  constructor() { }


  sendReprotUserData(data:any){
    this.reportUserSubject.next(data)
  }
  sendData(data: any) {
    this.dataSubject.next(data);
  }
  sendMessages(data: any) {
    this.messagesSubject.next(data);
  }
  sendFriends(data: any){
    this.friendsSubject.next(data);
  }
  sendMessageFriend(data:any){
    this.messageFriendSubject.next(data);
  }
  sendFriendsAndFOf(data: any){
    this.friendsAndFOfSubject.next(data);
  }
  sendPost(data: any){
    this.postSubject.next(data);
  }
  sendIdPost(id: number){
    this.idPostSubject.next(id);
  }
  sendSearch(search:any|null){
    this.searchSubject.next(search)
  }
  sendMessagesToShow(messages:any){
    this.messagesToShowSubject.next(messages)
  }
  emitGetPosts(value: boolean) {
    this.getPostsEmitter.emit(value);
  }
  emitGetFriends(value: boolean) {
    this.addFriendEmitter.emit(value);
  }
  emitPopUp(value: boolean) {
    this.addFriendEmitter.emit(value);
  }
  emitOk(value: boolean) {
    this.okModalClickEmitter.emit(value);
  }
  emitCancel(value: boolean) {
    this.cancleModalClickEmitter.emit(value);
  }
  emitChildElements(value:boolean){
    this.childComponentEmitter.emit(value)
  }
  emitProfilePhoto(value:boolean){
    this.profilePhotoChangeEmitter.emit(value)
  }
}

