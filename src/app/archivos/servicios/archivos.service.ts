import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { ArchivoGuardado } from '../modelos/ArchivoGuardado';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ServicioArchivos extends Autenticable {
  private readonly host = environment.urlBackendArchivos
  private readonly hostCore = environment.urlBackend

  constructor(private http: HttpClient) {
    super()
  }

  guardarArchivo(archivo: File, ruta: string, idVigilado: string): Observable<ArchivoGuardado>{
    const endpoint = '/api/v1/archivos'
    const formData = new FormData()
    formData.append('archivo', archivo)
    formData.append('idVigilado', idVigilado)
    formData.append('rutaRaiz', ruta)
    return this.http.post<ArchivoGuardado>(
      `${this.host}${endpoint}`, 
      formData, 
      { headers: { Authorization: `Bearer d4a32a3b-def6-4cc2-8f77-904a67360b53` } }
    )
  }

  descargarArchivo(nombreArchivo: string, ruta: string, nombreOriginal: string){
    this.http.get<{archivo: string}>(
      `${this.host}/api/v1/archivos?nombre=${nombreArchivo}&ruta=${ruta}`,
      { headers: { Authorization: `Bearer d4a32a3b-def6-4cc2-8f77-904a67360b53` } }
    )
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al descargar el archivo:', error);
        return throwError('Error al descargar el archivo.');
      })
    )
    .subscribe((respuesta) => {
      const blob = this.b64toBlob(respuesta.archivo)
      saveAs(blob, nombreOriginal);
    });
  }

  descargarArchivoUrl(endpoint: string){
    this.http.get<{archivoDescargar: string, nombre: string}>(
      `${this.hostCore}/api/v1${endpoint}`,
      { headers: { Authorization: `Bearer d4a32a3b-def6-4cc2-8f77-904a67360b53` } }
    )
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al descargar el archivo:', error);
        return throwError('Error al descargar el archivo.');
      })
    )
    .subscribe((respuesta) => {
      const blob = this.b64toBlob(respuesta.archivoDescargar)
      saveAs(blob, respuesta.nombre);
    });
  }

  descargarBase64(base64: string, nombre: string){
    saveAs(this.b64toBlob(base64), nombre) 
  }

  //stack overflow :D
  private b64toBlob(b64Data: string, contentType='', sliceSize = 512): Blob{
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

}
