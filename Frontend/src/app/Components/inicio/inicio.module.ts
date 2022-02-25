import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { InicioComponent } from '../inicio/inicio.component'
import { EnviadosComponent } from '../inicio/enviados/enviados.component'
import { EnviarComponent } from '../inicio/enviar/enviar.component'
import { RecibidosComponent } from '../inicio/recibidos/recibidos.component'
import { MsjTotalesComponent } from '../inicio/msj-totales/msj-totales.component'

import { InicioRoutingModule } from './inicio-routing.module'

@NgModule({
  declarations: [
    InicioComponent,
    EnviadosComponent,
    EnviarComponent,
    RecibidosComponent,
    MsjTotalesComponent 
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    InicioRoutingModule
  ],
  providers: [],
  bootstrap: [InicioComponent]
})

export class InicioModule { }
