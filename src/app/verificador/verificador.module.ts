import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '../pipes/pipes.module';
import { AlertasModule } from '../alertas/alertas.module';
import { VerificadorComponent } from './verificador.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { InputsModule } from '../inputs/inputs.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TemplatesModule } from "../templates/templates.module";



@NgModule({
    declarations: [
        VerificadorComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        PipesModule,
        NgbModule,
        AlertasModule,
        SweetAlert2Module,
        InputsModule,
        ReactiveFormsModule,
        FormsModule,
        TemplatesModule
    ]
})
export class VerificadorModule { }
