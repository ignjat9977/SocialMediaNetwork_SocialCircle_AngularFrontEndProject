import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from 'src/app/services/events/event.service';
import { ReportService } from 'src/app/services/reports/report.service';

@Component({
  selector: 'app-repor-modal',
  template:`
	<div class="modal-header">
		<h4 class="modal-title text-white" id="modal-basic-title">Report Modal</h4>
	</div>
	<div class="modal-body">
		<form [formGroup]="reportForm" (ngSubmit)="sendReport()">
			<div class="mb-3">
				<label for="dateOfBirth">Report</label>
				<div class="d-flex flex-column">
					<textarea formControlName="description" id="" class="form-control" cols="30" rows="10"></textarea>
                    <div class="alert alert-danger sn-filed" *ngIf="reportForm.get('description').hasError('minlength') && reportForm.get('description').touched">
                    Description cant must be long at least 10 characters!
                    </div>
                    <div class="alert alert-danger sn-filed" *ngIf="reportForm.get('description').hasError('maxlength') && reportForm.get('description').touched">
                    Description cant be longer that 500 characters!
                    </div>
                    <div class="alert alert-danger sn-field" *ngIf="reportForm.get('description').errors?.['required'] && reportForm.get('description').touched">
                    Description is required!
                                                </div>
                    <button class="btn mt-4 btn-primary" type="submit">Send Report</button>
				</div>
			</div>
		</form>
	</div>
	<div class="modal-footer">
		<button type="button" class="btn btn-outline-dark" (click)="closeModal()">Close</button>
	</div>
  `
})
export class ReporModalComponent implements OnInit {
  closeResult = '';
  reportedUserId : number
  postId : number
  reportForm: FormGroup
	constructor(private modalService: NgbModal,
    private eventService: EventService,
    private reportService: ReportService) {}
  ngOnInit(): void {
    this.reportForm = new FormGroup({
      description: new FormControl('',[Validators.required,Validators.maxLength(500), Validators.minLength(10)]),
      
    });
    this.eventService.reportUserData$.subscribe((data)=>{
      this.reportedUserId = data.reportedUserId
      this.postId = data.postId
    })
  }
  closeModal() {
    const modalRef = this.modalService.dismissAll(ReporModalComponent);
  }
  sendReport():void{
    if(this.reportForm.valid){
      var description = this.reportForm.get("description").value

      var obj = {
        reportedUserId: this.reportedUserId,
        postId: this.postId,
        description : description
      }
      console.log(obj)
      this.reportService.sendReprot(obj).subscribe({
        next: (response:any)=>{
          this.modalService.dismissAll(ReporModalComponent);
        },
        error: (err:any)=>{
         
        }
      })
    }else{
      this.reportForm.markAllAsTouched()
    }
    
  }
}
