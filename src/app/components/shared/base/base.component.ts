import { Component, OnInit } from '@angular/core';
import { SignalRService } from 'src/app/services/signalR/signal-r.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export abstract class BaseComponent implements OnInit {
  constructor(protected signalRService: SignalRService) { }

  ngOnInit() {
  }

  abstract onReceiveMessage(arr:Array<any>): void;
  
  abstract onReceiveNotification(arr:Array<any>): void;
}
