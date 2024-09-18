import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertasModule } from '../alertas/alertas.module';
import { InputsModule } from '../inputs/inputs.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '../pipes/pipes.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { AplicativosComponent } from './aplicativos.component';



@NgModule({
  declarations: [
    AplicativosComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    AlertasModule,
    InputsModule,
    NgbModule,
    PipesModule,
    NgxPaginationModule,
  ]
})
export class AplicativossModule { }
