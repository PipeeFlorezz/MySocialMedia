import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Publication } from '../Models/publication';
import { PublicationsService } from '../../Services/publications.service';
import { Usuario } from '../Models/usuario';
import { FollowsService } from 'src/app/Services/follows.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

export class InicioComponent implements OnInit {

  public publications: any[];
  public publication: Publication;
  public uploadFile: Array<File>;
  public users: any[];
  public followeds: any[];
  public publicationsIds: any[];
  public oficialPublications: any;
  public identify: any;
  public date: any;

  constructor(
    private publicationService: PublicationsService,
    private usuarioService: UsuarioService,
    private followService: FollowsService,
    private datePipe: DatePipe
  ) {
    this.oficialPublications = false;
    this.publicationsIds = [];
    this.publications = [];
    this.publication = new Publication('', '', '');
    this.uploadFile = [];
    this.users = [];
    this.followeds = [];
    this.identify = this.usuarioService.getIdentity()
  }

  ngOnInit(): void {
    this.getPublissh();
    this.getFollows();
    console.log(this.followeds);
    console.log(this.publicationsIds);
    console.log(this.publications)
    this.getOficialPublish();
    console.log(this.identify)
  }

  getFollows() {
    this.followService.getFollows().subscribe(
      response => {
        console.log(response)
        console.log(response.seguimientos[0]);
        response.seguimientos[0].forEach((element: any) => {
          this.followeds.push(element.followed._id);
        });
       this.followeds.push(this.identify._id);
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

  getOficialPublish(){
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
