import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalCrearAseguradoraComponent } from './componentes/modal-crear-aseguradora/modal-crear-aseguradora.component';
import { ModalActualizarAseguradoraComponent } from './componentes/modal-actualizar-aseguradora/modal-actualizar-aseguradora.component';
import { AseguradoraComponent } from './aseguradora/aseguradora.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertasModule } from '../alertas/alertas.module';
import { InputsModule } from '../inputs/inputs.module';
import { PipesModule } from '../pipes/pipes.module';



@NgModule({
  declarations: [
    ModalCrearAseguradoraComponent,
    ModalActualizarAseguradoraComponent,
    AseguradoraComponent
  ],
  imports: [
    CommonModule,
    InputsModule,
    NgbModule,   
    AlertasModule,
    PipesModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class AseguradorasModule { }
