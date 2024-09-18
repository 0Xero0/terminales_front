import { Component, OnInit } from '@angular/core';
import { Rol, Submodulo } from 'src/app/autenticacion/modelos/Rol';
import { ServicioLocalStorage } from '../../servicios/local-storage.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { AutenticacionService } from 'src/app/autenticacion/servicios/autenticacion.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  rol?: Rol | null;
  usuario?: Usuario | null;
  isCollapsed = false;
  desplegado = true

  constructor(
    private servicioLocalStorage: ServicioLocalStorage,
    private servicioAutenticacion: AutenticacionService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.rol = this.servicioLocalStorage.obtenerRol()
    this.usuario = this.servicioLocalStorage.obtenerUsuario()
  }

  public abrir():void{
    this.desplegado = true
  }

  public cerrar():void{
    this.desplegado = false
  }

  /* public advertencia(){

    Swal.fire({
      title: 'Cierre de sesión',
      icon: 'warning',
      html: 'Al salir, también se cerrarán los aplicativos que tenga abiertos.<br>Asegúrese de haber guardado la información diligenciada.',
      showConfirmButton: true,
      confirmButtonText: 'Salir',
      showCancelButton: true,
      cancelButtonText: 'Volver',
      didOpen: () => {
        const content = document.querySelector('.swal2-html-container');
        if (content) {
          content.setAttribute('style', 'margin: 400px; text-align: center;');
        }
        const popup = document.querySelector('.swal2-popup');
        if (popup) {
          // popup.setAttribute('style', 'margin: 4px 0 !important;'); 
        }
      }
    }).then((respuesta) => {
      if(respuesta.isConfirmed){
        this.cerrarSesion()
      }
    })
  } */

  cerrarSesion(){
    /* var openTabs = JSON.parse(localStorage.getItem("openTabs")!) || [];
    for(let tabName of openTabs){
      var tab = window.open("", tabName);
      if (tab && !tab.closed) {
        tab.close();
      }

      // Limpiar el array en localStorage después de cerrar las pestañas
      localStorage.removeItem("openTabs");

      window.focus()
    } */

    this.servicioAutenticacion.cerrarSesion()
    this.router.navigateByUrl('/inicio-sesion')
  }

  imprimirRuta(submodulo: Submodulo){
    console.log(`/administrar${submodulo.ruta}`)
  }

  navegarAlSubmodulo(submodulo: Submodulo){
    this.imprimirRuta(submodulo)
    this.router.navigateByUrl(`/administrar${submodulo.ruta}`)
  }
}
