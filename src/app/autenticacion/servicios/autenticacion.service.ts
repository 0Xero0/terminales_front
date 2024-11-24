import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IniciarSesionRespuesta } from '../modelos/IniciarSesionRespuesta';
import { PeticionRecuperarContrasena } from '../modelos/PeticionRecuperarContrasena';
import { PeticionCrearSoporte } from '../modelos/PeticionCrearSoporte';
import { Soporte } from 'src/app/soportes/modelos/Soporte';
import { Aplicativos } from 'src/app/aplicativos/modelos/aplicativos';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private urlBackend: string
  headers: HttpHeaders;
  public readonly llaveTokenLocalStorage = 'jwtTerminales'
  public readonly llaveUsuarioLocalStorage = 'UsuarioTerminales'
  public readonly llaveRolesLocalStorage = 'rolTerminales'
  public readonly aplicativos = 'aplicativosTerminales'
  userToken: string = '';

  constructor(private clientHttp:HttpClient) {
    this.urlBackend = environment.urlBackend
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
    })
  }

  public inicioVigia2(token:string){
    const endpoint = '/api/v1/autenticacion/inicio-vigia'
    return this.clientHttp.post<any>(`${this.urlBackend}${endpoint}`, {token: token})
  }

  public iniciarSesion(documento:string, clave:string):Observable<IniciarSesionRespuesta>{
    const endpoint = '/api/v1/autenticacion/inicio-sesion'
    return this.clientHttp.post<IniciarSesionRespuesta>(`${this.urlBackend}${endpoint}`, {usuario: documento, contrasena: clave})
  }

  public cerrarSesion(){
    localStorage.removeItem('inicio-sesion')
    localStorage.removeItem('inicio-vigia2')
    localStorage.removeItem(this.llaveUsuarioLocalStorage)
    localStorage.removeItem(this.llaveTokenLocalStorage)
    localStorage.removeItem(this.llaveRolesLocalStorage)
    //localStorage.removeItem('solicitud')
    localStorage.removeItem('rutasRevisadas');
  }

  public guardarInformacionInicioSesion(jwt:string, rol:object, Usuario: object, aplicativos?: object):void{
    localStorage.setItem(this.llaveTokenLocalStorage, jwt),
    localStorage.setItem(this.llaveRolesLocalStorage, JSON.stringify(rol))
    localStorage.setItem(this.llaveUsuarioLocalStorage, JSON.stringify(Usuario))
    localStorage.setItem(this.aplicativos,JSON.stringify(aplicativos))
  }

  public recuperarContraseña(informacionUsuario:PeticionRecuperarContrasena): Observable<string>{
    const endpoint = '/api/v1/envio-email'
    return this.clientHttp.post<string>(`${this.urlBackend}${endpoint}`, informacionUsuario,)
  }

  public crearSoporte(peticion: PeticionCrearSoporte){
    const endpoint = `/api/v1/soportes/acceso`
    const formData = new FormData()
    formData.append('descripcion', peticion.descripcion)
    formData.append('razonSocial', peticion.razonSocial)
    formData.append('correo', peticion.correo)
    formData.append('nit', peticion.nit)
    formData.append('errorAcceso', peticion.errorAcceso)
    peticion.telefono ? formData.append('telefono', peticion.telefono) : undefined;
    peticion.adjunto ? formData.append('adjunto', peticion.adjunto) : undefined;
    return this.clientHttp.post<Soporte>(`${this.urlBackend}${endpoint}`, formData)
  }

  leerToken() {
    if (localStorage.getItem('tokenTerminales')) {
      this.userToken = localStorage.getItem('jwtTerminales')!;
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

}
