import { Component, OnInit, ViewChild, DoCheck } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { Publication } from '../Models/publication';
import { PublicationsService } from '../../Services/publications.service';
import { Usuario } from '../Models/usuario';
import { Comment } from '../Models/comments';
import { FollowsService } from 'src/app/Services/follows.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { CommentsService } from 'src/app/Services/comments.service';
import { DatePipe } from '@angular/common';
import { ApiUrls } from 'src/app/apiUrls/apiRoutes';

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

export class InicioComponent implements OnInit {

  public like: boolean;
  public apiUrlPublish: string;
  public text: any;
  public publications: any[];
  public publication: Publication;
  //public uploadFile: Array<File>;
  public uploadFile: any;
  public users: any[];
  public followeds: any[];
  public commentsPublish: any[];
  public oficialPublications: any;
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
    this.like = false;
    this.apiUrlPublish = ApiUrls.publications;
    this.commentCtrl = new FormControl('', []);
    this.oficialPublications = false;
    this.commentsPublish = [];
    this.comments = [];
    this.publications = [];
    this.publication = new Publication('', '', '', '');
    //this.uploadFile = [];
    this.users = [];
    this.followeds = [];
    this.identity = this.usuarioService.getIdentity()
    this.comment = new Comment('', this.identity._id, '', '');

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
    this.getOficialPublish();
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

  deletePublish(publicationId: any) {
    console.log('Has dado click para eliminar una publicacion')
    this.publicationService.deletePublish(publicationId).subscribe(
      response => {
        console.log(response.Deleted._id);
        let publications: any = this.oficialPublications.filter((element: any) => {
          return element._id != response.Deleted._id;
        });
        this.oficialPublications = publications;
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
      }
    )
  }

  getOficialPublish() {
    setTimeout(() => {
      console.log(this.publications)
      this.oficialPublications = this.publications.filter((element: any) => {
        return this.followeds.includes(element.user._id)
      });
      /*this.oficialPublications.forEach((element: any) => {
        element.comments = '';
      });*/
      console.log(this.oficialPublications)
    }, 1000);
  }

  publicationLikes(id: any) {
    if(!this.like){
      this.like = true;
    }else{
      this.like = false;
    }
    console.log(this.like);
    this.giveLike(id, this.like)
    
 } 
  async giveLike(id: any, like: any): Promise<any>{
    //let like: number = 1
    let formData = new FormData();
    formData.append('publishId', id);
    formData.append('like', like);

    await fetch(this.apiUrlPublish+ 'update/like/'+id, {
      method: 'PUT',
      body: formData,
      headers: {
        'authorization': this.usuarioService.getToken()
      }
    })
    .then(response => response.json())
    .then(response => {
      console.log(response.likes)
      this.oficialPublications.forEach((element: any) => {
        if(element._id == id){
          element.likes = response.likes
        }
      })
    })
    .catch(error => console.log(error));

    console.log('Una sentencia despues del async await')
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
      this.oficialPublications.forEach((element: any) => {
        if (element._id == id) {
          element.comments = '';
          element.comments = comentsPerPublish
        }
      });
      console.log(this.oficialPublications)
    }, 1000);


  }



  makePublication(publicationForm: NgForm) {
    console.log('Has dado click en el publicationForm');
    this.publicationService.addPublication(this.publication, this.uploadFile)
      .subscribe(
        response => {
          console.log(response.Savedpublish);
          this.oficialPublications.unshift(response.Savedpublish)
          console.log(this.oficialPublications)
          this.uploadFile = '';
          setTimeout(() => {
            console.log($(".pc .card-footer .postInteractions").first())
            $(".pc .card-footer .postInteractions").first().on('click', function (ev) {
              console.log('Click en el input de la ultima publicacion')
              console.log(this.getAttribute('id'))
              let id: any = this.getAttribute('id');
              this.removeAttribute('id')
              console.log($(`#${id}`));
              $(`#${id}`).slideToggle('fast');
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
