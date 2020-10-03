import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from "@angular/forms";
import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  route:string = "";

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    this.route = this.router.url.substr(1);
  }

  updateStudentData(form){}

  changePassword(form){}

  requestLeave(stdId:number){
    this.dataService.RequestLeave(stdId)
      .subscribe((res) => console.log(res));
  }
}
