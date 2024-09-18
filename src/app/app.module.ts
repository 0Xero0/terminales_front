import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdministradorModule } from './administrador/administrador.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorAutorizacion } from './administrador/interceptores/InterceptorAutorizacion';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AlertasModule } from './alertas/alertas.module';
import { AdministrarPolizasModule } from './administrar-polizas/administrar-polizas.module';
import { AseguradorasModule } from './aseguradoras/aseguradoras.module';
import { VerificadorModule } from './verificador/verificador.module';
import { ReportesModule } from './reporte/reporte.module';
import { AplicativossModule } from './aplicativos/aplicativos.module';
import { ProveedoresModule } from './proveedores-tecnologicos/proveedores.module';
import { AsignacionesModule } from './asignaciones/asignaciones.module';
import { TerminalesModule } from './terminales/terminales.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AdministradorModule,
    AutenticacionModule,
    SweetAlert2Module.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    UsuariosModule,
    VerificadorModule,
    AdministrarPolizasModule,
    AlertasModule,
    AseguradorasModule,
    AplicativossModule,
    ReportesModule,
    ProveedoresModule,
    AsignacionesModule,
    TerminalesModule
  ],
  exports:[
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorAutorizacion,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
