import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    this.route = this.router.url.substr(1);
    this.dataService.GetStudents()
      .subscribe( (res) => {this.studentsInfo = res},
                  (err) => console.log(err))
  }

}
