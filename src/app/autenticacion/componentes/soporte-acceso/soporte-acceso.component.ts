import { Component, ViewChild } from '@angular/core';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-soporte-acceso',
  templateUrl: './soporte-acceso.component.html',
  styleUrls: ['./soporte-acceso.component.css']
})
export class SoporteAccesoComponent {
  @ViewChild('popup') popup!: PopupComponent
  formulario: FormGroup
  generandoRadicado: boolean = false

  constructor(private servicioSoporte: AutenticacionService, private router: Router){
    this.formulario = new FormGroup({
      nit: new FormControl<string | undefined>( undefined, [ Validators.required ] ),
      correo: new FormControl<string | undefined>( undefined, [ Validators.required ] ),
      telefono: new FormControl<string | undefined>( undefined ),
      razonSocial: new FormControl<string | undefined>( undefined, [ Validators.required ] ),
      descripcion: new FormControl<string | undefined>( undefined, [ Validators.required ] ),
      adjunto: new FormControl<File | undefined>( undefined ),
      errorAcceso: new FormControl<string | undefined>( undefined, [ Validators.required ])
    })
  }

  crearSoporte(){
    if(this.formulario.invalid){
      marcarFormularioComoSucio(this.formulario)
      return
    }
    this.generandoRadicado = true
    const controls = this.formulario.controls
    this.servicioSoporte.crearSoporte({
      correo: controls['correo'].value,
      telefono: controls['telefono'].value,
      nit: controls['nit'].value,
      razonSocial: controls['razonSocial'].value,
      descripcion: controls['descripcion'].value,
      adjunto: controls['adjunto'].value,
      errorAcceso: controls['errorAcceso'].value
    }).subscribe({
      next: ( soporte: any )=>{
        this.generandoRadicado = false
        this.popup.abrirPopupExitoso('Soporte creado', 'Radicado', soporte.radicado)
        this.router.navigate(['/inicio-sesion'])
      },
      error: ( error: HttpErrorResponse )=>{
        this.generandoRadicado = false
        this.popup.abrirPopupFallido('Error al generar el ticket', error.error.message)
      }
    })
  }

  manejarExcedeTamano(){
    this.popup.abrirPopupFallido("El archivo pesa más de 7 Mb")
  }
}
