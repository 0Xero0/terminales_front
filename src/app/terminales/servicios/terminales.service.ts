import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { environment } from 'src/environments/environment';
import { Ruta } from '../modelos/ruta';

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

  maestraTiposVehiculos(idClasePorGrupo:any){
    const endpoint = `/api/v1/maestras/tipo-vehiculo?idClasePorGrupo=${idClasePorGrupo}`
    return this.http.get(`${this.host}${endpoint}`,{ headers: this.obtenerCabeceraAutorizacion() })
  }

  maestraGrupos(){
    const endpoint = `/api/v1/maestras/clase-grupo`
    return this.http.get(`${this.host}${endpoint}`,{ headers: this.obtenerCabeceraAutorizacion() })
  }

  cantidadRutas(idUsuario:any){
    const endpoint = `/api/v1/terminales/total-rutas`
    return this.http.get(`${this.host}${endpoint}`,{ headers: this.obtenerCabeceraAutorizacion() })
  }

  /////////////////////////////////////////////////////

  listarRutas(pagina: number, limite: number, filtros?: any){
    let endpoint = `/api/v1/terminales/visualizar-rutas?pagina=${pagina}&limite=${limite}`
    if(filtros){
      if(filtros.termino) endpoint+=`&filtro=${filtros.termino}`;
    }
    return this.http.get<{ rutas: Ruta[], paginacion: Paginacion }>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  listarParadas(ruta_id:number, pagina: number, limite: number, filtros?: any){
    let endpoint = `/api/v1/terminales/visualizar-paradas?rutaId=${ruta_id}&pagina=${pagina}&limite=${limite}`
    if(filtros){
      if(filtros.termino) endpoint+=`&filtro=${filtros.termino}`;
    }
    return this.http.get<{ paradas: any[], paginacion: Paginacion }>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  listarClases(ruta_id:number, pagina: number, limite: number, filtros?: any){
    let endpoint = `/api/v1/terminales/visualizar-clases?rutaId=${ruta_id}&pagina=${pagina}&limite=${limite}`
    if(filtros){
      if(filtros.termino) endpoint+=`&filtro=${filtros.termino}`;
    }
    return this.http.get<{ clases: any[], paginacion: Paginacion }>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }
}
