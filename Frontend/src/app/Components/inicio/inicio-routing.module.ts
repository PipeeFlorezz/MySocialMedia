import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio.component';
import { EnviadosComponent } from '../inicio/enviados/enviados.component'
import { EnviarComponent } from '../inicio/enviar/enviar.component'
import { MsjTotalesComponent } from '../inicio/msj-totales/msj-totales.component'
import { RecibidosComponent } from '../inicio/recibidos/recibidos.component'

const routes: Routes = [
    {
        path: 'inicio', component: InicioComponent,
        children: [
            { path: '', redirectTo: 'recibidos', pathMatch: 'full' },
            { path: 'enviar', component: EnviarComponent },
            { path: 'recibidos', component: RecibidosComponent },
            { path: 'enviados', component: EnviadosComponent },
            { path: 'msjTotales', component: MsjTotalesComponent }
        ]
    }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class InicioRoutingModule { }
