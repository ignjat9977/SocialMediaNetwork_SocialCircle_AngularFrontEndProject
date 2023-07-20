import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IsLoggedAdmin } from 'src/app/config/config';
import { IPageResponse } from 'src/app/interfaces/i-page-response';
import { IUser } from 'src/app/interfaces/i-user';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit{
  pageResponse: IPageResponse<IUser>
  users: Array<IUser>
  totalCount: number
  page:number = 1
  perPage:number
  userExist: boolean
  userCantBeDeleted: boolean
  whyCantBeDeleted: string
  @ViewChild("searchText") searchText: ElementRef
  constructor(private userService: UserService,
    private router: Router){}
  ngOnInit(): void {
    var isLogged = IsLoggedAdmin()
    console.log(isLogged)
    if(!isLogged){
      this.router.navigate(['/sign-up']);
    }
    this.getUsers("")
  }
  getUsers(keyword:string):void{


    this.userService.getAllUsers(keyword).subscribe({
      next:(data:IPageResponse<IUser>)=>{
        this.users = data.items
        this.totalCount = data.totalCount
        this.page = data.currentPage
        this.perPage = data.itemsPerPage
        if(this.users.length){
          this.userExist = true
        }else{
          this.userExist = false
        }
      },
      error: err=>{

      }

    })
  }
  blockUser(id:number):void{
    this.userService.blockUser(id).subscribe({
      next: (data:any)=>{
        this.getUsers("")
        this.userCantBeDeleted = false
        this.whyCantBeDeleted = ''
      },
      error: (err:any)=>{
        this.userCantBeDeleted = true
        this.whyCantBeDeleted = "Server error please try again later!"
      }
    })
  }
  onPageChange(page:any):void{
    this.page = page

    if(page!=1)
      this.search()
    else
    {
      this.page = 1
      this.search()
    }
  }
  search():void{
    var keyword="?Keyword="

    var wordToSearch = this.searchText.nativeElement.value

    if(wordToSearch != "")
    {
      keyword += wordToSearch
    }

    keyword += "&Page=" + this.page

    this.getUsers(keyword)
  }
}
