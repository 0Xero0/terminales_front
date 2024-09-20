import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlantillaComponent } from './administrador/componentes/plantilla/plantilla.component';
import { InicioSesionComponent } from './autenticacion/componentes/inicio-sesion/inicio-sesion.component';
import { ActualizarContrasenaComponent } from './autenticacion/componentes/actualizar-contrasena/actualizar-contrasena.component';
import { AutenticacionGuard } from './guards/autenticacion.guard';
import { PaginaInformacionGeneralVigiladoComponent } from './administrador/paginas/pagina-informacion-general-vigilado/pagina-informacion-general-vigilado.component';
import { PaginaSoporteComponent } from './administrador/paginas/pagina-soporte/pagina-soporte.component';
import { PaginaSoportesComponent } from './soportes/paginas/pagina-soportes/pagina-soportes.component';
import { PaginaResponderSoporteComponent } from './soportes/paginas/pagina-responder-soporte/pagina-responder-soporte.component';
import { SoporteAccesoComponent } from './autenticacion/componentes/soporte-acceso/soporte-acceso.component';
import { AdministrarPolizasComponent } from './administrar-polizas/administrar-polizas.component';
import { PaginaCrearUsuarioComponent } from './usuarios/paginas/pagina-crear-usuario/pagina-crear-usuario.component';
import { VerificadorComponent } from './verificador/verificador.component';
import { AplicativosComponent } from './aplicativos/aplicativos.component';
import { ReporteComponent } from './reporte/reporte.component';
import { FormularioAspiranteComponent } from './proveedores-tecnologicos/componentes/formulario-aspirante/formulario-aspirante.component';
import { DocumentacionComponent } from './proveedores-tecnologicos/componentes/documentacion/documentacion.component';
import { ListadoSolicitudesComponent } from './proveedores-tecnologicos/componentes/listado-solicitudes/listado-solicitudes.component';
import { AsignacionesComponent } from './asignaciones/componentes/asignaciones.component';
import { InicioVigia2Component } from './autenticacion/componentes/inicio-vigia2/inicio-vigia2.component';
import { TerminalesComponent } from './terminales/componentes/terminales.component';



const routes: Routes = [
  {
    path: 'administrar',
    component: PlantillaComponent,
    canActivate: [AutenticacionGuard],
    children: [
      {
        path: 'informacion-general',
        component: PaginaInformacionGeneralVigiladoComponent
      },
      {
        path: 'crear-usuarios',
        component: PaginaCrearUsuarioComponent
      },
      {
        path: 'administrar-poliza',
        component: AdministrarPolizasComponent
      },
      {
        path: 'soporte',
        component: PaginaSoporteComponent
      },
      {
        path: 'reportes',
        component: ReporteComponent
      },
      {
        path: 'responder-soporte/:idSoporte/:estado',
        component: PaginaResponderSoporteComponent
      },
      {
        path: 'soportes/:estado',
        component: PaginaSoportesComponent
      },
      {
        path: 'administrar-aplicativos',
        component: AplicativosComponent
      },
      {
        path: 'modulo-proveedor',
        component: DocumentacionComponent
      },
      {
        path: 'listado-solicitudes',
        component: ListadoSolicitudesComponent
      },
      {
        path: 'asignaciones',
        component: AsignacionesComponent
      },
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'inicio-vigia2'
  },
  {
    path: 'inicio-vigia2',
    component: InicioVigia2Component
  },
  /* {
    path: 'inicio-sesion',
    component: InicioSesionComponent
  }, */
  {
    path: 'terminales',
    component: TerminalesComponent
  },
  {
    path: 'actualizar-contrasena',
    component: ActualizarContrasenaComponent
  },
  {
    path: 'soporte',
    component: SoporteAccesoComponent
  },
  {
    path: 'verificador',
    component: VerificadorComponent
  },
  {
    path: 'formulario-aspirante',
    component: FormularioAspiranteComponent
  },
  {
    path: '**',
    /* pathMatch: 'full', */
    redirectTo: 'inicio-vigia2'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
