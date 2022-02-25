import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from '../Models/usuario';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public usuario: Usuario;
  public success: boolean;
  public noUser: boolean;
  public noDatos: boolean;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.usuario = new Usuario('', '','', '', '');
    this.success = false;
    this.noUser = false;
    this.noDatos = false;
  }

  ngOnInit(): void {
  }

  envioLogin(formularioLogin: NgForm){
    this.usuarioService.loginUser(this.usuario).subscribe(
      response => {
        console.log(response);
        if(response.noDatos){
          this.noDatos = true;
          setTimeout(() => this.noDatos = false, 5000);
          formularioLogin.reset();
          return;
        }
        if(response.noUser){
          alert(response.noUser);  
          formularioLogin.reset();
          this.noUser = true;
          return;
        }
        if(response[0] && response[1]){
          this.success = true;
          localStorage.setItem('Identity', JSON.stringify(response[0]));
          localStorage.setItem('Token', JSON.stringify(response[1]));
          setTimeout(() => {
            this.router.navigate(['/inicio']);
          }, 3000);
        }
      }
    )
  }

}
