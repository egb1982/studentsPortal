import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from "@angular/forms";
import { DataService } from "../../services/data.service";
import { AuthenticationService } from "../../services/authentication.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  route:string = "";
  sysMessage:any = {message:"", error:false};

  constructor(private router: Router, private dataService: DataService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.route = this.router.url.substr(1);
  }

  updateStudentData(form: NgForm){
    this.dataService.UpdateStudentData(form.value)
    .subscribe((res) => { console.log(res);
      this.sysMessage = {message:"The profile information has been succesfully updated", error: false};
    },
      (err) => this.sysMessage = {message:"Profile update failed", error: true}
    );
    this.hideMessage();
  }

  changePassword(event) {
    const newPassword = event.target.newPassword.value;
    const studentId = event.target.studentId.value;
    this.authService.ChangePassword(studentId,newPassword)
    .subscribe((res) => { console.log(res);
      this.sysMessage = {message:"The password has been changed succesfully", error: false};
    },
      (err) => this.sysMessage = {message:"The password change has failed", error: true}
    );
    this.hideMessage();
  }

  resetPassword(stdId: number) {
    this.authService.ResetPassword(stdId)
      .subscribe((res) => { console.log(res);
        this.sysMessage = {message:"The password has been reset succesfully and an e-Mail sent to " + res["accepted"]  , error: false};
      },
        (err) => this.sysMessage = {message:"The password reseting has failed", error: true}
      );
      this.hideMessage();
  }

  requestLeave(stdId:number){
    this.dataService.RequestLeave(stdId)
    .subscribe((res) => { console.log(res);
      this.sysMessage = {message:"Leave has been requested", error: false};
    },
      (err) => this.sysMessage = {message:"The leave request has failed", error: true}
    );
    this.hideMessage();
  }

  hideMessage() {
    window.scroll(0,0);
    setTimeout(function() {
      this.sysMessage.message = "";
      this.sysMessage.error = false;
    }.bind(this), 5000);
  }
}
