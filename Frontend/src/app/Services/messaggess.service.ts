import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Messaggess } from '../Components/Models/messaggess';
import { ApiUrls } from '../apiUrls/apiRoutes';

@Injectable({
  providedIn: 'root'
})

export class MessaggessService {

  public token: string;
  public apiUrlMessaggess: string;
  public identity: any;

  constructor(
    private http: HttpClient
  ) { 
    this.token = '';
    this.apiUrlMessaggess = ApiUrls.messagess;
  }

  msjTotales(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('authorization', this.getToken());

    return this.http.get<Messaggess[]>(this.apiUrlMessaggess+'mensajesTotales', {headers: headers})                               
  }

  sendedGotten(id?: any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('authorization', this.getToken());
    if(id){
      return this.http.get(this.apiUrlMessaggess+'enviadosRecibidos/'+id, {headers: headers})
    }else{
      return this.http.get(this.apiUrlMessaggess+'enviadosRecibidos', {headers: headers})
    }
  }

  addMessagge(messagge: Messaggess): Observable<any>{
    let datos = JSON.stringify(messagge);
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('authorization', this.getToken());

    return this.http.post(this.apiUrlMessaggess+'addMessage', datos, {headers: headers})
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
