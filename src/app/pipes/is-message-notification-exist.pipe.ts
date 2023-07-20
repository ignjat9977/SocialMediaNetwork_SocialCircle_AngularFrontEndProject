import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isMessageNotificationExist'
})
export class IsMessageNotificationExistPipe implements PipeTransform {

  transform(mess: number,allMes:any, ...args: unknown[]): unknown {
    var counter=0
    for(let i =0; i<allMes.length; i++){
      if(allMes[i]==mess){
        counter++;
      }
    }
    if(counter==0)
      return false

    return counter
  }

}
