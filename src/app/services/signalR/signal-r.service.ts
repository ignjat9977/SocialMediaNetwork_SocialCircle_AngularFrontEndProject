import { EventEmitter, Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { BehaviorSubject, Observable } from 'rxjs';

import { getUser, token } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  connection:any
  constructor() { }

  public startConnection(): void {
      try{
        this.connection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:5000/chatHub', {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
          accessTokenFactory: () => token()
        })
        .build();
  
        this.connection.start()

      }
      catch(error){
        console.log(error)
      }
    
      
  }

  public stopConnection(): void {
    if (this.connection) {
      this.connection.stop()
        .then(() => console.log('SignalR connection stopped.'))
        .catch((err:any) => console.error('Error while stopping SignalR connection:', err));
    }
  }

  public registerMessageHandler(callback: (user: any, message: any) => void): void {
    this.connection.on('ReceiveMessage', (user: any, message: any) => {
      callback(user, message);
    });
  }
  
  public registerNotificationHandler(callback: (user: any, message: string) => void): void {
    this.connection.on('ReceiveNotification', (user: any, message: string) => {
      callback(user, message);
    });
  }
  
}
