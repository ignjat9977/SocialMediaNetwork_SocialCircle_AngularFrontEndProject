import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { convertToDateTimeFormat, getUser, isImageOrVideoExtension } from 'src/app/config/config';
import { IGroupSpecific } from 'src/app/interfaces/i-group-specific';
import { IMainPost } from 'src/app/interfaces/i-main-post';
import { IPageResponse } from 'src/app/interfaces/i-page-response';
import { IPost } from 'src/app/interfaces/i-post';
import { IUser } from 'src/app/interfaces/i-user';
import { EventService } from 'src/app/services/events/event.service';
import { GroupService } from 'src/app/services/group/group.service';
import { PostService } from 'src/app/services/posts/post.service';

@Component({
  selector: 'app-single-group',
  templateUrl: './single-group.component.html',
  styleUrls: ['./single-group.component.scss']
})
export class SingleGroupComponent implements OnInit {
  groupId:number
  group : IGroupSpecific
  posts: Array<IMainPost>
  pageResponse: IPageResponse<IMainPost>
  perPage:number
  page:number = 1
  totalCount:number
  showPosts:boolean  = false
  imagesPatjs: Array<string> = []
  userObj: IUser 
  searchForm: FormGroup
  errorForm: boolean = false
  areUserGroupMember: boolean = false
  groupMembersIds:Array<number> = []
  postTextForm : FormGroup
  postImageOrVideo: FormGroup
  numberOfGroupMembers:number = 0
  selectedFile:File
  @ViewChild("post") postPoUp: ElementRef
  @ViewChild("imagePost") imageOrVideoPopUp:ElementRef
  videoOrPhotoError: boolean =false;
  constructor(private route : ActivatedRoute,
    private groupService: GroupService,
    private postService: PostService,
    private eventService: EventService,
    private datePipe:DatePipe){}

