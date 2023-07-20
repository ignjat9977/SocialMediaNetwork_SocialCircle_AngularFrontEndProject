import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imagePipe'
})
export class ImagePipePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    if (value.startsWith("https")) {
      return value
    } else {
      return "http://localhost:5000/images/"+value
    }
  }

}
