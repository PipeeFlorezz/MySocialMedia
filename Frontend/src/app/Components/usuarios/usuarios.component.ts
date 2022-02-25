import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../Services/usuario.service';
import { Usuario } from '../Models/usuario';
import { FollowsService } from '../../Services/follows.service';
import { Follow } from '../Models/follows';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  public identify: any;
  public followeds: any[];
  public page: any;
  public pages: any;
  public back: any;
  public forward: any;
  public usuarios: Usuario[];
  public usersNP: Usuario[];
  public OficialUsuarios: Usuario[];
  public nextPage: any;
  public prevPage: any;
  public isOver: any;
  public follow: Follow;
  public pendiente: any;
  public indexUser: any;

  constructor(
    private usuarioService: UsuarioService,
    private followServices: FollowsService,
    private route: ActivatedRoute
  ) {
      this.isOver = 0;
      this.OficialUsuarios = [];
      this.followeds = [];
      this.usuarios = [];
      this.usersNP = [];
      this.identify = this.usuarioService.getIdentity();
      this.follow = new Follow(this.identify._id, '');
   }

  ngOnInit(): void {
    this.getUsersNoPaginados();
    console.log(this.identify)
    this.getFollows();
    console.log(this.followeds);

    this.route.params.subscribe(params => {
      this.page = parseInt(params['page']);
      if(!this.page){
        this.page = 1;
      }else{
        this.nextPage = this.page + 1;
        this.prevPage = this.page - 1;
        if(this.prevPage <= 0){
          this.prevPage = 1;
        }
  
        this.getUsers(this.page);
      }
    })
  }


  getUsers(page: any){
    
    this.usuarioService.getUsers(page).subscribe(
      response => {
        console.log(response);
        this.usuarios = response.users;
        this.page = response.page;
        this.pages = response.pages;
        this.indexUser = (this.page - 1) * (response.itemPerPage);
        console.log(this.usersNP[(this.indexUser - 1)]);

        if(this.page == '1'){
          this.usuarios = this.usuarios.filter((elemento: any) => {
            return elemento._id != this.identify._id;
          });
          if(this.usuarios.length < 5){
            this.usuarios.unshift(this.identify);
            this.pendiente = false;
            return;
          }
          if(this.usuarios.length == 5){
            this.usuarios.unshift(this.identify);
            this.pendiente = this.usuarios.pop();
            return;
          }
        }

        if(this.back){
          this.pendiente = this.usuarios.pop();
          this.usuarios.unshift(this.usersNP[(this.indexUser - 1)]);
          return;
        }

        if(this.page >= 2 && this.pendiente == false){
          return;
        }

        if(this.page >= 2 && this.pendiente){

          // Averiguo si estoy en esta pagina
          this.usuarios = this.usuarios.filter((elemento: any) => {
            return elemento._id != this.identify._id;
          });
          // Si estoy
          if(this.usuarios.length < 5 && this.pendiente){
            this.usuarios.unshift(this.pendiente);
            this.pendiente = false;
            return;
          }

          // Si no estoy
          if(this.usuarios.length == 5){
            this.usuarios.unshift(this.pendiente);
            this.pendiente = this.usuarios.pop();
            return;
          }
        }

      }
    )
  }

  moveBack(param: any){
    this.back = param;
    this.forward = false;
    console.log('this.back: ' + this.back, 'this.forward: ' + this.forward)
  }

  moveForward(param: any){
    this.forward = param;
    this.back = false;
    console.log('this.back: ' + this.back, 'this.forward: ' + this.forward)

  }

  isOverButton(tf: any){
    this.isOver = tf;
    console.log(this.isOver)
  }

  leavingButton(tf: any){
    this.isOver = 0; 
    console.log(this.isOver)
  }

  deleteFollow(userid: any){
    this.followServices.deleteFollow(userid).subscribe(
      response => {
        console.log(response);
        this.followeds = this.followeds.filter((elemento: any) => {
          return elemento != userid;
        }); 
      }
    )
  }

  addFollow(userId: any){
    console.log(userId)
    this.follow.followed = userId;
    this.followeds.push(userId)
    this.followServices.addFollow(this.follow).subscribe(
      response => {
        console.log(response)
      }
    )
  }

  getFollows(){
    this.followServices.getFollows().subscribe(
      response => {
        console.log(response)
        console.log(response.seguimientos[0]);
        response.seguimientos[0].forEach((element: any) => {
          this.followeds.push(element.followed._id);
        });
      }
    )
  }

  getUsersNoPaginados(){
    this.usuarioService.usersNoPaginados().subscribe(
      response => {
        console.log(response.usersNoPaginados)
        this.usersNP = response.usersNoPaginados;
      }
    )
  }



}
