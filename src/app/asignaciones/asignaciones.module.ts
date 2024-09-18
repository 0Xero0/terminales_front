import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsignacionesComponent } from './componentes/asignaciones.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertasModule } from '../alertas/alertas.module';
import { InputsModule } from '../inputs/inputs.module';
import { PipesModule } from '../pipes/pipes.module';



@NgModule({
  declarations: [
    AsignacionesComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    AlertasModule,
    FormsModule,
    ReactiveFormsModule,
    InputsModule,
    NgbModule
  ]
})
export class AsignacionesModule { }
