import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../Components/Models/usuario';
import { ApiUrls } from '../apiUrls/apiRoutes';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public token: string;
  public apiUrlUsers: string;
  public identity: any;

  constructor(
    private http: HttpClient
  ) {
    this.token = '';
    this.apiUrlUsers = ApiUrls.users;
  }

  getStats(userId: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('authorization', this.getToken());

    return this.http.get(this.apiUrlUsers + 'estadisticas/' + userId, { headers: headers });
  }

  usersNoPaginados(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('authorization', this.getToken());
    return this.http.get(this.apiUrlUsers + 'usuarios', { headers: headers });
  }

  getUsers(page: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('authorization', this.getToken());
    return this.http.get(this.apiUrlUsers + 'usuarios/' + page, { headers: headers });
  }

  getUser(id: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('authorization', this.getToken());

    return this.http.get<Usuario>(this.apiUrlUsers + 'usuario/' + id, { headers: headers });
  }

  loginUser(usuario: Usuario): Observable<any> {
    let datos = JSON.stringify(usuario);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<Usuario>(this.apiUrlUsers + 'login', datos, { headers: headers })
  }

  addUser(usuario: Usuario): Observable<any> {
    let datos = JSON.stringify(usuario);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<Usuario>(this.apiUrlUsers + 'registro', datos, { headers: headers })
  }

  subirFile(archivo: any): Promise<any>{
    let formData = new FormData();
    formData.append('image', archivo);

     return fetch(this.apiUrlUsers+'subirImagen', {
      method: 'PUT',
      body: formData,
      headers: {
        'authorization': this.getToken()
      }
    })          
  }

  getToken(): any {
    let token = localStorage.getItem('Token');
    if (!token) {
      return false;
    } else {
      this.token = token
    }
    return this.token;
  }

  getIdentity(): any {
    let Identity = localStorage.getItem('Identity')
    if (!Identity) {
      return false;
    } else {
      this.identity = Identity;
      return JSON.parse(this.identity);
    }
  }

  LogOut() {
    localStorage.clear();
  }

}
