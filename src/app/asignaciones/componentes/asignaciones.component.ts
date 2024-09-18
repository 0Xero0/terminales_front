import { Component, OnInit, ViewChild } from '@angular/core';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { FiltrosReportesEnviados } from '../modelos/FiltrosReportesEnviados';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { Observable } from 'rxjs';
import { ServicioReportes } from '../servicios/reportes.service';
import { ResumenReporte } from '../modelos/ResumenReporte';
import { FiltrosReportesAsignados } from '../modelos/FiltrosReportesAsignados';
import { ResumenReporteAsignado } from '../modelos/ResumenReporteAsignado';
import { Verificador } from '../modelos/Verificador';
import { HttpErrorResponse } from '@angular/common/http';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { Asignacion } from '../modelos/Asignacion';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { ErrorAutorizacion } from 'src/app/errores/ErrorAutorizacion';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';

@Component({
  selector: 'app-asignaciones',
  templateUrl: './asignaciones.component.html',
  styleUrls: ['./asignaciones.component.css']
})
export class AsignacionesComponent implements OnInit {
  @ViewChild('popup') popup!: PopupComponent
  private readonly paginaInicial = 1;
  private readonly limiteInicial = 5;
  reportes: ResumenReporte[] = []
  reportesSeleccionados: ResumenReporte[] = []
  reportesAsignados: ResumenReporteAsignado[] = []
  verificadores: Verificador[] = []
  verificadorSeleccionado?: string
  termino: string = ""
  paginadorReportes: Paginador<FiltrosReportesEnviados>
  //paginadorReportesAsignados: Paginador<FiltrosReportesAsignados>

  usuario: Usuario

  constructor(private servicioReportes: ServicioReportes, private servicioLocalStorage: ServicioLocalStorage){
    const usuario = this.servicioLocalStorage.obtenerUsuario()
    if(!usuario){
      throw new ErrorAutorizacion()
    }
    this.usuario = usuario
    // this.paginadorReportesAsignados = new Paginador<FiltrosReportesAsignados>(this.obtenerReportesAsignados)
    this.paginadorReportes = new Paginador<FiltrosReportesEnviados>(this.obtenerSolicitudes)
  }

  ngOnInit(): void {
    this.obtenerVerificadores()
    this.paginadorReportes.inicializar(this.paginaInicial, this.limiteInicial, {})
  }

  obtenerVerificadores(){
    this.servicioReportes.obtenerVerificadores().subscribe({
      next: ( verificadores ) =>{
        this.verificadores = verificadores
      }
    })
  }

  obtenerSolicitudes = (pagina: number, limite: number, filtros?:FiltrosReportesEnviados)=>{
    return new Observable<Paginacion>( sub => {
      this.servicioReportes.obtenerSolicitudes(pagina, limite, filtros).subscribe({
        next: ( respuesta )=>{
          this.reportes = respuesta.solicitudes
          sub.next(respuesta.paginacion)
        }
      })
    })
  }

  obtenerSolicitudesAsignadas(id:string){
    this.servicioReportes.obtenerSolicitudesAsignados(id).subscribe({
      next: ( respuesta )=>{
        this.reportesAsignados = respuesta
      }
    })
  }

  seleccionarReporte(solicitud: ResumenReporte){
    this.reportesSeleccionados.push(solicitud)
  }

  reporteSeleccionado(solicitudID: number): boolean{
    const solicitudIdSeleccionados = this.reportesSeleccionados.map( solicitud => solicitud.solicitudId )
    return solicitudIdSeleccionados.includes(solicitudID) ? true : false;
  }

  removerReporte(solicitudId: number){
    this.reportesSeleccionados = this.reportesSeleccionados.filter(
      (reporteSeleccionado) => solicitudId !== reporteSeleccionado.solicitudId
    );
  }

  seleccionarVerificador(event: Event){
    const selectElement = event.target as HTMLSelectElement
    const id = selectElement.value
    this.verificadorSeleccionado = id
    if(this.verificadorSeleccionado){
      this.obtenerSolicitudesAsignadas(id)
    }
  }

  asignar(){
    if(!this.verificadorSeleccionado){
      this.popup.abrirPopupFallido('Error al asignar las solicitudes.', 'Debe seleccionar un verificador.')
      return;
    }
    if(this.reportesSeleccionados.length === 0){
      this.popup.abrirPopupFallido('Error al asignar las solicitudes.', 'Debe seleccionar una solicitud a asignar.')
      return;
    }
    const asignaciones: Asignacion = {
      verificador: this.verificadorSeleccionado,
      solicitudes:this.reportesSeleccionados.map( reporte => reporte.solicitudId)
    }

    console.log(asignaciones)
    this.servicioReportes.asignarSolicitudes(asignaciones).subscribe({
      next: ()=>{
        this.paginadorReportes.refrescar()
        this.limpiarSeleccionados()
        this.obtenerSolicitudesAsignadas(this.verificadorSeleccionado!)
        //this.paginadorReportesAsignados.filtrar({identificacionVerificador: this.verificadorSeleccionado})
        this.popup.abrirPopupExitoso('Reportes asignados correctamente.')
      },
      error: (error: HttpErrorResponse)=>{
        this.popup.abrirPopupFallido('Error al asignar los reportes', error.error.mensaje)
      }
    })
  }

  eliminarAsignacion(solicitudId: number){
    this.servicioReportes.eliminarAsignacion(solicitudId).subscribe({
      next:  ()=>{
        this.popup.abrirPopupExitoso('Asignación removida.')
        this.obtenerSolicitudesAsignadas(this.verificadorSeleccionado!)
        this.paginadorReportes.refrescar()
      },
      error: (error: HttpErrorResponse)=>{
        this.popup.abrirPopupFallido('Error al remover la asignación.', error.error.mensaje)
      }
    })
  }

  setTermino(termino: string){
    this.termino = termino
  }

  actualizarFiltros(){
    this.paginadorReportes.filtrar({ termino: this.termino })
  }

  limpiarFiltros(){
    this.termino = ""
    this.paginadorReportes.filtrar({ termino: this.termino })
  }

  limpiarSeleccionados(){
    this.reportesSeleccionados = []
  }
}
