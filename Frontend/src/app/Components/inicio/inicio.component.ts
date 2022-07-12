import { Component, OnInit, ViewChild, DoCheck } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { Publication } from '../Models/publication';
import { PublicationsService } from '../../Services/publications.service';
import { Usuario } from '../Models/usuario';
import { Comment } from '../Models/comments';
import { Likes } from '../Models/likes';
import { FollowsService } from 'src/app/Services/follows.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { CommentsService } from 'src/app/Services/comments.service';
import { DatePipe } from '@angular/common';
import { ApiUrls } from 'src/app/apiUrls/apiRoutes';
//import { stringify } from 'querystring';

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

export class InicioComponent implements OnInit {

  public like: Likes;
  public apiUrlPublish: string;
  public text: any;
  public publications: any[];
  public publication: Publication;
  //public uploadFile: Array<File>;
  public uploadFile: any;
  public users: any[];
  public followeds: any[];
  public commentsPublish: any[];
  public newoficialPublications: any;
  public identity: any;
  public date: any;
  public comment: Comment;
  public comments: Comment[]
  @ViewChild('indice') indice: any;
  @ViewChild('formComment') formComment: any;
  public commentCtrl: any;

  constructor(
    private publicationService: PublicationsService,
    private usuarioService: UsuarioService,
    private followService: FollowsService,
    private datePipe: DatePipe,
    private commentService: CommentsService
  ) {
    this.apiUrlPublish = ApiUrls.publications;
    this.commentCtrl = new FormControl('', []);
    this.commentsPublish = [];
    this.comments = [];
    this.publications = [];
    this.publication = new Publication('', '', '', '', '');
    //this.uploadFile = [];
    this.users = [];
    this.followeds = [];
    this.identity = this.usuarioService.getIdentity()
    this.comment = new Comment('', this.identity._id, '', '');
    this.like = new Likes(this.identity._id, '');


  }

  ngOnInit(): void {
    $("#despliegueForm").on('click', function () {
      console.log('haciendo click en el formulario de publicacion')
      $('#formularioToggle').slideToggle('slow');

    })


    this.getPublissh();
    this.getFollows();
    console.log(this.followeds);
    console.log(this.commentsPublish);
    console.log(this.publications)
    console.log(this.identity)
    setTimeout(() => {
      this.cards()
    }, 1000);

  }


   makeComment(publictionId: any, evt: any) {
    /*console.log(document.getElementById(`${publictionId}`)?.nodeValue)
    /console.log(this.commentCtrl.value);
    console.log(typeof $(`#${publictionId}`).val());
    console.log($(`#${publictionId}`).val());
    this.text = $(`#${publictionId}`).val(); */

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
        $(`#${publictionId}`).val(' ')
        this.cartaPush(publictionId);
      }
    )

  }

  cartaPush(id: any) {
    let comentsPerPublish = '';

    this.commentService.getCommentsPerPublish(id).subscribe(
      response => {
        //console.log(response.comentsById);
        comentsPerPublish = response.comentsById
        console.log(comentsPerPublish)
      }
    )

    setTimeout(() => {
      this.publications.forEach((element: any) => {
        if (element._id == id) {
          element.comments = '';
          element.comments = comentsPerPublish
        }
      });
      console.log(this.publications)
    }, 1000);


  }

  deletePublish(publicationId: any) {
    console.log('Has dado click para eliminar una publicacion')
    this.publicationService.deletePublish(publicationId).subscribe(
      response => {
        console.log(response.Deleted._id);
        let publications: any = this.publications.filter((element: any) => {
          return element._id != response.Deleted._id;
        });
        this.publications = publications;
      }
    )
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

  getFollows() {
    this.followService.getFollows().subscribe(
      response => {
        console.log(response)
        console.log(response.seguimientos[0]);
        response.seguimientos[0].forEach((element: any) => {
          this.followeds.push(element.followed._id);
        });
        this.followeds.push(this.identity._id);
      }
    )
  }

  getPublissh() {
    this.publicationService.getPublishs().subscribe(
      response => {
        console.log(response.publications[0]);
        console.log(response.publications[1]);
        this.publications = response.publications[0];
        console.log(this.publications)
        console.log(this.publications[2])
      }
    )
  }


  publicationLikes(id: any) {
    this.giveLike(id)
 } 
  async giveLike(id: any): Promise<any>{
    //let like: number = 1
    this.like.publication = id;
    let formData = new FormData();
    formData.append('user', this.like.user);
    formData.append('publication', this.like.publication);
    await fetch(this.apiUrlPublish+ 'update/like/'+id, {
      method: 'PUT',
      body: formData, 
      headers: {
        'authorization': this.usuarioService.getToken()
      }  
    })
    .then(response => response.json())
    .then(response => {
      console.log(response.lks)
      if(response.likes){
        this.publications.forEach((element: any) => {
          if(element._id == id){
            element.numberLikes = response.likes.NumberLikes;
          }
        });
      }else {
        this.publications.forEach((element: any) => {
          if(element._id == id){ 
            element.numberLikes = response.lks;
          }
        }); 
      }
    })
    .catch(error => console.log(error));

    console.log('Una sentencia despues del async await')
  }






  makePublication(publicationForm: NgForm) {
    console.log('Has dado click en el publicationForm');
    this.publicationService.addPublication(this.publication, this.uploadFile)
      .subscribe(
        response => {
          console.log(response.noText);
          console.log(response.Savedpublish);
          console.log(response.populatedPublish);
          this.publications.unshift(response.Savedpublish)
          console.log(this.publications)
          this.uploadFile = '';
          setTimeout(() => {
            console.log($(".pc .card-footer .postInteractions"))
            $(".pc .card-footer .postInteractions").on('click', function (ev) {
              console.log('Click en el input de la ultima publicacion')
              console.log(this.getAttribute('id'))
              let id: any = this.getAttribute('id');
              this.removeAttribute('id')
              console.log($(`#${id}`));
              $(`#${id}`).slideToggle('slow');
              this.setAttribute('id', id)
            })
          }, 1000);
          publicationForm.reset();
        }
      )
  }

  imgPublication(event: any) { 
    console.log(event)
    // this.uploadFile = <Array<File>>event.target.files[0];
    this.uploadFile = event.target.files[0];
    console.log(this.uploadFile);
  }
}
