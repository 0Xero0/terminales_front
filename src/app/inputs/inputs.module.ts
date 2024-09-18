import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputBusquedaComponent } from './componentes/input-busqueda/input-busqueda.component';
import { InputArchivoComponent } from './componentes/input-archivo/input-archivo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputMonedaComponent } from './componentes/input-moneda/input-moneda.component';
import { InputNumericoComponent } from './componentes/input-numerico/input-numerico.component';



@NgModule({
  declarations: [
    InputBusquedaComponent,
    InputArchivoComponent,
    InputMonedaComponent,
    InputNumericoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    InputBusquedaComponent,
    InputArchivoComponent,
    InputMonedaComponent,
    InputNumericoComponent
  ]
})
export class InputsModule { }
