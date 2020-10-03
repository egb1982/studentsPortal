import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  route:string = "";
  isAdmin= true;

  constructor( private router: Router) { }

  ngOnInit(): void {
    this.route = this.router.url.substr(1);;
  }
}
