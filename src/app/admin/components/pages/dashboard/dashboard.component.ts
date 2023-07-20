
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IsLoggedAdmin, convertToDateTimeFormat } from 'src/app/config/config';
import { ILog } from 'src/app/interfaces/i-log';
  import { IPageResponse } from 'src/app/interfaces/i-page-response';
import { LogService } from 'src/app/services/logs/log.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {
    pageResponse: IPageResponse<ILog>
    logs: Array<ILog>
    totalCount: number
    page:number = 1
    perPage:number
    logsExist: boolean
    searchForm: FormGroup
    errorForm: boolean = false
    @ViewChild("searchText") searchText: ElementRef
    constructor(private logsService: LogService,
      private datePipe:DatePipe,
      private router : Router){}
    ngOnInit(): void {
      var isLogged = IsLoggedAdmin()
      console.log(isLogged)
      if(!isLogged){
        this.router.navigate(['/sign-up']);
      }
      this.searchForm= new FormGroup({
        from: new FormControl(''),
        to: new FormControl(''),
        keyword: new FormControl('')
        
      });
      this.getLogs("")
    }
    getLogs(keyword:string):void{
      console.log(keyword)
  
      this.logsService.getAllLogs(keyword).subscribe({
        next:(data:IPageResponse<ILog>)=>{
          this.logs = data.items
          this.totalCount = data.totalCount
          this.page = data.currentPage
          this.perPage = data.itemsPerPage
          console.log(data.items)
          if(this.logs.length){
            this.logsExist = true
          }else{
            this.logsExist = false
          }
        },
        error: err=>{
  
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
      var from = this.searchForm.get("from").value
      var to = this.searchForm.get("to").value
      var keyword = this.searchForm.get("keyword").value
      
      if(from == null)
        from = false

      if(to == null)
        to = false
        
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
      var query = "?"
      if(from){
        query+="ADateFrom="+dateFrom + "&"
      }
      if(to){
        query+="ADateTo="+dateTo + "&"
      }
      if(keyword){
        query+="AKeyword=" + keyword + "&"
      }
      query+="page=" + this.page
      this.getLogs(query)
    }
  }
  

