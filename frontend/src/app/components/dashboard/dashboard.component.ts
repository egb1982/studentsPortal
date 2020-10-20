import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { DataService } from 'src/app/services/data.service';
import { Post } from '../../post.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  route:string = "";
  isAdmin= true;
  url:any;
  document:File; 
  posts:Post[];

  constructor( private router: Router, private dataservice: DataService) { }

  ngOnInit(): void {
    this.route = this.router.url.substr(1);
    this.dataservice.GetAllPosts()
      .subscribe((res)=> {
        this.posts = res;
      });
  }

  processFile(document: any){
    if (document.files && document.files[0]) {
      this.document = document.files[0];
    }
  }

 createPost(form:NgForm) {
  
  const formData = new FormData();
  if (this.document) {
    formData.append('document',this.document,this.document.name);
  }
  formData.append('type',form.value.type);
  formData.append('title',form.value.title);
  formData.append('text',form.value.text);

  this.dataservice.PublishNewPost(formData)
   .subscribe((res) =>{
    console.log(res);
    this.router.routeReuseStrategy.shouldReuseRoute = function() { return false; }
    this.router.navigate(['dashboard']);
  });
 }

downloadFile (filePath: string) {
  this.dataservice.DownloadFile(filePath)
  .subscribe((file) => {
    saveAs(file,filePath);
  });
}

  getTitle(type:string): string {
    let title = "";
    switch (type) {
      case 'notif':
        title = 'Notifcation';
        break;
      case 'examTT':
        title = 'Exam Time Table';
        break;
      case 'examGP':
        title = 'Exam Gate Pass';
        break;
      case 'change':
        title = 'Change in Faculty';
        break;
      case 'circ':
        title = 'Circular on the Portal';
        break;
      Default: 
        title = "Note";
        break;
    }
    return title;
  }

  getTitleCssClass(type:string): string {
    let cssClass = "";
    switch (type) {
      case 'notif':
        cssClass = 'bg-info';
        break;
      case 'examTT':
        cssClass = 'bg-warning';
        break;
      case 'examGP':
        cssClass = 'bg-danger';
        break;
      case 'change':
        cssClass = 'bg-success';
        break;
      case 'circ':
        cssClass = 'bg-secondary';
        break;
      default:
        cssClass = 'bg-light';
        break;  
    }
    return cssClass;
  }

}
