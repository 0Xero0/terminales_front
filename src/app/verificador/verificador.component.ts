import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VerificarSubjetivoService } from './servicios/verificar-vigia.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verificador',
  templateUrl: './verificador.component.html',
  styleUrls: ['./verificador.component.css']
})
export class VerificadorComponent {
  public formulario: FormGroup
  documento:string = ""

  constructor(
    private verificarSubjetivo: VerificarSubjetivoService,private enrutador: Router){
    this.formulario = new FormGroup({
      documentoId: new FormControl('', [Validators.required])
    })
  }

  verificar(){
    if (this.formulario.invalid) {
      this.marcarFormularioComoSucio()
      return;
    }
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });
    Swal.showLoading(null);
    this.verificarSubjetivo.verificar(
      this.formulario.controls['documentoId'].value.toString()
    ).subscribe({
      next: (respuesta:any) => {
        if(respuesta){
          if(respuesta.estado){
            Swal.fire({
              titleText:respuesta.mensaje,
              /* html:nombresHtml, */
              icon:'success',
              confirmButtonText:'Ir a inicio de sesión',
              showCancelButton:true,
              cancelButtonText:'Cancelar'
            }).then((result) => {
              if(result.isConfirmed){
                this.enrutador.navigateByUrl('/inicio-sesion')
              }
            })
          }else{
            Swal.fire({
              titleText:respuesta.mensaje,
              icon:'error'
            })
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          titleText: '¡Ha ocurrido un error!',
          text: error.error,
          icon:'error'
        })
      }
    })
  }

  marcarFormularioComoSucio(): void {
    (<any>Object).values(this.formulario.controls).forEach(
      (control: FormControl) => {
      control.markAsDirty();
      if (control) {
        control.markAsDirty()
      }
    });
  }
}
