import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { getUser } from 'src/app/config/config';
import { IComment } from 'src/app/interfaces/i-comment';
import { CommentService } from 'src/app/services/comments/comment.service';
import { EventService } from 'src/app/services/events/event.service';
import { LikeService } from 'src/app/services/like/like.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit{
  ngOnInit(): void {
    this.postAComment = new FormGroup({
      commentContent: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(500)])
      
    });
  }
  @Input() comment: IComment
  @Input() postId: number
  @ViewChild("likeContainer") likes: ElementRef
  showReComment: boolean = false
  postAComment: FormGroup
  constructor(private commentService: CommentService,
     private eventService: EventService,
     private likeService: LikeService){

  }
  replay():void{
    if(this.showReComment == false)
      this.showReComment = true
    else
      this.showReComment = false
  }
  postComment(comment:IComment):void{
    if (this.postAComment.valid) {
      var parentId = comment.id
      var user = getUser()
      var actorData = JSON.parse(user.ActorData);
      var id = actorData.Id

      var userId = id
      var obj = {
        "userId": id,
        "parentId": comment.id,
        "postId": this.postId,
        "content" : this.postAComment.get("commentContent").value
      }
      console.log(comment);
      this.commentService.insertComment(obj).subscribe({
        next: (response:any)=>{
            console.log(response)
            this.eventService.emitGetPosts(true)
        },
        error: (error: any) => {

        }
      })

    } else {
      this.postAComment.controls['commentContent'].markAsTouched();
    }
  }
  likeAComment(id:number):void{
    var body = {
      "commentId":id,
      "userId":getUser().UserId
    }
    this.likeService.likeComment(body).subscribe({
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
}
