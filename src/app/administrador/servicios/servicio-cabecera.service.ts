import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioCabeceraService {
  private cambioDeTitulo = new Subject<string[]>()

  constructor() {}

  public actualizarTitulo(cabecera:string[]):void{
    this.cambioDeTitulo.next(cabecera)
  }

  public suscribirseACambioDeTitulo():Observable<string[]>{
    return this.cambioDeTitulo.asObservable()
  }
}
