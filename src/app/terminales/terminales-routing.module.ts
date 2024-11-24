import { RouterModule, Routes } from "@angular/router";
import { RevisarRutasComponent } from "./componentes/revisar-rutas/revisar-rutas.component";
import { NgModule } from "@angular/core";
import { CrearRutaComponent } from "./componentes/crear-ruta/crear-ruta.component";

const routes: Routes = [
  {
    path: 'revisar-rutas',
    component: RevisarRutasComponent
  },
  {
    path: 'crear-ruta',
    component: CrearRutaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TerminalesRoutingModule { }
