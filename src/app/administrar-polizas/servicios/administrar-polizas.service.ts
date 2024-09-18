import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Autenticable } from "src/app/administrador/servicios/compartido/Autenticable";
import { environment } from 'src/environments/environment';
import { Observable, catchError, map, mergeMap, throwError } from "rxjs";
import * as saveAs from "file-saver";
import * as XLSX from 'xlsx';
import { ServicioArchivos } from "src/app/archivos/servicios/archivos.service";
import { ArchivoGuardado } from "src/app/archivos/modelos/ArchivoGuardado";
import { FiltrosVehiculos } from "../modelos/FiltrosVehiculos";
import { GuardarPoliza, PolizaJsonModel } from "../modelos/guardarPoliza";
import { CapacidadesModel } from "../modelos/modalidades";

@Injectable({
    providedIn: 'root'
})
export class ServicioAdministrarPolizas extends Autenticable{

    private readonly host = environment.urlBackend

    constructor(
      private http: HttpClient,
      private servicioArchivos: ServicioArchivos,
    ) {
        super()
    }

    obtenerEstadoVigilado()
    :Observable<boolean>{
      let endpoint = `/api/v1/estados/enviadost`
      return this.http.get<any>(
        `${this.host}${endpoint}`,
        { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
      )
    }

    obtenerPolizas(id: number)
    :Observable<any>{
        let endpoint = `/api/v1/poliza?modalidadId=${id}`
        return this.http.get<any>(
          `${this.host}${endpoint}`,
          { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
        )
    }

    obtenerModalidades()
    :Observable<any>{
        let endpoint = `/api/v1/maestras/modalidades`
        return this.http.get<any>(
          `${this.host}${endpoint}`,
          { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
        )
    }

    obtenerAseguradora()
    :Observable<any>{
        let endpoint = `/api/v1/maestras/aseguradoras`
        return this.http.get<any>(
          `${this.host}${endpoint}`,
          { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
        )
    }

    guardarPoliza(polizaJson: PolizaJsonModel){
      console.log(polizaJson)
      const endpoint = `/api/v1/poliza`
      return this.http.post<any>(
        `${this.host}${endpoint}`,
        polizaJson,
        { headers: { "Content-Type": "application/json",   "Authorization" : `Bearer ${this.obtenerTokenAutorizacion()}` } }
      )
    }

    guardarCapacidades(capacidadJson?: CapacidadesModel){
      console.log(capacidadJson)
      const endpoint = `/api/v1/poliza/capacidades`
      return this.http.post<any>(
        `${this.host}${endpoint}`,
        capacidadJson,
        { headers: { "Content-Type": "application/json",   "Authorization" : `Bearer ${this.obtenerTokenAutorizacion()}` } }
      )
    }

    descargarCadenaBase64():Observable<string>{
      let endpoint = `/api/v1/vehiculos/plantillas/vehiculos.xlsx`
      return this.http.get(
        `${this.host}${endpoint}`,
        { responseType: 'text' }
      )
    }

    descargarArchivoXLSX(cadenaBase64: string, nombre: string): void {
      const workbook: XLSX.WorkBook = XLSX.read(cadenaBase64, { type: 'base64' });
      const archivoBlob = this.convertirWorkbookABlob(workbook);
      saveAs(archivoBlob, nombre);
    }
    private convertirWorkbookABlob(workbook: XLSX.WorkBook): Blob {
      const workbookArray = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
      return new Blob([workbookArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }

    cargarArchivoXLSX(archivo: File, numeroPoliza: string, tipoPoliza: any){
      const endpoint = `/api/v1/vehiculos/importar`
      const formData = new FormData()
      formData.append('archivo', archivo)
      formData.append('poliza', numeroPoliza)
      formData.append('tipo', tipoPoliza.toString())
      return this.http.post<any>(
        `${this.host}${endpoint}`,
        formData,
        { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
      )
    }

    cargarArchivoPDF(archivoPDF: File){
      const endpoint = `/api/v1/archivos`
      const formData = new FormData()
      formData.append('archivo', archivoPDF)
      return this.http.post<ArchivoGuardado>(
        `${this.host}${endpoint}`,
        formData,
        { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
      )
    }

    vehiculos(pagina: number, limite: number, filtros?:FiltrosVehiculos, vigiladoId?:string) {
      let endpoint = `/api/v1/poliza/vehiculos?pagina=${pagina}&limite=${limite}`;

      if(filtros){
       if(filtros.termino) endpoint+=`&termino=${filtros.termino}`;
      }
      if (vigiladoId) {
        endpoint+=`&vigiladoId=${vigiladoId}`;
      }

      return this.http.get(`${this.host}${endpoint}`,{ headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } })

    }

    exportar(pagina: number, limite: number, filtros?:FiltrosVehiculos, vigiladoId?:string) {
      let endpoint = `/api/v1/exportar/vehiculos?pagina=${pagina}&limite=${limite}`;
      console.log(filtros);

      if(filtros){
       if(filtros.termino) endpoint+=`&termino=${filtros.termino}`;
      }
      if (vigiladoId) {
        endpoint+=`&vigiladoId=${vigiladoId}`;
      }

      const url = `${this.host}${endpoint}`;

// Abrir la URL en otra ventana
window.open(url, '_blank');

      /* this.http.get(`${this.host}${endpoint}`,{ headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }) */

    }

}
