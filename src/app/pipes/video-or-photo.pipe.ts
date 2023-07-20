import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'videoOrPhoto'
})
export class VideoOrPhotoPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    const imageExtensions = ['jpg', 'jpeg', 'png'];
    const videoExtensions = ['mp4', 'mov', 'wmv'];
    const fileExtension = value.split('.').pop().toLowerCase();

    if (imageExtensions.includes(fileExtension)) {
      return 'image';
    } else if (videoExtensions.includes(fileExtension)) {
      return 'video';
    } else {
      return 'image';
    }
  }

}
