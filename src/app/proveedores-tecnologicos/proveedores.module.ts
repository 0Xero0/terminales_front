import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { NgxCaptchaModule } from 'ngx-captcha';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AlertasModule } from '../alertas/alertas.module';
import { InputsModule } from '../inputs/inputs.module';
import { RouterModule } from '@angular/router';
import { TemplatesModule } from '../templates/templates.module';
import { FormularioAspiranteComponent } from './componentes/formulario-aspirante/formulario-aspirante.component';
import { DocumentacionComponent } from './componentes/documentacion/documentacion.component';
import { ListadoSolicitudesComponent } from './componentes/listado-solicitudes/listado-solicitudes.component';
import { PipesModule } from "../pipes/pipes.module";


@NgModule({
  declarations: [
    FormularioAspiranteComponent,
    DocumentacionComponent,
    ListadoSolicitudesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxCaptchaModule,
    NgbModule,
    InputsModule,
    TemplatesModule,
    SweetAlert2Module.forRoot(),
    AlertasModule,
    RouterModule,
    PipesModule
]
})
export class ProveedoresModule { }
