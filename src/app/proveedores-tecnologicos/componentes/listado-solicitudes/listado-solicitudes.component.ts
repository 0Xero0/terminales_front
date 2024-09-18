import { Component, OnInit } from '@angular/core';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { Rol } from 'src/app/autenticacion/modelos/Rol';
import { FiltrosReportes } from '../../modelos/FiltrosReportes';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { Observable } from 'rxjs';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { ServicioProveedores } from '../../servicios/proveedores.service';
import { Solicitudes } from '../../modelos/Solicitudes';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
@Component({
  selector: 'app-listado-solicitudes',
  templateUrl: './listado-solicitudes.component.html',
  styleUrls: ['./listado-solicitudes.component.css']
})
export class ListadoSolicitudesComponent implements OnInit {
  rol: Rol | null
  usuario: Usuario | null
  solicitudes: Array<Solicitudes> = []
  paginador: Paginador<{termino?: string}>
  private readonly paginaInicial = 1;
  private readonly limiteInicial = 5;

  termino: string = ""

  constructor(private servicio: ServicioProveedores, private servicioLocalStorage: ServicioLocalStorage,private router: Router,) {
    this.rol = this.servicioLocalStorage.obtenerRol()
    this.usuario = this.servicioLocalStorage.obtenerUsuario()
    this.paginador = new Paginador<any>(this.listarSolicitudes)
  }
  ngOnInit(): void {
    //this.listarSolicitudes()
    console.log(this.usuario)
    this.paginador.inicializar(this.paginaInicial, this.limiteInicial, {})
  }

  listarSolicitudes=(pagina: number, limite: number, filtros?:{termino?: string}) => {
    return new Observable<Paginacion>( sub => {
      this.servicio.listarSolicitudes(pagina, limite, filtros).subscribe({
        next: (respuesta:any) => {
          this.solicitudes = respuesta.solicitudes
          sub.next(respuesta.paginacion)
        }
      })
    })
  }

  visualizarSolicitud(solicitudId:any){
    this.servicio.visualizarSolicitud(solicitudId).subscribe({
      next: (respuesta:any) => {
        //console.log(respuesta)
        localStorage.setItem('solicitud',JSON.stringify(respuesta))
        localStorage.setItem('solicitudId',solicitudId)
        const ruta = '/modulo-proveedor'
        this.router.navigateByUrl(`/administrar${ruta}`)
      }
    })
  }


  actualizarFiltros() {
    this.paginador.filtrar({ termino: this.termino })
  }
  limpiarFiltros(){
    this.termino = ""
    this.paginador.filtrar({ termino: this.termino })
  }
}
