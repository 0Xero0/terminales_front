import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalPortalTargets, SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { IconoPopup, OpcionesPopup } from './interfaces.popup';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  @ViewChild('exitoso') popupExitoso!:SwalComponent
  @ViewChild('fallido') popupFallido!: SwalComponent
  @ViewChild('popup') popup!: SwalComponent

  opciones: OpcionesPopup = {
    icono: 'exitoso'
  } 

  public tituloExito:string = 'Éxito'
  public claveRecurso?:string
  public valorRecurso?:string
  public descripcionExito?:string

  public tituloFallido = 'Error'
  public infoFallido?:string

  constructor(public readonly swalTargets: SwalPortalTargets) { }

  ngOnInit(): void {
  }

  abrir(opciones: OpcionesPopup){
    this.opciones = opciones
    this.popup.swalOptions = {
      showConfirmButton: false,
      customClass: {popup: 'card'},
    }
    this.popup.fire().then( _ => { if(opciones.alCerrar) opciones.alCerrar() })
  }

  cerrar(){
    this.popup.close()
  }

  public abrirPopupExitoso(titulo:string, claveRecurso?:string, valorRecurso?:string){
    this.tituloExito = titulo
    if(claveRecurso && valorRecurso){
      this.claveRecurso = claveRecurso
      this.valorRecurso = valorRecurso
    }else{
      this.claveRecurso = undefined;
      this.valorRecurso = undefined;
    }
    this.popupExitoso.swalOptions = {
      showConfirmButton: false,
      customClass: {popup: 'card'},
    }
    this.popupExitoso.fire()
  }

  public cerrarPopupExitoso():void{
    this.popupExitoso.close()
  }

  public abrirPopupFallido(titulo:string, info?:string){
    this.infoFallido = info
    this.tituloFallido = titulo
    this.popupFallido.swalOptions = {
      showConfirmButton: false,
      customClass: {popup: 'card'}
    }
    this.popupFallido.fire()
  }

  public cerrarPopupFallido(){
    this.popupFallido.close()
  }

}
