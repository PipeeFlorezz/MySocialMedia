import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../Components/Models/comments';
import { ApiUrls } from '../apiUrls/apiRoutes';
import { Follow } from '../Components/Models/follows';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  public apiUrlscomments: string;
  public token: string;
  constructor(
    private http: HttpClient
  ) { 
    this.apiUrlscomments = ApiUrls.comments;
    this.token = '';
  }

  makeComment(comment: Comment): Observable<any>{
    let datos = JSON.stringify(comment);
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('authorization', this.getToken());
                                   
    return this.http.post(this.apiUrlscomments+ 'addComment', datos, {headers: headers})
  }

  getToken(): any{
    let token = localStorage.getItem('Token');
    if(!token){
      return false;
    }else {
      this.token = token
    }
    return this.token;
  }

}
