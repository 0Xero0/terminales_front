import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministradorRoutingModule } from './administrador-routing.module';
import { PlantillaComponent } from './componentes/plantilla/plantilla.component';
import { MenuComponent } from './componentes/menu/menu.component';
import { BarraNavegacionComponent } from './componentes/barra-navegacion/barra-navegacion.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { PaginaInformacionGeneralVigiladoComponent } from './paginas/pagina-informacion-general-vigilado/pagina-informacion-general-vigilado.component';
import { PaginaSoporteComponent } from './paginas/pagina-soporte/pagina-soporte.component';
import { InputsModule } from '../inputs/inputs.module';
import { AlertasModule } from '../alertas/alertas.module';
import { SoportesModule } from '../soportes/soportes.module';



@NgModule({
  declarations: [
    PlantillaComponent,
    MenuComponent,
    BarraNavegacionComponent,
    PaginaInformacionGeneralVigiladoComponent,
    PaginaSoporteComponent,
  ],
  imports: [
    CommonModule,
    AdministradorRoutingModule,
    SoportesModule,
    ReactiveFormsModule,
    InputsModule,
    AlertasModule,
    FormsModule,
    NgbModule,
    SweetAlert2Module,
  ],
  exports:[]
})
export class AdministradorModule { }
