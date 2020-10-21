import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { StudentInfo } from '../studentInfo.model';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';

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

  PublishNewPost(post:any): Observable<Post> {
    return this.http.post<Post>(this.apiAdminUrl + 'publish',post);
  }

  GetAllPosts():Observable<Post[]> {
    return this.http.get<Post[]>(this.apiStudentUrl + 'getPosts');
  }

  DownloadFile(fileName:string): Observable<any> {
    return this.http.get('http://localhost:8080/download/' + fileName , { responseType: 'blob' });
  }

  CreateStudent(student: StudentInfo): Observable<StudentInfo> {
    return this.http.post<StudentInfo>(this.apiAdminUrl + 'createStudent',student);
  }

  BlockingUser(stdId:number, block:boolean): Observable<any> {
    const url = this.apiAdminUrl + ((block) ? 'blockUser/' : 'unblockUser/' ) + stdId; 
    return this.http.put<any>(url,block);
  }

  SendRegisterEmail(student:StudentInfo): Observable<StudentInfo> {
    return this.http.post<StudentInfo>(this.apiAdminUrl +'registerEmail',student);
  }

  AcceptStudentLeave(stdId:number): Observable<any> {
    return this.http.delete<any>(this.apiAdminUrl + 'acceptLeave/'+ stdId);
  }

  RejectStudentLeave(stdId:number): Observable<any> {
    return this.http.put<any>(this.apiAdminUrl + 'rejectLeave/'+ stdId,false);
  }

  UpdateStudentData(student:NgForm): Observable<StudentInfo> {
    return this.http.put<StudentInfo>(this.apiStudentUrl + 'updateStudent',student);
  }
}
