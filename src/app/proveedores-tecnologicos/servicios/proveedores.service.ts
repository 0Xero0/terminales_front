import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { environment } from 'src/environments/environment';
import { PeticionGuardarAspiranteTecnologico } from '../modelos/PeticionGuardarAspiranteTecnologico.ts';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AspiranteTecnologico } from '../modelos/AspirateTecnologico.js';

@Injectable({
  providedIn: 'root'
})
export class ServicioProveedores extends Autenticable {
  private readonly host = environment.urlBackend

  constructor(private http: HttpClient) {
    super()
  }

  enviarFormularioAspiranteTecnologico(formulario: PeticionGuardarAspiranteTecnologico): Observable<AspiranteTecnologico>{
    //console.log(formulario)
    const endpoint = '/api/v1/formularios/aspirante_tecnologico'
    return this.http.post<AspiranteTecnologico>(`${this.host}${endpoint}`, formulario)
  }

  maestraAplicativos(){
    const endpoint = `/api/v1/maestras/aplicativos`
    return this.http.get(`${this.host}${endpoint}`)
  }

  guardarDocumentacion(JSONrespuestas:any){
    const endpoint = '/api/v1/formularios/guardar'
    return this.http.post<any>(`${this.host}${endpoint}`, JSONrespuestas, { headers: this.obtenerCabeceraAutorizacion() })
  }

  enviarST(){
    const endpoint = '/api/v1/formularios/enviar'
    return this.http.post<any>(`${this.host}${endpoint}`,{}, { headers: this.obtenerCabeceraAutorizacion() })
  }

  guardarRespuestasVerificador(solicitudId:number, respuestas:any){
    const endpoint = '/api/v1/verificador/guardar'
    return this.http.post<any>(`${this.host}${endpoint}`,{solicitudId,respuestas}, { headers: this.obtenerCabeceraAutorizacion() })
  }

  enviarSTVerificador(solicitudId:number){
    const endpoint = `/api/v1/verificador/enviar?solicitudId=${solicitudId}`
    return this.http.post<any>(`${this.host}${endpoint}`,{}, { headers: this.obtenerCabeceraAutorizacion() })
  }

  mostrarFormulario(){
    const endpoint = `/api/v1/formularios/visualizar`
    return this.http.get(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  estadoProveedores(){
    const endpoint = `/api/v1/formularios/estado`
    return this.http.get(`${this.host}${endpoint}`,{ headers: this.obtenerCabeceraAutorizacion() })
  }

  listarSolicitudes(pagina:number,limite:number,filtros?:{termino?: string}){
    let endpoint = `/api/v1/verificador/listar-solicitudes?pagina=${pagina}&limite=${limite}`
    if(filtros){
      if(filtros.termino) endpoint+=`&filtro=${filtros.termino}`;
    }
    return this.http.get(`${this.host}${endpoint}`,{ headers: this.obtenerCabeceraAutorizacion() })
  }

  visualizarSolicitud(solicitudId:any){
    const endpoint = `/api/v1/verificador/visualizar?solicitudId=${solicitudId}`
    return this.http.get(`${this.host}${endpoint}`,{ headers: this.obtenerCabeceraAutorizacion() })
  }

}
