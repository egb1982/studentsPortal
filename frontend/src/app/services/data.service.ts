import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StudentInfo } from '../studentInfo.model';
import { Post } from '../post.model';

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
    return this.http.get<any>('http://localhost:8080/download/' + fileName);
  }

}
