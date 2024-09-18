import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { PaginaCrearUsuarioComponent } from './paginas/pagina-crear-usuario/pagina-crear-usuario.component';
import { InputsModule } from '../inputs/inputs.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertasModule } from '../alertas/alertas.module';
import { PipesModule } from '../pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalActualizarUsuarioComponent } from './componentes/modal-actualizar-usuario/modal-actualizar-usuario.component';



@NgModule({
  declarations: [
    PaginaCrearUsuarioComponent,
    ModalActualizarUsuarioComponent,
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    InputsModule,
    NgbModule,
    AlertasModule,
    PipesModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class UsuariosModule { }
