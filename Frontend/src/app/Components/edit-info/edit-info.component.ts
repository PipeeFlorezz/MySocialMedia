import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { Usuario } from '../Models/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.component.html',
  styleUrls: ['./edit-info.component.css']
})
export class EditInfoComponent implements OnInit {

  public usuario: Usuario;
  //public editUser: Usuario;
  public success: boolean;
  public noDatos: any;
  public uploadFile: any;
  public formData: FormData;
  public userUpdated: any;

  constructor(private usuarioService: UsuarioService,
    private router: Router) {
    this.usuario = this.usuarioService.getIdentity();
    //this.usuario = new Usuario('', '', '','', '');
    this.success = false;
    this.formData = new FormData();

   }

  ngOnInit(): void {

  }

  updateInfo(formEdit: NgForm){
    console.log(this.usuario)
    this.usuarioService.updateUser(this.usuario, this.usuario._id).subscribe(
      response => {
        console.log(response);


        /*if(response.noDatos){
          this.noDatos = true;
          setTimeout(() => this.noDatos = false, 5000);
          formEdit.reset();
          return;
        }*/

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
            localStorage.removeItem('Identity');
            localStorage.setItem('Identity', JSON.stringify(this.userUpdated));
            this.success = true;
            setTimeout(() => this.router.navigate(['/inicio']), 3000);
          
          }, 2500);

        } else {
          localStorage.removeItem('Identity');
          localStorage.setItem('Identity', JSON.stringify(response.updated));
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
