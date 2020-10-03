import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from "./components/profile/profile.component";
import { StudentsComponent } from "./components/students/students.component";
import { GuardService } from './services/guard.service';

const routes: Routes = [
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'register/:stid', component:RegisterComponent},
  {path:'dashboard',canActivate: [GuardService],component:DashboardComponent},
  {path:'profile',canActivate: [GuardService],component:ProfileComponent},
  {path:'students',canActivate: [GuardService],component:StudentsComponent},
  {path:'', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
  providers: [GuardService]
})
export class AppRoutingModule { }
