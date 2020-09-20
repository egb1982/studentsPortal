import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from "@angular/forms";
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private route:ActivatedRoute, private authService: AuthenticationService, private router: Router ) { }

  studentId: number = 0;
  studentInfo: any;
  errorMsg: string = "";

  ngOnInit(): void {
    this.studentId = this.route.snapshot.params['stid'];
    if (this.studentId !== 0 && this.studentId !== undefined) {
      this.authService.GetRegisterStudent(this.studentId)
        .subscribe(
          (data) => { 
            if(data.isError){
              this.errorMsg = data.message;
              this.studentInfo = "";
            } else {
              this.studentInfo = data ;
            }
      });
    }
  }

  submitStudentId(form: NgForm) : void {
    if ((this.studentId !== undefined) && (this.studentId > 0)) {
      this.router.routeReuseStrategy.shouldReuseRoute = function() { return false; }
      this.router.navigate(['register/'+ this.studentId]);
    }
  }

  registerUser(form: NgForm) : void {
    this.authService.RegisterUser(form.value)
      .subscribe((res) => { this.router.navigate(['/login']) });
  }
}
