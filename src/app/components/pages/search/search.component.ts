import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/events/event.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild("keyword") keyword: ElementRef
  search:string
  constructor(private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router){}
  ngOnInit(): void {
    
  }
  ngAfterViewInit():void{
    this.eventService.search$.subscribe(data=>{
      if(data == undefined)
      data = ""
      this.keyword.nativeElement.value = data
    })
  }
  sendSearch():void{
    this.eventService.sendSearch(this.keyword.nativeElement.value)
  }

}
