import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from '../Models/usuario';
import { FollowsService } from 'src/app/Services/follows.service';
import { PublicationsService } from 'src/app/Services/publications.service';
import { Follow } from '../Models/follows';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  public usuarioProfile: any;
  public followings: any;
  public followeds: any;
  public publications: any;
  public publicationss: any;
  public Oficialpublications: any;
  public followedsIds: any;
  public followsUserIds: any;
  public publicationsIds: any;
  public isOver: any;
  public follow: Follow;
  public identify: any;
  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private followServices: FollowsService,
    private publicationService: PublicationsService
  ) { 
      this.identify = this.usuarioService.getIdentity()
      this.followedsIds = [];
      this.followsUserIds = [];
      this.Oficialpublications = [];
      this.publicationsIds = [];
      this.isOver = 0;
      this.follow = new Follow(this.identify._id, '');
  }

  ngOnInit(): void {
    this.getFollows()
    this.route.params.subscribe(params => {
      console.log(params['id']);
      this.followsUser(params['id'])
      this.usuarioService.getUser(params['id']).subscribe(  
        response => {
          console.log(response);
          this.usuarioProfile = response.user;
          console.log(this.usuarioProfile, this.identify)
          this.getStats(this.usuarioProfile._id)
          this.getPublissh(params['id']);
        }
      )
    })
  }

  followsUser(userid: any){
    this.followServices.getFollowsUser(userid).subscribe(
      response => {
        console.log(response);
        response.seguimientos[0].forEach((element: any) => {
          this.followsUserIds.push(element.followed._id);
          console.log(this.followedsIds);
        });
      }
    )
  }

  getFollows(){
    this.followServices.getFollows().subscribe(
      response => {
        console.log(response)
        console.log(response.seguimientos[0]);
        response.seguimientos[0].forEach((element: any) => {
          this.followedsIds.push(element.followed._id);
          console.log(this.followedsIds);
        });
      }
    )
  }

  getStats(userid: any){
    this.usuarioService.getStats(userid).subscribe(
      response => {
        console.log(response.stats);
        this.followings = response.stats.followings;
        this.followeds = response.stats.followeds;
        this.publications = response.stats.publications;
      }
    )
  }

  getPublissh(userid: any) {
    this.publicationService.getPublishs().subscribe(
      response => {
        console.log(response.publications[0]);
        this.publicationss = response.publications[0];
        this.Oficialpublications = this.publicationss.filter((elemento: any) => {
            return elemento.user._id == userid;
        });
        console.log(this.Oficialpublications);
      }
    )
  }

  addFollow(userId: any){
    console.log(userId)
    this.follow.followed = userId;
    this.followedsIds.push(userId)
    this.followServices.addFollow(this.follow).subscribe(
      response => {
        console.log(response)
      }
    )
  }

  deleteFollow(userid: any){
    this.followServices.deleteFollow(userid).subscribe(
      response => {
        console.log(response);
        this.followedsIds = this.followedsIds.filter((elemento: any) => {
          return elemento != userid;
        }); 
      }
    )
  }

  isOverButton(tf: any){
    this.isOver = tf;
    console.log(this.isOver)
  }

  leavingButton(tf: any){
    this.isOver = 0; 
    console.log(this.isOver)
  }


}
