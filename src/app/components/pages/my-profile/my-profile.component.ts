import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BeforeSlideDetail, InitDetail } from 'lightgallery/lg-events';
import { convertToDateTimeFormat, getUser, isImageOrVideoExtension } from 'src/app/config/config';
import { IFriendsAndFriendsOfFriends } from 'src/app/interfaces/i-friends-and-friends-of-friends';
import { IPageResponse } from 'src/app/interfaces/i-page-response';
import { IPost } from 'src/app/interfaces/i-post';
import { IUser } from 'src/app/interfaces/i-user';
import { EventService } from 'src/app/services/events/event.service';
import { FriendService } from 'src/app/services/friends/friend.service';
import { PostService } from 'src/app/services/posts/post.service';
import { UserService } from 'src/app/services/users/user.service';
import lgZoom from 'lightgallery/plugins/zoom';
import { LightGallery } from 'lightgallery/lightgallery';
import { IPhoto } from 'src/app/interfaces/i-photo';
import { ProfilephotoService } from 'src/app/services/profilephotos/profilephoto.service';
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyProfileComponent implements OnInit{
  userObj: IUser
  page:number = 1
  perPage:number = 10
  totalCount:number
  searchForm : FormGroup
  editPostForm: FormGroup
  errorForm: boolean = false
  pageResponse: IPageResponse<IPost>
  posts : IPost[]
  showPosts: boolean=false
  id:number
  friends: Array<IUser>
  suggestedFriends: Array<IUser>
  isSearchPerformed: boolean = false;
  idEditPost: number
  isImage: boolean = true
  photos: Array<IPhoto>
  selectedFile: File
  @ViewChild("friendsTab") friendsTab:ElementRef
  @ViewChild("myPostsTab") postsTab:ElementRef
  @ViewChild("infoTab") infoTab:ElementRef
  @ViewChild("editPost") editPostTab:ElementRef
  @ViewChild("profilePhotos") profilePhotosTab:ElementRef
  @ViewChild("gallery") gallery:HTMLElement
  @ViewChild("thumbs") thumbs: ElementRef
  constructor(private eventService: EventService,
    private datePipe:DatePipe,
    private postService: PostService,
    private friendService: FriendService,
    private userService: UserService,
    private router:Router,
    private photoService: ProfilephotoService)
  {


  }
  ngOnInit(): void { 

    var user = getUser()
    this.id = user.UserId
    this.userService.getOneUser(this.id).subscribe({
      next:(data)=>{
        this.userObj = data
        
      },
      error:(error)=>{
      
      }
    })
    this.photoService.getAllProfilePhotosOfUser("").subscribe({
      next:(data:any)=>{
        this.photos = data
        console.log(data)
      },
      error:(err:any)=>{

      }
    })
    this.editPostForm = new FormGroup({
      title: new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      content: new FormControl('',[Validators.required,Validators.minLength(10), Validators.maxLength(1000)]),
      privacy:new FormControl('',[Validators.required]),
      imageOrVideo: new FormControl('', [Validators.required,Validators.pattern(/\.(jpg|jpeg|png|mp4|mov|wmv)$/)]),
      whichOne:new FormControl('',[Validators.required]),
    })

    console.log(this.id)
    this.searchForm= new FormGroup({
      from: new FormControl(''),
      to: new FormControl(''),
      keyword: new FormControl(''),
      hasComments: new FormControl(''),
      perPage: new FormControl('')
      
    });
    this.search()
    this.eventService.friendsAndFofData$.subscribe((data:IFriendsAndFriendsOfFriends)=>{
      if(data){
      
      this.friends = data.friends
      this.suggestedFriends = data.friendsOf
      }
    })

    this.eventService.post$.subscribe((post:any)=>{
      if(post){
        this.idEditPost = post.id
        this.editPostForm.get("title").setValue(post.title)
        this.editPostForm.get("content").setValue(post.content)
        this.editPostForm.get("privacy").setValue(post.privacy==11?"public":"private")
        this.editPostTab.nativeElement.classList.add("active")
      }
    })
    this.eventService.idPost$.subscribe((id:number)=>{
      if(id){
        this.postService.deletePost(id).subscribe({
          next:(response:any)=>{
            console.log(response);
            this.search()
          },
          error:error=>{
  
          }
        })
      }
      
    })
  }
  ngAfterViewInit():void{
   
    this.eventService.getPostsEmitter.subscribe((value:boolean)=>{
      if(value){
        this.search()
      }
    })
    this.eventService.addFriendEmitter.subscribe((value:boolean)=>{
      if(value)
        this.getFriends()
    })
  }
  cancleEditPost():void{
    this.editPostTab.nativeElement.classList.remove("active")
  }
  submitEdit():void{
    var obj = {
      "id":this.idEditPost,
      "privacyId":this.editPostForm.get("privacy").value=="public"?11:12,
      "title":this.editPostForm.get("title").value,
      "content":this.editPostForm.get("content").value,
    }

    this.postService.editPost(obj).subscribe({
      next: (response:any)=>{
        this.editPostTab.nativeElement.classList.remove("active")
        this.search()
      },
      error: err=>{

      }
    })
  }
  getFriends():void{
    this.friendService.getFriendsAndFriendsOfFriends("?Id="+this.id).subscribe({
      next:(data)=>{
        this.friends = data.friends
        this.suggestedFriends = data.friendsOf
        this.userObj.numberOfFriends++
      },
      error: error=>{

      }
    })
    
  }
  getPosts(query:string):void{
    
    var queryString = "?userId=" + this.id + query
    this.postService.searchPostsOnUserWall(queryString).subscribe({
      next:(data:IPageResponse<IPost>)=>{
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
  onPageChange(page: any) {
    this.page = page

    if(page!=1)
      this.search()
    
  }
  onFileSelect(event:any):void{
    const file = event.target.files[0]
    if (file instanceof File) {
      this.selectedFile = file
      var isImage = isImageOrVideoExtension(this.selectedFile.name)

      if(isImage == "image"){
        var formData = new FormData()

        formData.append("Image", this.selectedFile)
        formData.append("UserId", getUser().UserId)
  
        this.userService.insertNewProfilePhoto(formData).subscribe({
          next:(response:any)=>{
            console.log(response)
            this.isImage = true
            this.eventService.emitProfilePhoto(true)
            this.router.navigate(["/index/home"])
          },
          error:(err:any)=>{
            console.log(err)
          }
        })
      }else{
        this.isImage = false
      }
    
    }
  }
  search():void{
    
    var hasComments = this.searchForm.get("hasComments").value
    var perPage = this.searchForm.get("perPage").value
    this.perPage = perPage
    var from = this.searchForm.get("from").value
    var to = this.searchForm.get("to").value
    var keyword = this.searchForm.get("keyword").value
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
  deleteProfilePhoto(id:number):void{
    this.photoService.deleteProfilePhoto(id).subscribe({
      next:(data:any)=>{
        this.router.navigate(["/index/home"])
      },
      error:(err:any)=>{

      }
    })
  }
  setToMainProfilePhoto(id:number):void{
    this.photoService.updateActivePhoto(id).subscribe({
      next:(data:any)=>{
        this.eventService.emitProfilePhoto(true)
        this.router.navigate(["/index/home"])
      },
      error:(err:any)=>{

      }
    })
  }                     
  showFriendsTab(postsBtn:any,infoBtn:any,friendsBtn:any, ppBtn:any):void{
    this.friendsTab.nativeElement.classList.add("show-tab")
    this.friendsTab.nativeElement.classList.remove("hide-tab")
    this.postsTab.nativeElement.classList.remove("show-tab")
    this.postsTab.nativeElement.classList.add("hide-tab")
    this.infoTab.nativeElement.classList.remove("show-tab")
    this.infoTab.nativeElement.classList.add("hide-tab")
    this.profilePhotosTab.nativeElement.classList.remove("show-tab")
    this.profilePhotosTab.nativeElement.classList.add("hide-tab")
  
    ppBtn.classList.remove("active")
    postsBtn.classList.remove("active")
    infoBtn.classList.remove("active")
    friendsBtn.classList.add("active")
  }
  showInfoTab(postsBtn:any,infoBtn:any,friendsBtn:any, ppBtn:any):void{
    
    this.friendsTab.nativeElement.classList.remove("show-tab")
    this.friendsTab.nativeElement.classList.add("hide-tab")
    this.postsTab.nativeElement.classList.remove("show-tab")
    this.postsTab.nativeElement.classList.add("hide-tab")
    this.infoTab.nativeElement.classList.add("show-tab")
    this.infoTab.nativeElement.classList.remove("hide-tab")
    this.profilePhotosTab.nativeElement.classList.remove("show-tab")
    this.profilePhotosTab.nativeElement.classList.add("hide-tab")

    ppBtn.classList.remove("active")
    postsBtn.classList.remove("active")
    friendsBtn.classList.remove("active")
    infoBtn.classList.add("active")
  }
  showProfilePhotosTab(postsBtn:any,infoBtn:any,friendsBtn:any, ppBtn:any):void{
    
    this.friendsTab.nativeElement.classList.remove("show-tab")
    this.friendsTab.nativeElement.classList.add("hide-tab")
    this.postsTab.nativeElement.classList.remove("show-tab")
    this.postsTab.nativeElement.classList.add("hide-tab")
    this.infoTab.nativeElement.classList.remove("show-tab")
    this.infoTab.nativeElement.classList.add("hide-tab")
    this.profilePhotosTab.nativeElement.classList.add("show-tab")
    this.profilePhotosTab.nativeElement.classList.remove("hide-tab")
    infoBtn.classList.remove("active")
    postsBtn.classList.remove("active")
    friendsBtn.classList.remove("active")
    ppBtn.classList.add("active")
  }
  showMyPostsTab(postsBtn:any,infoBtn:any,friendsBtn:any, ppBtn:any):void{
    
    this.friendsTab.nativeElement.classList.remove("show-tab")
    this.friendsTab.nativeElement.classList.add("hide-tab")
    this.postsTab.nativeElement.classList.add("show-tab")
    this.postsTab.nativeElement.classList.remove("hide-tab")
    this.infoTab.nativeElement.classList.remove("show-tab")
    this.infoTab.nativeElement.classList.add("hide-tab")
    this.profilePhotosTab.nativeElement.classList.remove("show-tab")
    this.profilePhotosTab.nativeElement.classList.add("hide-tab")

    ppBtn.classList.remove("active")
    postsBtn.classList.add("active")
    infoBtn.classList.remove("active")
    friendsBtn.classList.remove("active")
  }
  settings = {
    counter: false,
    plugins: [lgZoom],
  };
  onBeforeSlide = (detail: BeforeSlideDetail): void => {


      const { index, prevIndex } = detail;
      console.log(index, prevIndex);
  };

}
