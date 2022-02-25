import { Component, OnInit } from '@angular/core';
import { Messaggess } from '../../Models/messaggess';
import { FollowsService } from '../../../Services/follows.service';
import { NgForm } from '@angular/forms';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { MessaggessService } from '../../../Services/messaggess.service'

@Component({
  selector: 'app-msj-totales',
  templateUrl: './msj-totales.component.html',
  styleUrls: ['./msj-totales.component.css']
})
export class MsjTotalesComponent implements OnInit {

  public messaggess: any;

  constructor(
    private messaggessServices: MessaggessService
  ) { 
    
  }

  ngOnInit(): void {
    this.getTotalMsj()
  }

  getTotalMsj(){
    this.messaggessServices.msjTotales().subscribe(
      response => {
        console.log(response.messagess);
        this.messaggess = response.messagess;
      }
    )
  }
}
