import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getUser, isImageOrVideoExtension } from 'src/app/config/config';
import { IMainPost } from 'src/app/interfaces/i-main-post';
import { IMainUserPost } from 'src/app/interfaces/i-main-user-post';
import { IPageResponse } from 'src/app/interfaces/i-page-response';
import { IUser } from 'src/app/interfaces/i-user';
import { EventService } from 'src/app/services/events/event.service';
import { PostService } from 'src/app/services/posts/post.service';
import { ModalContentComponent } from '../../shared/modal-content/modal-content.component';
import { UserService } from 'src/app/services/users/user.service';
import { SignalRService } from 'src/app/services/signalR/signal-r.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  postImageOrVideo:FormGroup
  userObj:IUser
  posts:IMainPost[]
  totalCount:number
  perPage:number
  page:number
  showPosts:boolean = false
  postTextForm:FormGroup
  videoOrPhotoError: boolean = true
  selectedFile:File
  @ViewChild("post") iPup: ElementRef
  @ViewChild("imagePost") pPup: ElementRef
  constructor(private eventService: EventService,
    private postService: PostService,
    private router: Router,
    private modalService: NgbModal,
    private renderer: Renderer2,
    private userService: UserService,
    private signalRService: SignalRService){}
  ngOnInit(): void {
    console.log(getUser())
    this.userService.getOneUser(getUser().UserId).subscribe({
      next:(data:any) => this.userObj = data,
      error: error => console.log(error)
    })
    this.getPosts(null)
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
    this.eventService.getPostsEmitter.subscribe((value:boolean)=>{
      if(value){
        this.getPosts(this.page)
      }
    })
    
  }
  getPosts(page:number|null):void{
    var query = "?perPage=15"

    if(page!=null){
      this.page = page
      query = "?page="+page + "&perPage=15";
    }
    this.postService.getAllPostsForMainPage(query).subscribe({
      next: (data:IPageResponse<IMainPost>)=>{
        this.posts = data.items
        this.totalCount = data.totalCount
        this.perPage = data.itemsPerPage
        this.page = data.currentPage
        console.log(data)
        if(this.posts.length)
          this.showPosts = true
        else
          this.showPosts = false
      },
      error: (error:any)=>{

      }
    })
  }
  onPageChange(page: any) {
    // Ažuriranje trenutne stranice
    this.page = page
    // Pozovite metod search() kako biste ažurirali parametre pretrage na novu stranicu

    if(page!=1)
      this.getPosts(this.page);
    else{
      this.page = 1
      this.getPosts(this.page)
    }
  }
  submitPostText():void{
    if (this.postTextForm.valid) {
     var obj = {
      "Title": this.postTextForm.get("title").value,
      "Content": this.postTextForm.get("content").value,
      "PrivacyId": this.postTextForm.get("privacy").value == 'public'? 11 : 12,
      "UserId": getUser().UserId
     }
     this.postService.addPostText(obj).subscribe({
      next:(response:any)=>{
        console.log(response)
        this.router.navigate(["/index/my-profile"])
        
      },
      error:(error:any)=>{
        console.log(error)
      }
     })
    } else {
      this.postTextForm.markAllAsTouched()
    }
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
      formData.append('Content', this.postImageOrVideo.get("content").value);
      formData.append('PrivacyId', this.postImageOrVideo.get("privacy").value == 'public'? '11' : '12');
      formData.append('UserId', getUser().UserId,);
      formData.append('VideoOrPhoto', vOrP);
      formData.append('Image', this.selectedFile)
      formData.forEach((value,key) => {
        console.log(key+value)
         });
      this.postService.addPostPhotoOrVideo(formData).subscribe({
       next:(response:any)=>{
         console.log(response)
         this.router.navigate(["/index/my-profile"])
         
       },
       error:(error:any)=>{
         console.log(error)
       }
      })
     } else {
       this.postImageOrVideo.markAllAsTouched()
     }
  }
  postPopUp():void{
    
    this.iPup.nativeElement.classList.add("active")
  }
  postImagePopUp():void{
    this.pPup.nativeElement.classList.add("active") 
  }
  imageCancle():void{
    if(this.postImageOrVideo.dirty){
      this.openModal()
      this.renderer.setStyle(document.body, "overflow", "auto");
      this.eventService.okModalClickEmitter.subscribe((value:boolean)=>{
        if(true){
          this.renderer.removeClass(document.body, "modal-open");
          this.pPup.nativeElement.classList.remove("active")
          this.closeModal()
        }
      })
      this.eventService.cancleModalClickEmitter.subscribe((value:boolean)=>{
        if(true){
          this.renderer.removeClass(document.body, "modal-open");
          this.closeModal()
        }
      })
    }else{
      this.pPup.nativeElement.classList.remove("active")
    }
    
  }
  postCancle():void{
    if(this.postTextForm.dirty){
      this.openModal()
      this.renderer.setStyle(document.body, "overflow", "auto");
      this.eventService.okModalClickEmitter.subscribe((value:boolean)=>{
        if(true){
          this.renderer.removeClass(document.body, "modal-open");
          this.iPup.nativeElement.classList.remove("active")
          this.closeModal()
        }
      })
      this.eventService.cancleModalClickEmitter.subscribe((value:boolean)=>{
        if(true){
          this.renderer.removeClass(document.body, "modal-open");
          this.closeModal()
        }
      })
    }else{
      this.iPup.nativeElement.classList.remove("active")
    }
    
  }
  openModal() {
    const modalRef = this.modalService.open(ModalContentComponent,{ backdrop: false });
  }
  closeModal() {
    const modalRef = this.modalService.dismissAll(ModalContentComponent);
  }
 
}
