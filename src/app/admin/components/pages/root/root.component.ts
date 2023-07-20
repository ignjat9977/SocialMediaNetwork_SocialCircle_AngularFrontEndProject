import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { IsLoggedAdmin, getUser, isLoggedIn, removeToken } from 'src/app/config/config';
import { IUser } from 'src/app/interfaces/i-user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RootComponent implements OnInit{
  userObj:IUser
  @ViewChild("dropDown") dd : ElementRef
  @ViewChild("mainNav") nav : ElementRef
  constructor(private render : Renderer2,
    private router: Router,
    private userService: UserService,
    private authService: AuthService){}
  ngOnInit(): void {
    this.render.removeClass(document.body,"sign-in")
    this.render.addClass(document.body, "blackkk")
    var isLogged = IsLoggedAdmin()
    console.log(isLogged)
    if(!isLogged){
      this.router.navigate(['/sign-up']);
    }else{
      this.router.navigate(["/admin/dashboard"])
    }
    this.userService.getOneUser(getUser().UserId).subscribe({
      next:(data:IUser)=>{
        this.userObj = data
      },
      error: err=>{
        location.reload()
      }
    })
  }
  logout():void{
    
    this.authService.removeToken().subscribe({
      next: (data:any)=>{
        console.log(data);
        removeToken()
        this.router.navigate(['/sign-up'])
      },
      error: (error:any)=>{
        console.log(error)
      }
    })
    
  }
  showDD():void{
    if(this.dd.nativeElement.classList.contains("show-tab")){
      this.dd.nativeElement.classList.add("hide-tab")
      this.dd.nativeElement.classList.remove("show-tab")
    }else{
      this.dd.nativeElement.classList.remove("hide-tab")
      this.dd.nativeElement.classList.add("show-tab")
    }
  }
  showMinimizeNav():void{


    if(!this.nav.nativeElement.classList.contains("active")){
      this.nav.nativeElement.classList.add("active")
      console.log("nav")
    }else{
      this.nav.nativeElement.classList.remove("active")
    }
    
  }
}