  ngOnInit(): void {

    this.eventService.getPostsEmitter.subscribe((value:boolean)=>{
      if(value)
        this.getPosts("")
    })
    this.postTextForm = new FormGroup({
      title: new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      content: new FormControl('',[Validators.required,Validators.minLength(10), Validators.maxLength(1000)]),
      privacy:new FormControl('',[Validators.required])
    });
    this.postImageOrVideo = new FormGroup({
      title: new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      content: new FormControl('',[Validators.required,Validators.minLength(10), Validators.maxLength(1000)]),
      privacy:new FormControl('',[Validators.required]),
      imageOrVideo: new FormControl('', [Validators.required,Validators.pattern(/\.(jpg|jpeg|png|mp4|mov|wmv)$/)]),
    })
    this.searchForm= new FormGroup({
      from: new FormControl(''),
      to: new FormControl(''),
      keyword: new FormControl(''),
      hasComments: new FormControl(''),
      perPage: new FormControl('')
      
    });
    this.userObj = {id:1,email:'asddsa', dateOfBirth: new Date(), numberOfFriends:33, isAlreadyMyFriend:null,firstName:"asd", lastName:"sadsa", imagesPath:this.imagesPatjs}
    this.route.params.subscribe((param:any)=>{
      this.groupId = param["id"]
      this.groupService.getSpecificGroup(this.groupId).subscribe({
        next:(data:any)=>{
          this.group = data
          this.getPosts("")
        },
        error: (error:any)=>{
          console.log(error)
        }
      })
      
      this.getGroupMembersById()


    })
    
  }
  submitPostText():void{
    if (this.postTextForm.valid) {
     var formData = new FormData()
      formData.append('Title', this.postTextForm.get("title").value);
      formData.append('GroupId', String(this.groupId));
      formData.append('Content', this.postTextForm.get("content").value);
      formData.append('PrivacyId', this.postTextForm.get("privacy").value == 'public'? '11' : '12');
      formData.append('UserId', getUser().UserId,);
      formData.append('VideoOrPhoto', "false");
      formData.append('File', null as File | null,)
     this.postService.addGroupPost(formData).subscribe({
      next:(response:any)=>{
        console.log(response)
        this.postCancle()
        this.getPosts("")
        
      },
      error:(error:any)=>{
        console.log(error)
      }
     })
    } else {
      this.postTextForm.markAllAsTouched()
    }
  }
  postCancle():void{
    this.postPoUp.nativeElement.classList.remove("active")
  }
  imageCancle():void{
    this.imageOrVideoPopUp.nativeElement.classList.remove("active")
  }
  pupUpFile():void{
    this.imageOrVideoPopUp.nativeElement.classList.add("active")
  }
  popUpPost():void{
    this.postPoUp.nativeElement.classList.add("active")
  }
  onFileSelect(event:any):void{
    const file = event.target.files[0]
    if (file instanceof File) {
      this.selectedFile = file
    }
  }
  submitImageOrVideoText():void{
    if (this.postImageOrVideo.valid) {
      var formData = new FormData()
      var isVideoOrPhoto = isImageOrVideoExtension(this.selectedFile.name)
      var vOrP = ""
      this.videoOrPhotoError = true
      if(isVideoOrPhoto == "image"){
        vOrP = "true"
        
      }else if(isVideoOrPhoto == "video"){
        vOrP = "false"
      }else{
        this.videoOrPhotoError = false
        return;
      }
      formData.append('Title', this.postImageOrVideo.get("title").value);
      formData.append('GroupId', String(this.groupId));
      formData.append('Content', this.postImageOrVideo.get("content").value);
      formData.append('PrivacyId', this.postImageOrVideo.get("privacy").value == 'public'? '11' : '12');
      formData.append('UserId', getUser().UserId,);
      formData.append('VideoOrPhoto', vOrP);
      formData.append('File', this.selectedFile)
      formData.forEach((value,key) => {
        console.log(key+value)
         });
      this.postService.addGroupPost(formData).subscribe({
       next:(response:any)=>{
         console.log(response)
         this.getPosts("")
         this.imageCancle()
       },
       error:(error:any)=>{
         console.log(error)
       }
      })
     } else {
       this.postImageOrVideo.markAllAsTouched()
     }
  }
  getGroupMembersById():void{
    this.groupService.getAllGroupMembersById(this.groupId).subscribe({
      next:(data:any)=>{
        this.groupMembersIds = data
        var counter = 0
        data.forEach((id:number) => {
          this.numberOfGroupMembers ++ 
          if(id == getUser().UserId){
            counter++
          }
        });

        if(counter == 0){
          this.areUserGroupMember = false
        }else{
          this.areUserGroupMember = true
        }
      },
      error:err=>{

      }
    })
  }
  becomeAMemberOfGroup():any{
    this.groupService.becomeGroupMember({
      groupId:this.groupId
    }).subscribe({
      next:(response:any)=>{
        this.areUserGroupMember = true
        this.numberOfGroupMembers++
      },
      error:(err:any)=>{

      }
    })
  }
  exitGroup():any{
    this.groupService.leaveGroupMemberShip(this.groupId).subscribe({
      next:(response:any)=>{
        this.areUserGroupMember = false
        this.numberOfGroupMembers--
      },
      error:(err:any)=>{

      }
    })
  }
  onPageChange(page:any){
    this.page = page
  
      if(page!=1)
        this.search()
     
    
    
  }
  search():void{
    var from = this.searchForm.get("from").value
    var to = this.searchForm.get("to").value
    var keyword = this.searchForm.get("keyword").value
    var hasComments = this.searchForm.get("hasComments").value
    var perPage = this.searchForm.get("perPage").value
    this.perPage = perPage

    var dateFrom
    var dateTo
    if(from!=null){
      dateFrom = convertToDateTimeFormat(from, this.datePipe)  
    }else{
      dateFrom = ""
    }
    if(to!=null){
      dateTo = convertToDateTimeFormat(to, this.datePipe)
    }else{
      dateFrom = ""
    }
    if(from && to)
      if(dateFrom === false || dateTo === false)
      {
        this.errorForm=true
        return
      }

    if(dateFrom > dateTo){
      this.errorForm = true
      return;
    }
    this.errorForm = false
    var query = "&"
    if(from){
      query+="dateFrom="+dateFrom + "&"
    }
    if(to){
      query+="dateTo="+dateTo + "&"
    }
    if(hasComments != 0){
      query+="hasComments="+hasComments+"&"
    }
    if(keyword){
      query+="keyword=" + keyword + "&"
    }
    if(perPage){
      query+="perPage=" + this.perPage + "&"
    }
    query+="page=" + this.page
    this.getPosts(query);
    
  }
  getPosts(query:string):void{
    
    var queryString = "?groupId=" + this.groupId + query
    this.postService.searchPostsOnGroupWall(queryString).subscribe({
      next:(data:IPageResponse<IMainPost>)=>{
        this.pageResponse = data
        this.posts = data.items
        this.perPage = this.pageResponse.itemsPerPage
        this.totalCount = this.pageResponse.totalCount
        console.log(data)
        if(!this.pageResponse.items)
          this.showPosts = false
        else
          this.showPosts = true
      },
      error: (error)=>{

      }
    })
  }

}
