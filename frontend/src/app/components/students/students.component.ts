import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from "@angular/forms";
import { AuthenticationService } from "../../services/authentication.service";
import { DataService } from "../../services/data.service";
import { StudentInfo } from "../../studentInfo.model";
import { NgbModalConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
  providers: [NgbModalConfig, NgbModal, NgbActiveModal]
})
export class StudentsComponent implements OnInit {

  route:string = "";
  studentsInfo:StudentInfo[];
  nextId: number = 100000;
  newStudent:StudentInfo =new StudentInfo(0,"","","",false,false);
  sysMessage:any = {message:"", error:false};
  selStudent: StudentInfo;

  constructor(private router: Router, 
              private dataService: DataService, 
              private authService : AuthenticationService, 
              config: NgbModalConfig, 
              public modal: NgbActiveModal,
              private modalService: NgbModal) {
                config.backdrop = 'static';
                config.keyboard = false;
               }

  ngOnInit(): void {
    this.route = this.router.url.substr(1);
    this.dataService.GetStudents()
      .subscribe((res) => {
        this.studentsInfo = res;
        this.nextId = Math.max.apply(Math,this.studentsInfo.map((o) => {return o["student_id"]})) + 1;
        this.newStudent.studentId = this.nextId;
      },
      (err) => console.log(err))
  }

  openModal (content, student:StudentInfo) {
    this.modalService.open(content)
    this.selStudent = student;
  }

  createStudent(form:NgForm): void {
    this.dataService.CreateStudent(form.value)
      .subscribe((res) => { 
        this.newStudent = res 
        this.reloadPage();
      },
      (err) => console.log(err))
  }

  blockUser(stdId){
    console.log(stdId);
    this.dataService.BlockingUser(stdId,true)
      .subscribe((res) => {console.log(res), this.reloadPage()},
          (err) => console.log(err));
  }
  unblockUser(stdId){
    this.dataService.BlockingUser(stdId,false)
      .subscribe((res) => {console.log(res), this.reloadPage()},
        (err) => console.log(err));
  }

  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = function() { return false; }
    this.router.navigate(['students']);
  }

  sendRegisterEmail(student: StudentInfo) {   
    this.dataService.SendRegisterEmail(student)
    .subscribe((res) => { 
      console.log(res);
      this.sysMessage = {message:"The email has been sent to "+ res["accepted"] +" succesfully", error: false};
    },
      (err) => this.sysMessage = {message:"The send of the email has failed", error: true}
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

  changePassword(event){
    const newPassword = event.target.newPassword.value;
    const studentId = event.target.studentId.value;
    this.authService.ChangePassword(studentId,newPassword)
      .subscribe((res) => { console.log(res);
        this.sysMessage = {message:"The password has been changed succesfully", error: false};
      },
        (err) => this.sysMessage = {message:"The password change has failed", error: true}
      );
      this.modalService.dismissAll();
      this.hideMessage();
  }

  acceptLeave(stdId){
    this.dataService.AcceptStudentLeave(stdId)
      .subscribe((res)=> this.sysMessage = {message:"The Student has been removed", error: false},
      (err) => this.sysMessage = {message:"Error removing the Student", error: true}
    );
    this.hideMessage(true);
  }

  rejectLeave(stdId) {
    this.dataService.RejectStudentLeave(stdId)
    .subscribe((res)=> this.sysMessage = {message:"The Student Leave has been rejected", error: false},
    (err) => this.sysMessage = {message:"Error rejecting the Student leave", error: true}
    );
    this.hideMessage(true);
  }

  hideMessage(reload:boolean = false) {
    window.scroll(0,0);
    setTimeout(function() {
      this.sysMessage.message = "";
      this.sysMessage.error = false;
      if (reload) { this.reloadPage() }
    }.bind(this), 5000);
  }
}
