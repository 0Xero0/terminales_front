import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaCrearUsuarioComponent } from './paginas/pagina-crear-usuario/pagina-crear-usuario.component';

const routes: Routes = [
  {
    path: 'crear',
    component: PaginaCrearUsuarioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
