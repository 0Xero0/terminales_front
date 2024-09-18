import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrarPolizasComponent } from '../administrar-polizas/administrar-polizas.component';

const routes: Routes = [
  {
    path: 'crear-usuarios',
    component: AdministrarPolizasComponent
  },
  {
    path: 'administrar-poliza',
    component: AdministrarPolizasComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministradorRoutingModule { }
