import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDatepicker, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth/auth.service';
import { convertToDateTimeFormat, getUser, parseJwt, setLocalStorage, token } from 'src/app/config/config';
import { IToken } from 'src/app/interfaces/token';
import { Observable } from 'rxjs';
import { ActivatedRoute, Navigation, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  @ViewChild("login") loginDiv : ElementRef
  @ViewChild("register") registerDiv : ElementRef
  logInForm : FormGroup
  loginError : boolean = true

  registerForm :FormGroup
  registracionSuccess : boolean = false
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,private render: Renderer2,
    private datePipe: DatePipe) {
      render.addClass(document.body,"sign-in")
      this.render.removeClass(document.body,"blackkk")
    }
  ngOnInit(): void {
    var pattern = "^[A-Za-z0-9!@#$%%&*()+_(]{8,20}";
    this.logInForm = new FormGroup({
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required, Validators.pattern(pattern)])
      
    });
    this.registerForm = new FormGroup({
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required, Validators.pattern(pattern)]),
      firstName: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      lastName: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      date: new FormControl("", [Validators.required])
    });

  }
  submitForm():void{
    var loginObj = {
      "email": this.logInForm.get("email").value,
      "password" : this.logInForm.get("password").value
    }

    this.authService.getToken(loginObj).subscribe(
      (response : IToken) => {
        this.loginError = true
        setLocalStorage("token", response.token)
        var token = parseJwt(response.token);

        var actorData = JSON.parse(token.ActorData);
        console.log(actorData)
        if(actorData.Role == "Admin"){
          this.router.navigate(["/admin"]);
        }
        if(actorData.Role == "User"){
          this.router.navigate(['/index/home']);
          
        }
        
      },
      (error) => {
          this.loginError = false
      }
    );
  }
  submitRegister():void{
    if(this.registerForm.valid){
      var dateFrom = convertToDateTimeFormat(this.registerForm.get("date").value, this.datePipe)  
      var body = {
        firstName: this.registerForm.get("firstName").value,
        lastName: this.registerForm.get("lastName").value,
        password: this.registerForm.get("password").value,
        email: this.registerForm.get("email").value,
        dateOfBirth: dateFrom,
      }
      this.authService.registerUser(body).subscribe({
        next:(data:any)=>{
         this.registracionSuccess = true
        }
        ,
        err:(err:any)=>{
          this.registracionSuccess = false
        }
      })
    }else{
      this.registerForm.markAllAsTouched()
    }
  }
  showLoginForm(loginTab:HTMLLIElement,registerTab:HTMLLIElement):void{

    registerTab.classList.remove("current")
    loginTab.classList.add("current")

    this.registerDiv.nativeElement.classList.add("hide-tab")
    this.registerDiv.nativeElement.classList.remove("show-tab")

    this.loginDiv.nativeElement.classList.add("show-tab")
    this.loginDiv.nativeElement.classList.remove("hide-tab")
  }

  showRegisterForm(loginTab:HTMLLIElement,registerTab:HTMLLIElement):void{

    registerTab.classList.add("current")
    loginTab.classList.remove("current")

    this.registerDiv.nativeElement.classList.remove("hide-tab")
    this.registerDiv.nativeElement.classList.add("show-tab")

    this.loginDiv.nativeElement.classList.remove("show-tab")
    this.loginDiv.nativeElement.classList.add("hide-tab")

  }
}
