import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginaSoportesComponent } from './paginas/pagina-soportes/pagina-soportes.component';
import { AlertasModule } from '../alertas/alertas.module';
import { InputsModule } from '../inputs/inputs.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginaResponderSoporteComponent } from './paginas/pagina-responder-soporte/pagina-responder-soporte.component';
import { PipesModule } from '../pipes/pipes.module';



@NgModule({
  declarations: [
    PaginaSoportesComponent,
    PaginaResponderSoporteComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    AlertasModule,
    InputsModule,
    NgbModule,
    PipesModule
  ]
})
export class SoportesModule { }
