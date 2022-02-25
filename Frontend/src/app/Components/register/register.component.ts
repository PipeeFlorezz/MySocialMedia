import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from '../Models/usuario';
import { UsuarioService } from '../../Services/usuario.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public usuario: Usuario;
 // public uploadFile: Array<File>
  public uploadFile: any;
  public identificado: any;
  public success: boolean;
  public userFound: boolean;
  public formData: FormData;
  public userUpdated: any;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.formData = new FormData();
    this.usuario = new Usuario('', '', '', '', '');
    //this.uploadFile = [];
    this.success = false;
    this.userFound = false;
  }

  ngOnInit(): void {
    console.log('Componente register metodo ngOnInit')
  }

  async envioSignup(formularioRegister: NgForm) {
    console.log(this.usuario);
    this.usuarioService.addUser(this.usuario).subscribe(
      response => {
        console.log(response);
        if (response.userFound) {
          this.userFound = true;
          setTimeout(() => this.userFound = false, 5000);
          formularioRegister.reset();
          return;
        }
        localStorage.setItem('Token', JSON.stringify(response[1]));

        if (this.uploadFile) {
          console.log('entro al uploadFile')
          //this.usuarioService.subirFile(this.uploadFile)

          this.subirFile()
          .then(response => response.json())
          .then(response => {
            console.log('Success:', response.userUpdated);
            this.userUpdated = response.userUpdated;
          })
          .catch(error => console.error('Error:', error))
          console.log('ejecutando comando despues del metodo fetch')

          setTimeout(() => {
            console.log(response.userUpdated)
            localStorage.setItem('Identity', JSON.stringify(this.userUpdated));
            this.success = true;
            setTimeout(() => this.router.navigate(['/inicio']), 3000);
          
          }, 2500);

        } else {
          localStorage.setItem('Identity', JSON.stringify(response[0]));
          this.success = true;
          setTimeout(() => this.router.navigate(['/inicio']), 3000);
          return;
        }
      }
    )
  }

  async subirFile(): Promise<any>{

      return await fetch(this.usuarioService.apiUrlUsers+'subirImagen', {
      method: 'PUT',
      body: this.formData,
      headers: {
        'authorization': this.usuarioService.getToken()
      }
    })         
  }

  imgRegister(event: any) {
    console.log(event);
    this.uploadFile = <Array<File>>event.target.files[0];
    this.formData.append('image', this.uploadFile);
    console.log(this.uploadFile);
  }


}
