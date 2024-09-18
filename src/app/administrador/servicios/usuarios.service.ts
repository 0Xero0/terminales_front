import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Autenticable } from './compartido/Autenticable';
import { InfoSistemaVigia } from '../modelos/usuarios/InfoSistemaVigia';
import { PeticionActualizarContrasena } from 'src/app/autenticacion/modelos/PeticionActualizarContrasena';

@Injectable({
  providedIn: 'root'
})
export class ServicioUsuarios extends Autenticable {
  private readonly hostVigia = environment.urlBackendVigia
  private readonly urlBackend = environment.urlBackend

  constructor(private httpClient: HttpClient) {
    super()
  }

  obtenerInformacionSistemaVigia(documentoUsuario: string){
    const endpoint = `/api/v1/vista?documento=${documentoUsuario}`
    const t = '2c9b417a-75af-46c5-8ca0-340d3acdb3c7'
    return this.httpClient.get<InfoSistemaVigia>(`${this.hostVigia}${endpoint}`, {headers: { Authorization: `Bearer ${t}`}})
  }

  ActualizarContraseñaUsuario(usuarioEmpresa:PeticionActualizarContrasena){
    const endpoint = `/api/v1/autenticacion/cambiar-clave`;
    return this.httpClient.post<string>(`${this.urlBackend}${endpoint}`, usuarioEmpresa, {headers: this.obtenerCabeceraAutorizacion()})
  }

}
