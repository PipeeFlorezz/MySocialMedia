import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { Publication } from '../Models/publication';
import { PublicationsService } from '../../Services/publications.service';
import { Usuario } from '../Models/usuario';
import { Comment } from '../Models/comments';
import { FollowsService } from 'src/app/Services/follows.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { CommentsService } from 'src/app/Services/comments.service';
import { DatePipe } from '@angular/common';

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

export class InicioComponent implements OnInit {

  public text: any;
  public publications: any[];
  public publication: Publication;
  public uploadFile: Array<File>;
  public users: any[];
  public followeds: any[];
  public publicationsIds: any[];
  public oficialPublications: any;
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
    this.commentCtrl = new FormControl('', []);
    this.oficialPublications = false;
    this.publicationsIds = [];
    this.comments = [];
    this.publications = [];
    this.publication = new Publication('', '', '');
    this.uploadFile = [];
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
    console.log(this.publicationsIds);
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
        console.log(response.addedComent);
        $(`#${publictionId}`).val('')
      }
    )

  }

  cards(){
    console.log(document.querySelectorAll('.pc .card-footer .postInteractions'))
    console.log($('.pc .card-footer .postInteractions'))

    $(".pc .card-footer .postInteractions").on('click', function (ev) {
      console.log(this.getAttribute('id'))
      let id: any = this.getAttribute('id');
      this.removeAttribute('id')
      console.log($(`#${id}`));
      $(`#${id}`).slideToggle('fast');
      this.setAttribute('id', id)
    })
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
        this.publications = response.publications[0];
        console.log(this.publications)
        response.publications[0].forEach((element: any) => {
          console.log(element.user._id);
          this.publicationsIds.push(element.user._id);
        });
      }
    )
  }

  getOficialPublish() {
    setTimeout(() => {
      console.log(this.publications)
      this.oficialPublications = this.publications.filter((element: any) => {
        return this.followeds.includes(element.user._id)
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
          publicationForm.reset();
        }
      )
  }

  imgPublication(event: any) {
    console.log(event)
    this.uploadFile = <Array<File>>event.target.files[0];
    console.log(this.uploadFile);
  }
}
