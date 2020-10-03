import { Component, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from "../../services/authentication.service";
import { StudentInfo } from '../../studentInfo.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  studentInfo:StudentInfo = new StudentInfo(0,"","","",false,false);
  isAdmin:boolean;
  token:string;
  route:string;

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('TOKEN_NUMBER');
    this.authService.GetStudentDetails(this.token)
      .subscribe((res) => {this.studentInfo = res},
        	(err) => {console.log(err), this.logout()}
      );
    this.route = this.router.url.substr(1);
  }

  noticeboard():void {
    this.router.navigate(['/dashboard']);
  }

  profile():void {
    this.router.navigate(['/profile']);
  }

  students():void {
    this.router.navigate(['/students']);
  }

  logout(): void {
    localStorage.removeItem('TOKEN_NUMBER');
    this.router.navigate(['/login']);
  }
}
