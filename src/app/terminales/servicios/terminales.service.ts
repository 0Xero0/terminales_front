import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TerminalesService extends Autenticable {

  private readonly host = environment.urlBackend
  constructor(private http: HttpClient) {
    super()
   }
/* ///////// Maestras ///////// */
  maestraDepartamentos(){
    const endpoint = `/api/v1/maestras/departamentos`
    return this.http.get(`${this.host}${endpoint}`,{ headers: this.obtenerCabeceraAutorizacion() })
  }

  maestraMunicipios(codigoDepartamento:any){
    const endpoint = `/api/v1/maestras/municipios?codigoDepartamento=${codigoDepartamento}`
    return this.http.get(`${this.host}${endpoint}`,{ headers: this.obtenerCabeceraAutorizacion() })
  }

  maestraCentrosPoblados(codigoMunicipio:any){
    const endpoint = `/api/v1/maestras/centros-poblados?codigoMunicipio=${codigoMunicipio}`
    return this.http.get(`${this.host}${endpoint}`,{ headers: this.obtenerCabeceraAutorizacion() })
  }

  maestraTiposLlegadas(){
    const endpoint = `/api/v1/maestras/tipo-llegada`
    return this.http.get(`${this.host}${endpoint}`,{ headers: this.obtenerCabeceraAutorizacion() })
  }

  maestraDirecciones(idTipoLlegada:any){
    const endpoint = `/api/v1/maestras/direcciones?codigoTipollegada=${idTipoLlegada}`
    return this.http.get(`${this.host}${endpoint}`,{ headers: this.obtenerCabeceraAutorizacion() })
  }

  /////////////////////////////////////////////////////
}
