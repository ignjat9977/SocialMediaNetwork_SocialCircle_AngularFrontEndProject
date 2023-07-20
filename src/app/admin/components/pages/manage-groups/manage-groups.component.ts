import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IsLoggedAdmin } from 'src/app/config/config';
import { IGroup } from 'src/app/interfaces/i-group';
import { IPageResponse } from 'src/app/interfaces/i-page-response';
import { GroupService } from 'src/app/services/group/group.service';

@Component({
  selector: 'app-manage-groups',
  templateUrl: './manage-groups.component.html',
  styleUrls: ['./manage-groups.component.scss']
})
export class ManageGroupsComponent implements OnInit {
  pageResponse: IPageResponse<IGroup>
  groups: Array<IGroup>
  totalCount: number
  page:number = 1
  perPage:number
  groupsExist: boolean
  groupCantBeDeleted: boolean
  whyCantBeDeleted: string
  @ViewChild("searchText") searchText: ElementRef
  constructor(private groupService: GroupService, private router: Router){}
  ngOnInit(): void {
    var isLogged = IsLoggedAdmin()
    console.log(isLogged)
    if(!isLogged){
      this.router.navigate(['/sign-up']);
    }
    this.getGroups("")
  }
  getGroups(keyword:string):void{


    this.groupService.getAllGroups(keyword).subscribe({
      next:(data:IPageResponse<IGroup>)=>{
        this.groups = data.items
        this.totalCount = data.totalCount
        this.page = data.currentPage
        this.perPage = data.itemsPerPage
        if(this.groups.length){
          this.groupsExist = true
        }else{
          this.groupsExist = false
        }
      },
      error: err=>{

      }

    })
  }
  deleteGroup(id:number):void{
    this.groupService.deleteGroup(id).subscribe({
      next: (data:any)=>{
        this.getGroups("")
        this.groupCantBeDeleted = false
        this.whyCantBeDeleted = ''
      },
      error: (err:any)=>{
        this.groupCantBeDeleted = true
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

    this.getGroups(keyword)
  }



}
