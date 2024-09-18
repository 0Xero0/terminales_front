import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { Verificador } from '../modelos/Verificador';
import { ResumenReporte } from '../modelos/ResumenReporte';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { Asignacion } from '../modelos/Asignacion';
import { FiltrosReportesAsignados } from '../modelos/FiltrosReportesAsignados';
import { ResumenReporteAsignado } from '../modelos/ResumenReporteAsignado';
import { FiltrosReportesEnviados } from '../modelos/FiltrosReportesEnviados';

@Injectable({
  providedIn: 'root'
})
export class ServicioReportes extends Autenticable {

  private readonly host = environment.urlBackend

  constructor(private http: HttpClient) {
    super()
  }

  obtenerVerificadores(){
    const endpoint = `/api/v1/verificador/listar-verificadores`
    return this.http.get<Verificador[]>(
      `${this.host}${endpoint}`,
      { headers: this.obtenerCabeceraAutorizacion() }
    )
  }

  obtenerSolicitudes(pagina: number, limite: number, filtros?: FiltrosReportesEnviados){
    let endpoint = `/api/v1/verificador/listar-solicitudes?pagina=${pagina}&limite=${limite}`
    if(filtros){
      if(filtros.termino) endpoint+=`&filtro=${filtros.termino}`;
    }
    return this.http.get<{ solicitudes: ResumenReporte[], paginacion: Paginacion }>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  obtenerSolicitudesAsignados(id:string){
    let endpoint = `/api/v1/verificador/listar-asignadas?verificador=${id}`
    return this.http.get<ResumenReporteAsignado[]>(
      `${this.host}${endpoint}`,
      { headers: this.obtenerCabeceraAutorizacion() }
    )
  }

  eliminarAsignacion(solicitudId: number){
    const endpoint = `/api/v1/verificador/eliminar-asignacion?idSolicitud=${solicitudId}`
    return this.http.delete(
      `${this.host}${endpoint}`,
      { headers: this.obtenerCabeceraAutorizacion() }
    )
  }

  asignarSolicitudes(Peticiones: Asignacion){
    const endpoint = '/api/v1/verificador/asignacion'
    return this.http.post(
      `${this.host}${endpoint}`,
      Peticiones,
      { headers: this.obtenerCabeceraAutorizacion() }
    )
  }
}
