import { Injectable } from '@angular/core';
import { Publication } from '../Components/Models/publication';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiUrls } from '../apiUrls/apiRoutes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  public token: string;
  public apiUrlPublish: string;

  constructor(
    private http: HttpClient
  ) {
    this.token = '';
    this.apiUrlPublish = ApiUrls.publications;
  }

  getPublishs(id?: any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('authorization', this.getToken());
    if(id){
      return this.http.get<Publication[]>(this.apiUrlPublish + id, {headers: headers});
    }else{
      return this.http.get<Publication[]>(this.apiUrlPublish, {headers: headers});
    }                         
  }

  addPublication(publication: Publication, archivo?: any): Observable<any> {
    let headers = new HttpHeaders().set('authorization', this.getToken());
    let formData = new FormData();
    formData.append('text', publication.text);
    formData.append('image', archivo);

    return this.http.post(this.apiUrlPublish + 'addPublish', formData, {headers: headers});
  }

  deletePublish(id: any): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('authorization', this.getToken());

    return this.http.delete(this.apiUrlPublish+ 'delete/'+id, {headers: headers});                            
  }
  

  getToken(): any {
    let token = localStorage.getItem('Token');
    if (!token) {
      return 'No existe token';
    } else {
      this.token = token
    }
    return this.token;
  }
}
