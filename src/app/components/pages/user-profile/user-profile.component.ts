import { DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { convertToDateTimeFormat, getUser } from 'src/app/config/config';
import { IPageResponse } from 'src/app/interfaces/i-page-response';
import { IPost } from 'src/app/interfaces/i-post';
import { IUser } from 'src/app/interfaces/i-user';
import { EventService } from 'src/app/services/events/event.service';
import { FriendService } from 'src/app/services/friends/friend.service';
import { PostService } from 'src/app/services/posts/post.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  id: number;
  isYourFriend: string
  userObj: IUser
  friends: Array<IUser>
  page:number = 1
  perPage:number = 10
  totalCount:number
  searchForm : FormGroup
  errorForm: boolean = false
  pageResponse: IPageResponse<IPost>
  posts : IPost[]
  showPosts: boolean=false
  @ViewChild("friendsTab") friendsTab:ElementRef
  @ViewChild("myPostsTab") postsTab:ElementRef
  @ViewChild("infoTab") infoTab:ElementRef
  

  constructor(private route: ActivatedRoute,
     private userService: UserService, 
     private friendService: FriendService,
     private eventService: EventService,
     private postService: PostService,
     private router: Router,
     private datePipe:DatePipe) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.isYourFriend = params['isF'];
      console.log(this.isYourFriend)
      var user = getUser()

      if(this.id == user.UserId){
        this.router.navigate(['/index/my-profile']);
      }
      this.userService.getOneUser(this.id).subscribe({
        next:(data:IUser)=>{
          this.userObj = data
        },
        error:error=>{
          
        }
      })
      this.getPosts("")
      this.searchForm= new FormGroup({
        from: new FormControl(''),
        to: new FormControl(''),
        keyword: new FormControl(''),
        hasComments: new FormControl(''),
        perPage: new FormControl('')
        
      });
      this.eventService.getPostsEmitter.subscribe((value:boolean)=>{
        if(value){
          this.getPosts("")
        }
      })
      this.friendService.getFriendsAndFriendsOfFriends("?Id="+this.id).subscribe({
        next:(data)=>{
            this.friends = data.friends

            this.eventService.friendsData$.subscribe((userNowFriends :any)=>{
              
            
              this.friends.forEach((ff:any)=>{
                userNowFriends.forEach((mf:any)=>{
                  if(ff.id===mf.id){
                    ff.isAlreadyMyFriend = true
                  }else{
                    ff.isAlreadyMyFriend = false
                  }
                })
              })
            })
        },
        error: error=>{
  
        }
      })
    });
  }
  onPageChange(page: any) {
    // Ažuriranje trenutne stranice
    this.page = page
    // Pozovite metod search() kako biste ažurirali parametre pretrage na novu stranicu

    if(page!=1)
      this.search();
  }
  getPosts(query:string):void{
    var isOrNot = true
    if(this.isYourFriend==='false'){
      isOrNot = false
    }
    var queryString = "?userId=" + this.id + "&isYourFriend="+ isOrNot + query
    this.postService.searchPostsOnUserWall(queryString).subscribe({
      next:(data:IPageResponse<IPost>)=>{
        this.pageResponse = data
        this.posts = data.items
        this.perPage = this.pageResponse.itemsPerPage
        this.totalCount = this.pageResponse.totalCount

        if(!this.pageResponse.items.length)
          this.showPosts = false
        else
          this.showPosts = true
      },
      error: (error)=>{

      }
    })
  }
  search():void{
    var from = this.searchForm.get("from").value
    var to = this.searchForm.get("to").value
    var keyword = this.searchForm.get("keyword").value
    var hasComments = this.searchForm.get("hasComments").value
    var perPage = this.searchForm.get("perPage").value
    this.perPage = perPage

    

    var dateFrom = convertToDateTimeFormat(from, this.datePipe)  
    var dateTo = convertToDateTimeFormat(to, this.datePipe)
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
  addFriend(id:number):void{
    var user = getUser()
    var idCurrentUser = user.UserId
    var body = {
      "friendId":id,
      "userId":idCurrentUser
    }
    this.friendService.addFriend(body).subscribe({
      next: (data:any)=>{
        console.log(data);
        this.router.navigate(['/index/user-profile/'+id + '/true']);
      },
      error: (error:any)=>{
        console.log(error)
      }
    })
  }
  removeFriend(id:number){
    this.friendService.removeFriend(id).subscribe({
      next: (response:any)=>{
        console.log(response)
        this.router.navigate(['/index/user-profile/'+this.id + '/false']);
        
      },
      error: error=>{
        console.log(error)
      }
    })
  }
  showFriendsTab(postsBtn:any,infoBtn:any,friendsBtn:any):void{
    this.friendsTab.nativeElement.classList.add("show-tab")
    this.friendsTab.nativeElement.classList.remove("hide-tab")
    this.postsTab.nativeElement.classList.remove("show-tab")
    this.postsTab.nativeElement.classList.add("hide-tab")
    this.infoTab.nativeElement.classList.remove("show-tab")
    this.infoTab.nativeElement.classList.add("hide-tab")

    postsBtn.classList.remove("active")
    infoBtn.classList.remove("active")
    friendsBtn.classList.add("active")
  }
  messageFriend(friendId:number):void{
    this.eventService.sendMessageFriend(friendId);

    this.router.navigate(["/index/messages"])
  }
  showInfoTab(postsBtn:any,infoBtn:any,friendsBtn:any):void{
    
    this.friendsTab.nativeElement.classList.remove("show-tab")
    this.friendsTab.nativeElement.classList.add("hide-tab")
    this.postsTab.nativeElement.classList.remove("show-tab")
    this.postsTab.nativeElement.classList.add("hide-tab")
    this.infoTab.nativeElement.classList.add("show-tab")
    this.infoTab.nativeElement.classList.remove("hide-tab")

    postsBtn.classList.remove("active")
    friendsBtn.classList.remove("active")
    infoBtn.classList.add("active")
  }
  showMyPostsTab(postsBtn:any,infoBtn:any,friendsBtn:any):void{
    
    this.friendsTab.nativeElement.classList.remove("show-tab")
    this.friendsTab.nativeElement.classList.add("hide-tab")
    this.postsTab.nativeElement.classList.add("show-tab")
    this.postsTab.nativeElement.classList.remove("hide-tab")
    this.infoTab.nativeElement.classList.remove("show-tab")
    this.infoTab.nativeElement.classList.add("hide-tab")

    postsBtn.classList.add("active")
    infoBtn.classList.remove("active")
    friendsBtn.classList.remove("active")
  }
}
