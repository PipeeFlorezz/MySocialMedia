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
  public users: Usuario[];
  public OficialUsers: Usuario[];
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
    this.OficialUsers = [];
    this.followeds = [];
    this.users = [];
    this.identify = this.usuarioService.getIdentity();
    this.follow = new Follow(this.identify._id, '');
  }

  ngOnInit(): void {
    console.log(this.identify)
    this.getFollows();
    console.log(this.followeds);
    console.log('pendiente = ' + this.pendiente);

    this.route.params.subscribe(params => {
      this.page = parseInt(params['page']);
      if (!this.page) {
        this.page = 1;
      } else {
        this.nextPage = this.page + 1;
        this.prevPage = this.page - 1;
        if (this.prevPage <= 0) {
          this.prevPage = 1;
        }

        this.getUsers(this.page);
      }
    })
  }


  getUsers(page: any) {

    this.usuarioService.getUsers(page).subscribe(
      response => {
        console.log(response);
        this.users = response.users;
        this.page = response.page;
        this.pages = response.pages;
      }
    )
  }

  moreUsers(){
    console.log('calling more users');

    let page = parseInt(this.page);
    page = page + 1;
    console.log(typeof page, page);
    let usersA = this.users;
    let usersB;

    this.usuarioService.getUsers(page).subscribe(
      response => {
        console.log(response);
        usersB = response.users;
        this.users = usersA.concat(usersB);
        this.page = response.page;
        this.pages = response.pages;
        console.log(this.page);
        $("html, body").animate({scrollTop: $('body').prop("scrollHeight")}, 100)
      }
    )

  }

  isOverButton(tf: any) {
    this.isOver = tf;
    console.log(this.isOver)
  }

  leavingButton(tf: any) {
    this.isOver = 0;
    console.log(this.isOver)
  }

  deleteFollow(userid: any) {
    this.followServices.deleteFollow(userid).subscribe(
      response => {
        console.log(response);
        this.followeds = this.followeds.filter((elemento: any) => {
          return elemento != userid;
        });
      }
    )
  }

  addFollow(userId: any) {
    console.log(userId)
    this.follow.followed = userId;
    this.followeds.push(userId)
    this.followServices.addFollow(this.follow).subscribe(
      response => {
        console.log(response)
      }
    )
  }

  getFollows() {
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



}

/* 
  https://www.youtube.com/watch?v=AKHCg5aNbGo
*/