import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './Components/register/register.component';
import { UsuariosComponent } from './Components/usuarios/usuarios.component';
import { SeguidosComponent } from './Components/seguidos/seguidos.component';
import { SeguidoresComponent } from './Components/seguidores/seguidores.component';
import { LoginComponent } from './Components/login/login.component';
import { AboutComponent } from './Components/about/about.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { InicioComponent } from './Components/inicio/inicio.component';

const routes: Routes = [
  {path: '', component: AboutComponent},
  {path:'about', component: AboutComponent},
  {path:'usuarios/:page', component: UsuariosComponent},
  {path: 'seguidores', component: SeguidoresComponent},
  {path: 'seguidos', component: SeguidosComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path:'profile/:id', component: ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
