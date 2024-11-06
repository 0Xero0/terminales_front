import { Component, OnInit } from '@angular/core';
import { Rol, Submodulo } from 'src/app/autenticacion/modelos/Rol';
import { ServicioLocalStorage } from '../../servicios/local-storage.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { AutenticacionService } from 'src/app/autenticacion/servicios/autenticacion.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MenuHeaderPService } from '../../utilidades/services-menu-p/menu-header-p-service';
import { environment } from 'src/environments/environment';

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

  inicioSesion: boolean = false
  inicioVigia2: boolean = false

  nombrePrimerModulo: string = '';
  nombreModuloSeleccionado: string = '';
  primerModulo?: string; // Inicializar primerModulo como opcional

  constructor(
    private servicioLocalStorage: ServicioLocalStorage,
    private servicioAutenticacion: AutenticacionService,
    private router: Router,
    public ServiceMenuP: MenuHeaderPService
  ) {
  }

  ngOnInit(): void {
    const inicioSesion = JSON.parse(localStorage.getItem('inicio-sesion') || 'false');
    if(inicioSesion){this.inicioSesion = inicioSesion}
    const inicioVigia2 = JSON.parse(localStorage.getItem('inicio-vigia2') || 'false');
    if(inicioVigia2){this.inicioVigia2 = inicioVigia2}

    this.rol = this.servicioLocalStorage.obtenerRol()
    this.usuario = this.servicioLocalStorage.obtenerUsuario()
    this.setNombreModuloInicial();
  }

  public abrir(): void {
    this.desplegado = true
  }

  public cerrar(): void {
    this.desplegado = false
  }

  /*** CODIGO DE PAOLO************************************* */
  public SeleccionarMenuP(rutaModelo: string): boolean {
    //console.log(this.ServiceMenuP.RutaModelo);
    //console.log(`/administrar${rutaModelo}`);
    if (this.ServiceMenuP.RutaModelo === `/administrar${rutaModelo}`) {
      return true
    }
    return false
  }

  cerrarSesion() {

    /* this.servicioAutenticacion.cerrarSesion()
    this.router.navigateByUrl('/inicio-sesion') */
    if(this.inicioVigia2){
      window.location.href = environment.urlVigia2+'/administrar/administrar-aplicativos'
    }else if(this.inicioSesion){
      this.router.navigateByUrl('/inicio-sesion')
    }
  }

  imprimirRuta(submodulo: Submodulo) {
    console.log(`/administrar${submodulo.ruta}`)
  }

  navegarAlSubmodulo(submodulo: Submodulo) {
    this.imprimirRuta(submodulo)
    this.router.navigateByUrl(`/administrar${submodulo.ruta}`)
  }

  private setNombreModuloInicial() {
    const currentRoute = this.router.url;

    if (this.rol && this.rol.modulos && this.rol.modulos.length > 0) {
      // Buscar un módulo o submódulo que coincida con la ruta actual
      let moduloActual = this.rol.modulos.find(modulo =>
        currentRoute.includes(`/administrar${modulo.ruta}`)
      );

      if (!moduloActual) {
        // Si no hay coincidencia en la ruta, establece el primer módulo como el seleccionado por defecto
        moduloActual = this.rol.modulos[0];
      }

      this.nombreModuloSeleccionado = moduloActual.nombre;
    }
  }

  // Método para cambiar el módulo seleccionado
  seleccionarModulo(modulo: string) {
    this.nombreModuloSeleccionado = modulo;
  }

  getPrimeraRutaModulo(): string {
    if (this.rol && this.rol.modulos && this.rol.modulos.length > 0) {
      // Obtiene el primer módulo disponible
      const primerModulo = this.rol.modulos[0];

      // Muestra el nombre del primer módulo en la consola

      this.nombrePrimerModulo = primerModulo.nombre; // Asigna el nombre del primer módulo a la variable
      // Redirige al primer módulo disponible con el prefijo "administrar"
      return `/administrar${primerModulo.ruta}`;
    } else {
      // Si no hay módulos disponibles, redirige a una página de error o la ruta que prefieras
      return '/error'; // Ajusta esta ruta según tu app o añade manejo adicional
    }
  }
}
