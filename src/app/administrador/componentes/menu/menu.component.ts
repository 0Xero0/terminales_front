import { Component, OnInit } from '@angular/core';
import { Rol, Submodulo } from 'src/app/autenticacion/modelos/Rol';
import { ServicioLocalStorage } from '../../servicios/local-storage.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { AutenticacionService } from 'src/app/autenticacion/servicios/autenticacion.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MenuHeaderPService } from '../../utilidades/services-menu-p/menu-header-p-service';

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
    private router: Router,
    public ServiceMenuP:MenuHeaderPService
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

  /*** CODIGO DE PAOLO************************************* */
  public SeleccionarMenuP(rutaModelo:string) :boolean
  {
    //console.log(this.ServiceMenuP.RutaModelo);
    //console.log(`/administrar${rutaModelo}`);
    if(this.ServiceMenuP.RutaModelo===`/administrar${rutaModelo}`)
    {
      return true
    }
    return false
  }

  cerrarSesion(){

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
