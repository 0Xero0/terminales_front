import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrarPolizasComponent } from './administrar-polizas.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertasModule } from '../alertas/alertas.module';
import { InputsModule } from '../inputs/inputs.module';
import { PipesModule } from '../pipes/pipes.module';
import { FondoResponsabilidadComponent } from './componentes/polizas/fondo-responsabilidad/fondo-responsabilidad.component';
import { AutenticacionModule } from '../autenticacion/autenticacion.module';
import { PolizasComponent } from './componentes/polizas/polizas.component';
import { VehiculosComponent } from './componentes/polizas/vehiculos/vehiculos.component';
import { ModalCapacidadComponent } from './componentes/polizas/modal/modal-capacidad/modal-capacidad.component';

@NgModule({
    declarations: [
        AdministrarPolizasComponent,
        FondoResponsabilidadComponent,
        PolizasComponent,
        VehiculosComponent,
        ModalCapacidadComponent,
    ],
    imports: [
        CommonModule,
        InputsModule,
        NgbModule,
        AlertasModule,
        PipesModule,
        ReactiveFormsModule,
        FormsModule,
        AutenticacionModule,
    ]
})
export class AdministrarPolizasModule{ }