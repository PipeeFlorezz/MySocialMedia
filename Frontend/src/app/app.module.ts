import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { InicioModule } from './Components/inicio/inicio.module'
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
//import { MomentModule } from 'angular-moment';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './Components/register/register.component';
import { UsuariosComponent } from './Components/usuarios/usuarios.component';
import { SeguidosComponent } from './Components/seguidos/seguidos.component';
import { SeguidoresComponent } from './Components/seguidores/seguidores.component';
import { LoginComponent } from './Components/login/login.component';
import { AboutComponent } from './Components/about/about.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { EditInfoComponent } from './Components/edit-info/edit-info.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    UsuariosComponent,
    SeguidosComponent,
    SeguidoresComponent,
    LoginComponent,
    AboutComponent,
    ProfileComponent,
    EditInfoComponent
  ],
  imports: [
    //MomentModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    InicioModule,
    ReactiveFormsModule
    ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})

export class AppModule { }
