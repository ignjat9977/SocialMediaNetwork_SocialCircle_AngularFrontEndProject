import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IPageResponse } from 'src/app/interfaces/i-page-response';
import { IReport } from 'src/app/interfaces/i-report';
import { ReportService } from 'src/app/services/reports/report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  pageResponse: IPageResponse<IReport>
  reports: Array<IReport>
  totalCount: number
  page:number = 1 
  p:number = 1
  perPage:number
  reportExist: boolean
  @ViewChild("searchText") searchText: ElementRef
  @ViewChild("userId") numberField: ElementRef
  constructor(private reportsService: ReportService){}
  ngOnInit(): void {
    this.getReports("");
  }
  getReports(keyword:string){
    this.reportsService.getAllReports(keyword).subscribe({
      next:(data:IPageResponse<IReport>)=>{
        this.reports = data.items
        this.totalCount = data.totalCount
        this.page = data.currentPage
        this.perPage = data.itemsPerPage
        if(this.reports.length){
          this.reportExist = true
        }else{
          this.reportExist = false
        }
      },
      error: err=>{

      }

    })
  }
  search():void{
    var keyword="?Keyword="

    var wordToSearch = this.searchText.nativeElement.value

    if(wordToSearch != "")
    {
      keyword += wordToSearch
    }
    if(this.numberField.nativeElement.value != null){
      keyword+= "&UserId=" + this.numberField.nativeElement.value
    }
    keyword += "&Page=" + this.page

    this.getReports(keyword)
  }
  onPageChange(page : any):void{
    this.page = page

    if(page!=1)
      this.search()
    else
    {
      this.page = 1
      this.search()
    }
  }
}
