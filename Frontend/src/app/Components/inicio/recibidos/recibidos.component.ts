import { Component, OnInit } from '@angular/core';
import { MessaggessService } from '../../../Services/messaggess.service'
import { Messaggess } from '../../Models/messaggess';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-recibidos',
  templateUrl: './recibidos.component.html',
  styleUrls: ['./recibidos.component.css']
})
export class RecibidosComponent implements OnInit {

  
  public messagess: any[];
  
  constructor(
    private messagessServices: MessaggessService,
    private usuarioServices: UsuarioService
  ) { 
    this.messagess = [];
  }

  ngOnInit(): void {    
    this.getmmsjRecibidos()
  }

  getmmsjRecibidos(){
    this.messagessServices.sendedGotten().subscribe(
      response => {
        console.log(response)
        this.messagess = response.msjGotten;
      }
    )
  }

}
