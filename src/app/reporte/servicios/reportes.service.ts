import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Autenticable } from "src/app/administrador/servicios/compartido/Autenticable";
import { environment } from "src/environments/environment.qa";

@Injectable({
  providedIn: 'root'
})
export class ReportesService extends Autenticable {

  private readonly host = environment.urlBackend

  constructor(private http: HttpClient) {
    super()
  }

  obtenerReportes() {
    let endpoint = `/api/v1/soportes/vigilado`
    return this.http.get<any>(`${this.host}${endpoint}`,
      { headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('tokenVigia')}`
    }) })
  }

  maestraAplicativos(){
    const endpoint = `/api/v1/maestras/aplicativos`
    return this.http.get(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

}
