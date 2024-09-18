import { Component, OnInit, ViewChild } from '@angular/core';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { SoportesService } from '../../servicios/soportes.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { Soporte } from '../../modelos/Soporte';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';

@Component({
  selector: 'app-pagina-responder-soporte',
  templateUrl: './pagina-responder-soporte.component.html',
  styleUrls: ['./pagina-responder-soporte.component.css']
})
export class PaginaResponderSoporteComponent implements OnInit{
  @ViewChild('popup') popup!: PopupComponent
  formulario: FormGroup
  soporte?: Soporte
  respondido: boolean = false
  estado:string = 'false'

  constructor(private servicioSoporte: SoportesService, private servicioArchivos: ServicioArchivos, private activeRoute: ActivatedRoute, private router:Router){
    this.formulario = new FormGroup({
      respuesta: new FormControl<string | undefined>( {
        value: undefined,
        disabled: this.respondido
      } , [ Validators.required ] ),
      adjunto: new FormControl<File | undefined>( undefined )
    })
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe({
      next: (parametros) =>{
        const idSoporte = Number(parametros['idSoporte'])
        this.estado = String(parametros['estado'])

        let soporte = this.servicioSoporte.obtenerDeLocalSotrage()
        if(soporte && soporte.id === idSoporte){
          this.soporte = soporte
          this.rellenarSoporte(this.soporte.respuesta)
        }else{
          //sacar soporte del backend
        }
        this.formulario.controls['respuesta'].updateValueAndValidity()
      }
    })
  }

  responderSoporte(){
    if(this.formulario.invalid){
      marcarFormularioComoSucio(this.formulario)
      return
    }
    if(!this.soporte){
      this.popup.abrirPopupFallido('Algo salió mal', 'No se encontró el soporte al que responder')
      throw Error('No se encontró soporte al que responder')
    }
    const controls = this.formulario.controls
    this.servicioSoporte.responderSoporte(this.soporte.id, controls['respuesta'].value, controls['adjunto'].value).subscribe({
      next: ( soporte )=>{
        this.popup.abrirPopupExitoso('Respuesta enviada con éxito')
        this.soporte = soporte;
        this.limpiarFromulario()
      }
    })
  }

  rellenarSoporte(respuesta?: string){
    if(this.soporte!.idEstado !== 1){
      this.respondido = true
    }
    if(this.respondido){
      this.formulario.get('respuesta')!.setValue(respuesta)
      this.formulario.get('respuesta')!.disable()
      this.formulario.get('adjunto')!.disable()
    }
  }

  descargarArchivo(){
    if(!this.soporte || !this.soporte.documento){
      this.popup.abrirPopupFallido('Error al descargar el archivo.', 'Este soporte no tiene archivo adjunto.')
      return;
    }
    this.servicioArchivos.descargarArchivo(this.soporte.identificadorDocumento!, this.soporte.ruta!, this.soporte.documento)
  }

  descargarArchivoRespuesta(){
    if(!this.soporte || !this.soporte.documentoRespuesta){
      this.popup.abrirPopupFallido('Error al descargar el archivo.', 'Este soporte no tiene archivo adjunto.')
      return;
    }
    this.servicioArchivos.descargarArchivo(this.soporte.identificadorDocumentoRespuesta!, this.soporte.ruta!, this.soporte.documentoRespuesta)
  }

  volver(){
    this.router.navigate([`/administrar/soportes/${ this.estado }`])
  }

  limpiarFromulario(){
    this.formulario.reset()
  }
}
