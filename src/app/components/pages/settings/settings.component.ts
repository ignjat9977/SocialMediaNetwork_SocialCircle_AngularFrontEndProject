import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getUser, removeToken } from 'src/app/config/config';
import { INotification } from 'src/app/interfaces/i-notification';
import { IPageResponse } from 'src/app/interfaces/i-page-response';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GroupService } from 'src/app/services/group/group.service';
import { NotificationService } from 'src/app/services/notifactions/notification.service';
import { SignalRService } from 'src/app/services/signalR/signal-r.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  notifications: Array<INotification>
  perPage: number
  page: number = 1
  totalCount: number
  groupForm: FormGroup
  infoForm: FormGroup
  constructor(private userService: UserService,
    private authService: AuthService,
    private signalRService: SignalRService,
    private router: Router,
    private notificationService: NotificationService,
    private groupService: GroupService){}
  ngOnInit(): void {
    var pattern = "^[A-Za-z0-9!@#$%%&*()+_(]{8,20}";
    
    this.infoForm = new FormGroup({
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required, Validators.pattern(pattern)]),
      firstName: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      lastName: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      
    });
    this.groupForm = new FormGroup({
      title: new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      content: new FormControl('',[Validators.required,Validators.minLength(10), Validators.maxLength(1000)]),
      privacy:new FormControl('',[Validators.required])
    });
    this.userService.getOneUser(getUser().UserId).subscribe({
      next: (data:any)=>{
        this.infoForm.get("email").setValue(data.email)
        this.infoForm.get("firstName").setValue(data.firstName)
        this.infoForm.get("lastName").setValue(data.lastName)
      },
      error: (error:any)=>{

      }
    })
    this.getNotifications("")
    
  }
  deleteNotification(id:number):void{
    this.notificationService.deleteNotification(id).subscribe({
      next:(response:any)=>{
        console.log(response)
        this.getNotifications("")
      },
      error: (err:any)=>{
        console.log(err)
      }
    })
  }
  getNotifications(query:string){
    query = "?Page=" + this.page
    this.notificationService.getAllNotifications(query).subscribe({
      next:(data:IPageResponse<INotification>)=>{
        this.notifications = data.items
        this.perPage = data.itemsPerPage
        this.page = data.currentPage
        this.totalCount = data.totalCount
      },
      error: (error:any)=>{
        console.log(error)
      }
    })
  }
  onPageChange(page:any){
    this.page = page
    // Pozovite metod search() kako biste ažurirali parametre pretrage na novu stranicu

    if(page!=1)
      this.getNotifications("");
    else{
      this.page = 1
      this.getNotifications("")
    }
  }
  deactivateAcc():void{
    this.userService.blockUser(getUser().UserId).subscribe({
      next:(data:any)=>{
        this.authService.removeToken().subscribe({
          next: (data:any)=>{
            console.log(data);
            removeToken()
            this.signalRService.stopConnection();
            this.router.navigate(['/sign-up'])
          },
          error: (error:any)=>{
            console.log(error)
          }
        })
      },
      error:(err:any)=>{

      }
    })
    
  }
  submitGroup():void{
    if(this.groupForm.valid){
      var body = {
        name: this.groupForm.get("title").value,
        description: this.groupForm.get("content").value,
        privacyId :  this.groupForm.get("privacy").value == 'public'? 11 : 12
      }
      this.groupService.makeAGroup(body).subscribe({
        next:(response:any)=>{
          console.log(response)
          this.router.navigate(["index/home"])
        },
        error:(err:any)=>{
          console.log(err)
        }
      })
    }else{
      this.groupForm.markAllAsTouched()
    }
  }
  submitInfo():void{
    if(this.infoForm.valid){
      this.userService.updateUserInfo({
        firstName: this.infoForm.get("firstName").value,
        lastName: this.infoForm.get("lastName").value,
        email: this.infoForm.get("email").value,
        password: this.infoForm.get("password").value
      }).subscribe({
        next:(response:any)=>{
          console.log(response)
        },
        error:(err:any)=>{
          console.log(err)
        }
      })
    }
    else{
      this.infoForm.markAllAsTouched()
    }
  }
}
