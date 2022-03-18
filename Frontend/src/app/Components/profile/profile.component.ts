import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from '../Models/usuario';
import { Comment } from '../Models/comments';
import { FollowsService } from 'src/app/Services/follows.service';
import { PublicationsService } from 'src/app/Services/publications.service';
import { Follow } from '../Models/follows';
import { CommentsService } from 'src/app/Services/comments.service';

//import { InicioComponent } from '../inicio/inicio.component';
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
  public commentCtrl: any;
  public comment: Comment;
  public comments: Comment[]

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private followServices: FollowsService,
    private publicationService: PublicationsService,
    private commentService: CommentsService

  ) { 
    this.comments = [];
    this.commentCtrl = new FormControl('', []);
      this.identify = this.usuarioService.getIdentity()
      this.followedsIds = [];
      this.followsUserIds = [];
      this.Oficialpublications = [];
      this.publicationsIds = [];
      this.isOver = 0;
      this.follow = new Follow(this.identify._id, '');
      this.comment = new Comment('', this.identify._id, '', '');
      this.comments = [];
      this.commentCtrl = new FormControl('', []);
  }

  ngOnInit(): void {
    this.getFollows()
    setTimeout(() => {
      this.cards()
    }, 1000);
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

  editMyInfo(formEdit: NgForm){
    console.log(formEdit);
  }

  cards() {
    console.log(document.querySelectorAll('.pc .card-footer .postInteractions'))
    console.log($('.pc .card-footer .postInteractions'))

    $(".pc .card-footer .postInteractions").on('click', function (ev) {
      console.log(this.getAttribute('id'))
      let id: any = this.getAttribute('id');
      this.removeAttribute('id')
      console.log($(`#${id}`));
      setTimeout(() => {
        $(`#${id}`).slideToggle('slow');
        this.setAttribute('id', id)
      }, 550);
    })
    return;
  }


  cartaPush(id: any) {
    console.log(id);
    let comentsPerPublish = '';
    this.commentService.getCommentsPerPublish(id).subscribe(
      response => {
        console.log(response);
        comentsPerPublish = response.comentsById
        console.log(comentsPerPublish)
      }
    )

    setTimeout(() => {
      this.Oficialpublications.forEach((element: any) => {
        if (element._id == id) {
          element.comments = '';
          element.comments = comentsPerPublish
        }
      });
      console.log(this.Oficialpublications)
    }, 1000);


  }

  deletePublish(publicationId: any){
    console.log('Has dado click para eliminar una publicacion')
    this.publicationService.deletePublish(publicationId).subscribe(
      response => {
        console.log(response.Deleted._id);
        let publications: any = this.Oficialpublications.filter((element: any) => {
            return element._id != response.Deleted._id;
          });
          this.Oficialpublications = publications;
      }
    )
  }

  makeComment(publictionId: any, evt: any) {
    /*console.log(document.getElementById(`${publictionId}`)?.nodeValue)
    /console.log(this.commentCtrl.value);
    console.log(typeof $(`#${publictionId}`).val());
    console.log($(`#${publictionId}`).val());
    this.text = $(`#${publictionId}`).val();*/
    this.comment.publicationId = publictionId;
    this.comment.text = this.commentCtrl.value;
    console.log(this.comment)
    this.commentService.makeComment(this.comment).subscribe(
      response => {
        console.log(response)
        console.log(response.doneComent)
        console.log('Publicacion actualizada: ');
        console.log(response.publishUpdated[0])
        console.log('Comentario guardado: ');
        console.log(response.publishUpdated[1])
        console.log('comentarios de la publicacion');
        console.log(response.publishUpdated[2])
        $(`#${publictionId}`).val('')
        this.cartaPush(publictionId);
      }
    )

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
