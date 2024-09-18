import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { environment } from 'src/environments/environment';
import { FiltrosSoportes } from '../FiltrosSoportes';
import { Paginable } from 'src/app/administrador/modelos/compartido/Paginable';
import { Soporte } from '../modelos/Soporte';
import { MotivoSoporte } from '../modelos/MotivoSoporte';

@Injectable({
  providedIn: 'root'
})
export class SoportesService extends Autenticable {
  public readonly ESTADOS = [
    {
      id: 1,
      descripcion: 'ABIERTO'
    },
    /* {
      id: 2,
      descripcion: 'EN PROCESO'
    }, */
    {
      id: 3,
      descripcion: 'CERRADO'
    }
  ]
  private readonly host = environment.urlBackend
  private readonly llaveLocalStorage = 'soporteVigia'

  constructor(private http: HttpClient) {
    super()
  }

  obtenerMotivos(){
    const endpoint = '/api/v1/soportes/motivos'
    return this.http.get<MotivoSoporte[]>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  responderSoporte(idSoporte:number, respuesta: string, adjuntable?: File){
    const endpoint = `/api/v1/soportes/responder/${idSoporte}`
    const formData = new FormData()
    formData.append('respuesta', respuesta)
    adjuntable ? formData.append('adjunto', adjuntable) : undefined
    return this.http.post<Soporte>(`${this.host}${endpoint}`, formData, { headers: this.obtenerCabeceraAutorizacion() })
  }

  crearSoporte(descripcion: string, motivo: number, adjuntable?: File) {
    const endpoint = `/api/v1/soportes`
    const formData = new FormData()
    formData.append('descripcion', descripcion)
    formData.append('motivo', motivo.toString())
    adjuntable ? formData.append('adjunto', adjuntable) : undefined
    return this.http.post<Soporte>(`${this.host}${endpoint}`, formData, { headers: this.obtenerCabeceraAutorizacion() })
  }

  obtenerSoportes(pagina: number, limite: number, filtros: FiltrosSoportes) {
    let endpoint = `/api/v1/soportes?pagina=${pagina}&limite=${limite}`
    for (const filtro in filtros) {
      const valor = filtros[filtro as keyof FiltrosSoportes];
      if(valor != undefined){
        endpoint+= `&${filtro}=${valor}`
      }
    }
    return this.http.get<Paginable<Soporte>>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  guardarEnLocalStorage(soporte: Soporte){
    localStorage.setItem(this.llaveLocalStorage, JSON.stringify(soporte))
  }

  obtenerDeLocalSotrage(): Soporte | null{
    const soporte = localStorage.getItem(this.llaveLocalStorage)
    return soporte ? JSON.parse(soporte) as Soporte : null
  }

  descargarArchivo(nombreArchivo: string, idSoporte: string){
    const extension = nombreArchivo.split('.')[1]
    const endpoint = `/api/v1/soportes/archivo/${idSoporte}.${extension}`
    const a = document.createElement('a')
    a.href = `${this.host}${endpoint}`
    a.click()
  }

  descargarArchivoRespuesta(nombreArchivo: string, idSoporte: string){
    const extension = nombreArchivo.split('.')[1]
    const endpoint = `/api/v1/soportes/archivo_respuesta/${idSoporte}.${extension}`
    const a = document.createElement('a')
    a.href = `${this.host}${endpoint}`
    a.click()
  }
}
