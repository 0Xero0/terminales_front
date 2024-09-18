import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paginacion } from '../modelos/compartido/Paginacion';
import { Empresa } from '../modelos/empresas/Empresa';
import { PeticionActualizarEmpresa } from '../modelos/empresas/PeticionActualizarEmpresa';
import { PeticionRegistrarEmpresa } from '../modelos/empresas/PeticionRegistrarEmpresa';
import { Autenticable } from './compartido/Autenticable';

const apiUrl = 'http://127.0.0.1:3333/api/v1'
@Injectable({
  providedIn: 'root'
})
export class ServicioEmpresa extends Autenticable{
  private urlBackend:string
  headers: HttpHeaders;


  constructor(private http: HttpClient) {
    super()
    this.urlBackend = environment.urlBackend
    this.headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${this.obtenerTokenAutorizacion()}`
    })
  }

  obtenerEmpresas(pagina: number, limite: number): Observable<{empresas: Empresa[], paginacion:Paginacion}> {
    const endpoint = `/api/v1/empresa/listar/${pagina}/${limite}`
    return this.http.get<{empresas: Empresa[], paginacion:Paginacion}>(`${this.urlBackend}${endpoint}`, { headers: this.headers });
  }

  obtenerEmpresaPorID(empresa_id: number): Observable<Empresa>{
    const endpoint = `/api/v1/empresa/${empresa_id}`;
    return this.http.get<Empresa>(`${this.urlBackend}${endpoint}`, {headers: this.headers});
  }

  registrarEmpresa(empresa: PeticionRegistrarEmpresa): Observable<void>{
    const endpoint = `/api/v1/empresa/registro`
    return this.http.post<void>(`${this.urlBackend}${endpoint}`, empresa, {headers: this.headers})
  }

  public ActualizarEmpresa(empresa_id:number, empresa:PeticionActualizarEmpresa): Observable<number>{
    const endpoint = `/api/v1/empresa/${empresa_id}`;
    return this.http.patch<number>(`${this.urlBackend}${endpoint}`, empresa, {headers: this.headers})
  }

  public cambiarEstadoEmpresa(empresa_id:number):Observable<any>{
    const endpoint = `/api/v1/empresa/estado/${empresa_id}`
    return this.http.put<any>(`${this.urlBackend}${endpoint}`,{headers: this.headers})
  }
}
