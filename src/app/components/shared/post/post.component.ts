import { TmplAstRecursiveVisitor } from '@angular/compiler';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getUser } from 'src/app/config/config';
import { IMainPost } from 'src/app/interfaces/i-main-post';
import { IMainUserPost } from 'src/app/interfaces/i-main-user-post';
import { IPost } from 'src/app/interfaces/i-post';
import { IUser } from 'src/app/interfaces/i-user';
import { CommentService } from 'src/app/services/comments/comment.service';
import { EventService } from 'src/app/services/events/event.service';
import { LikeService } from 'src/app/services/like/like.service';
import { ReporModalComponent } from '../repor-modal/repor-modal.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
 
  @Input() post: IPost|IMainPost
  @Input() userObj: IUser|IMainUserPost
  @Input() isYourPost: boolean
  @ViewChild("likeContainer") likes: ElementRef
  @ViewChild("postTabUl") postTab: ElementRef
  showComm:boolean = false
  postAComment: FormGroup
  ngOnInit(): void {
    this.postAComment = new FormGroup({
      commentContent: new FormControl('', [Validators.required])
      
    });
  }
  constructor(private commentService: CommentService,
     private eventService: EventService,
     private likeService: LikeService,
     private router: Router,
     private modalService: NgbModal){

  }
  postComment(postId:number){
    var user = getUser()
    var actorData = JSON.parse(user.ActorData);
    var id = actorData.Id

    var userId = id
    var obj = {
      "userId": id,
      "postId": postId,
      "content" : this.postAComment.get("commentContent").value
    }
    this.commentService.insertComment(obj).subscribe({
      next: (response:any)=>{
          console.log(response)
          this.eventService.emitGetPosts(true)
      },
      error: (error: any) => {

      }
    })
  }
  openModal(postId:number, reprotedUserId:number) {
    console.log(reprotedUserId)
    this.eventService.sendReprotUserData({postId:postId,reportedUserId:reprotedUserId})
    const modalRef = this.modalService.open(ReporModalComponent,{ backdrop: false })
    
  }
  likeAPost(id:number):void{
    console.log("asdasdasdsa")
    var body = {
      "postId":id,
      "userId":getUser().UserId
    }
    this.likeService.likePost(body).subscribe({
      next:(data:any)=>{
        console.log(data)
        var likes = this.likes.nativeElement.innerHTML;
        likes = Number(likes)
        likes++
        this.likes.nativeElement.innerHTML = likes
      },
      error:(error:any)=>{
        console.log(error)
      }
    })
  }
  showComments():void{
    if(this.showComm === false){
      this.showComm = true
    }else{
      this.showComm = false
    }
  }
  showPostTab():void{
    this.postTab.nativeElement.classList.add("active")
  }
  hidePostTab():void{
    this.postTab.nativeElement.classList.remove("active")
  }
  editPost(post:IPost|IMainPost):void{
    this.eventService.sendPost(post);
  }
  deletePost(id:number):void{
   this.eventService.sendIdPost(id);
  }
}
