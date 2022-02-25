import { Component, OnInit, DoCheck } from '@angular/core';
import { UsuarioService } from 'src/app/Services/usuario.service';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, DoCheck {

  public identify: any;

  constructor(
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.identify = this.usuarioService.getIdentity()
    console.log(this.identify);
  }

  ngDoCheck(): void {
      
  }

}
