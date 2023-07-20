import { Component } from '@angular/core';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SCProject';
  /**
   *
   */
  constructor(private render: Renderer2) {
    render.addClass(document.body,"sign-in")
  }
  ngOnInit() {
    //this.render.addClass(document.body, 'sign-in');
  }
}
