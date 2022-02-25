import { Component, OnInit } from '@angular/core';
import { Messaggess } from '../../Models/messaggess';
import { FollowsService } from '../../../Services/follows.service';
import { NgForm } from '@angular/forms';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { MessaggessService } from '../../../Services/messaggess.service'
@Component({
  selector: 'app-enviar',
  templateUrl: './enviar.component.html',
  styleUrls: ['./enviar.component.css']
})

export class EnviarComponent implements OnInit {

  public followeds: any[];
  public messagge: Messaggess;
  public messagges: Messaggess[];
  public identify: any;
  constructor(
    private messaggessService: MessaggessService,
    private followService: FollowsService,
    private usuarioServices: UsuarioService
  ) { 
    this.followeds = [];
    this.messagges = [];
    this.identify = this.usuarioServices.getIdentity();
    this.messagge = new Messaggess(this.identify._id, '', '');
  }

  ngOnInit(): void {
    this.getFollows()
    console.log(this.followeds);
  }

  getFollows(){
    this.followService.getFollows().subscribe(
      response => {
        console.log(response)
        console.log(response.seguimientos[0]);
        response.seguimientos[0];
        response.seguimientos[0].forEach((element: any) => {
          this.followeds.push(element.followed);
        });
        console.log(this.followeds); 
      }
    )
  }

  enviarMessage(formMensajeria: NgForm){
    console.log(this.messagge)
    this.messaggessService.addMessagge(this.messagge)
      .subscribe(
        response => {
          console.log(response.mesage)
          formMensajeria.reset()
        } 
      )
  }

}

