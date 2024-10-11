import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RutasComponent } from './componentes/rutas/rutas.component';
import { ParadasComponent } from './componentes/paradas/paradas.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxCaptchaModule } from 'ngx-captcha';
import { AlertasModule } from '../alertas/alertas.module';
import { InputsModule } from '../inputs/inputs.module';
import { TemplatesModule } from '../templates/templates.module';
import { TerminalesComponent } from './componentes/terminales.component';
import { ClasesComponent } from './componentes/clases/clases.component';



@NgModule({
  declarations: [
    TerminalesComponent,
    RutasComponent,
    ParadasComponent,
    ClasesComponent
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
    RouterModule
  ]
})
export class TerminalesModule { }
