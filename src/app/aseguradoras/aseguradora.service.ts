import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AutenticacionService } from '../autenticacion/servicios/autenticacion.service';
import { environment } from 'src/environments/environment';
import { AseguradoraModel } from './Modelos/aseguradora';
import { FiltrosAseguradora } from './Modelos/filtros';
import { Paginacion } from '../compartido/modelos/Paginacion';
import { Autenticable } from '../administrador/servicios/compartido/Autenticable';

@Injectable({
  providedIn: 'root'
})
export class AseguradoraService extends Autenticable{


  private readonly host = environment.urlBackend
  private readonly rute = '/api/v1/aseguradoras'

  constructor(
    private http: HttpClient
  ) {
      super()
  }

  crearAseguradora(aseguradora: AseguradoraModel){
    return this.http.post(`${this.host}${this.rute}`, aseguradora, { headers: { "Content-Type": "application/json",   "Authorization" : `Bearer ${this.obtenerTokenAutorizacion()}` } } )
  }

  obtenerAseguradoras(pagina: number, limite: number, filtros?: FiltrosAseguradora){    
    let endpoint = `${this.rute}?pagina=${pagina}&limite=${limite}`
    if(filtros){
        if(filtros.termino){
            endpoint+=`&termino=${filtros.termino}`
        }
    }
    return this.http.get<{aseguradoras: AseguradoraModel[], paginacion: Paginacion}>(
        `${this.host}${endpoint}`, { headers: { "Content-Type": "application/json",   "Authorization" : `Bearer ${this.obtenerTokenAutorizacion()}` } })
  }

  actualizarAseguradora(aseguradora: AseguradoraModel){
    return this.http.put(`${this.host}${this.rute}`, aseguradora, { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } } )
  }

}
