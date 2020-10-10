import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StudentInfo } from '../studentInfo.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiAdminUrl = 'http://localhost:8080/api/admin/';
  private apiStudentUrl = 'http://localhost:8080/api/student/';

  constructor(private http: HttpClient) { }

  GetStudents(): Observable<StudentInfo[]> {
    return this.http.get<StudentInfo[]>(this.apiAdminUrl + 'students');
  }

  RequestLeave(stdid: number): Observable<boolean> {
    return this.http.put<boolean>(this.apiStudentUrl + 'requestLeave/'+ stdid,true);
  }

  CreateStudent(student: StudentInfo): Observable<StudentInfo> {
    return this.http.post<StudentInfo>(this.apiAdminUrl + 'createStudent',student);
  }
}
