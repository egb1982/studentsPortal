import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from "@angular/forms";
import { AuthenticationService } from '../../services/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username:string = "";
  password:string = "";

  constructor(private route:ActivatedRoute, private authService: AuthenticationService, private router: Router ) { }

  ngOnInit(): void {
  }

  login(form: NgForm):void {
    this.authService.LoginUser(form.value)
      .subscribe((res) => { this.router.navigate(['/dashboard']) });
  }
}
