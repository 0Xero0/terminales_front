import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class MenuHeaderPService {
    /***ingeniero Paolo */
    constructor() {}
    public RutaModelo:string='';
    public RutaActual:string='';
    ActivarOpcionMenuPpal(rutaModelo:string,rutaActual:string): boolean
    {
        return true;
    }

    AsginarRutas(rutaModelo:string,rutaActual:string)
    {
        this.RutaActual=rutaActual;
        this.RutaModelo=rutaModelo;
    }

  }