import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StudentInfo } from '../studentInfo.model';


export interface Login {
  username: string,
  password: string
}


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiUrl = 'http://localhost:8080/api/auth/';
  
  constructor(private http: HttpClient) { }

  LoginUser(credentials: Login): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl + 'login',credentials);
  }

  RegisterUser(credentials): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl + 'register',credentials);
  }

  GetRegisterStudent(id: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'register/' + id);
  }

  GetStudentDetails(token): Observable<StudentInfo> {
    localStorage.setItem('TOKEN_NUMBER', token);
    return this.http.get<StudentInfo>(this.apiUrl + 'studentDetails',{headers:{'x-access-token': token}} );
  }
}