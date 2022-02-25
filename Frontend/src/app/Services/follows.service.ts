import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario} from '../Components/Models/usuario';
import { ApiUrls } from '../apiUrls/apiRoutes';
import { Follow } from '../Components/Models/follows';

@Injectable({
  providedIn: 'root'
})

export class FollowsService {

  public apiUrlsFollows: string;
  public token: string;
  constructor(
    private http: HttpClient
  ) { 
    this.apiUrlsFollows = ApiUrls.follows;
    this.token = '';
  }

  getFollows(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('authorization', this.getToken());

      return this.http.get(this.apiUrlsFollows, {headers: headers});
    
  }

  getFollowsUser(userid: any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('authorization', this.getToken());

      return this.http.get(this.apiUrlsFollows+'followsUser/'+userid, {headers: headers});
    
  }

  addFollow(follow: Follow ): Observable<any>{
    let datos = JSON.stringify(follow);
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('authorization', this.getToken());

    return this.http.post(this.apiUrlsFollows+'addFollow', datos, {headers: headers})
  }

  deleteFollow(userId: any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('authorization', this.getToken());

    return this.http.delete(this.apiUrlsFollows+'delete/'+userId, {headers: headers});
  }

  getToken(): any{
    let token = localStorage.getItem('Token');
    if(!token){
      return 'No existe token';
    }else {
      this.token = token
    }
    return this.token;
  }
}
