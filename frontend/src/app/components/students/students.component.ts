import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute,Router } from '@angular/router';
import { NgForm } from "@angular/forms";
import { DataService } from "../../services/data.service";
import { StudentInfo } from "../../studentInfo.model";

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  route:string = "";
  studentsInfo:StudentInfo[];
  nextId: number = 100000;
  newStudent:StudentInfo =new StudentInfo(0,"","","",false,false);

  constructor(private router: Router, private dataService: DataService) { }

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

  createStudent(form:NgForm): void {
    this.dataService.CreateStudent(form.value)
      .subscribe((res) => { 
        this.newStudent = res 
        this.router.routeReuseStrategy.shouldReuseRoute = function() { return false; }
        this.router.navigate(['students']);
      },
      (err) => console.log(err))
  }
}
