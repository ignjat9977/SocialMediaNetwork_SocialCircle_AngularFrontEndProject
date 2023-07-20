import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from 'src/app/services/events/event.service';

@Component({
  selector: 'app-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Closing Form</h4>
    </div>
    <div class="modal-body">
      Are you sure that you want to close a form?
    </div>
    <div class="modal-footer">
			<button type="button" class="btn btn-outline-secondary" (click)="cancleClick()">Cancel</button>
			<button type="button" class="btn btn-danger" (click)="okClick()">Ok</button>
		</div>
  `
})
export class ModalContentComponent {
  constructor(public modal: NgbActiveModal,
    private eventService: EventService) {}

  okClick():void{
    this.eventService.emitOk(true)
  }
  cancleClick():void{
    this.eventService.emitCancel(true)
  }
}

