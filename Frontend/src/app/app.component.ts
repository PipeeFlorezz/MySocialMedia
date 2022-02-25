import { Component, OnInit, DoCheck } from '@angular/core';
import { UsuarioService } from './Services/usuario.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, DoCheck {

  public identity: any;
  public page: number;
  public date: any;
  public objectArray: any;
  constructor(
    private usuaroServices: UsuarioService,
    private router: Router
  ) {
    this.page = 1;
    this.objectArray = [
      { id: 1, name: 'Mauricio Rios', edad: 40, pais: 'Colombia' },
      { id: 3, name: 'Richard rick', edad: 35, pais: 'Canadá' },
      { id: 4, name: 'Timoteo Blanco', edad: 48, pais: 'Irak' },
      { id: 2, name: 'Cris marrigan', edad: 50, pais: 'Usa' }
    ]
    //this.date = moment().startOf('hour').fromNow();;
  }

  ngOnInit(): void {
    console.log('Component principal appComponent');
    this.identity = this.usuaroServices.getIdentity();
    console.log(
      this.objectArray.sort((a: any, b: any) => {
        return 0.5 - Math.random();
      })
    )
  }

  ngDoCheck(): void {
    this.identity = this.usuaroServices.getIdentity();
  }

  logOut() {
    this.usuaroServices.LogOut();
    this.router.navigate(['/about']);
  }
}
