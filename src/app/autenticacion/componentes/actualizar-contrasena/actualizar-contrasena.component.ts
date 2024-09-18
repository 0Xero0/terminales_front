import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicioUsuarios } from 'src/app/administrador/servicios/usuarios.service';
import { PeticionActualizarContrasena } from '../../modelos/PeticionActualizarContrasena';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { AutenticacionService } from '../../servicios/autenticacion.service';

@Component({
  selector: 'app-actualizar-contrasena',
  templateUrl: './actualizar-contrasena.component.html',
  styleUrls: ['./actualizar-contrasena.component.css']
})
export class ActualizarContrasenaComponent implements OnInit {
  @ViewChild('popup') popup!: PopupComponent
  public formulario: FormGroup
  public readonly llaveUsuarioLocalStorage = 'UsuarioVigia'



  constructor(private enrutador: Router, private servicioUsuarios: ServicioUsuarios, private servicioAutenticacion: AutenticacionService) {
    this.formulario = new FormGroup({
      antigua_contrasena: new FormControl('', [Validators.required]),
      nueva_contrasena: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#_<>^~`()+-])([A-Za-z\d$@$!%*?&]|[^ ]){8,100}$/)]),
      confirmmar_contrasena: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit(): void {
  }

  actualizarContrasena() {
    if(this.formulario.invalid){
      this.popup.abrirPopupFallido('Formulario inválido.', 'Rellena correctamente todos los campos.')
      return;
    }
    if (this.formulario.controls['nueva_contrasena'].value !== this.formulario.controls['confirmmar_contrasena'].value) {
      this.popup.abrirPopupFallido('Las contraseñas no coinciden.', 'Confirma que la contraseña.')
      return;
    }
    let usuario = localStorage.getItem(this.llaveUsuarioLocalStorage)
    const Usuario = JSON.parse(usuario!)
    this.servicioUsuarios.ActualizarContraseñaUsuario(new PeticionActualizarContrasena(
      Usuario.usuario!,
      this.formulario.controls['antigua_contrasena'].value,
      this.formulario.controls['nueva_contrasena'].value
    )).subscribe({
      next: (respuesta) => {
        this.popup.abrirPopupExitoso('Contraseña actualizada con éxito')
        this.limpiarFormulario()
        this.cerrarSesion()
      },
      error: (error: HttpErrorResponse) => {
        if(error.status === 400){
          this.popup.abrirPopupFallido('Credenciales incorrectas.')
        }else{
          this.popup.abrirPopupFallido('Ha ocurrido un error.', 'Intentalo más tarde.')
        }
      }
    })
  }

  public limpiarFormulario(): void {
    this.formulario.reset()
  }

  public cerrarSesion() {
    this.servicioAutenticacion.cerrarSesion();
    this.enrutador.navigateByUrl('/inicio-sesion')
  }

}
