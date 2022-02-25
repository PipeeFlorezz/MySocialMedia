import { Component, OnInit } from '@angular/core';
import { MessaggessService } from '../../../Services/messaggess.service'
import { Messaggess } from '../../Models/messaggess';
import { UsuarioService } from 'src/app/Services/usuario.service';
@Component({
  selector: 'app-enviados',
  templateUrl: './enviados.component.html',
  styleUrls: ['./enviados.component.css']
})
export class EnviadosComponent implements OnInit {

  public messagess: any[];
  public identify: any;

  constructor(
    private messagessServices: MessaggessService,
    private usuarioServices: UsuarioService
  ) { 
    this.messagess = [];
    this.identify = this.usuarioServices.getIdentity()
  }

  ngOnInit(): void {
    console.log(this.identify);
    this.messaggessEnviados(this.identify._id)
  }

  messaggessEnviados(id: any){
    this.messagessServices.sendedGotten(id).subscribe(
      response => {
        console.log(response.msjSended);
        this.messagess = response.msjSended;
        console.log(this.messagess)
      } 
    )
  }

}
