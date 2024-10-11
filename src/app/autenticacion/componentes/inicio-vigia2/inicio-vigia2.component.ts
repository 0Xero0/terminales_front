import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { IniciarSesionRespuesta } from '../../modelos/IniciarSesionRespuesta';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { environment } from 'src/environments/environment';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';

@Component({
  selector: 'app-inicio-vigia2',
  templateUrl: './inicio-vigia2.component.html',
  styleUrls: ['./inicio-vigia2.component.css']
})
export class InicioVigia2Component {
  @ViewChild('popup') popup!: PopupComponent
  public readonly llaveCaptcha = environment.llaveCaptcha

  token: string | null = null

  constructor(private servicioAutenticacion: AutenticacionService,private enrutador: Router, private route: ActivatedRoute) {}

  ngOnInit(): void{
    // Obtener el token de la URL
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
      //console.log('Token:', this.token);
      // Aquí puedes hacer algo con el token, como almacenarlo en el localStorage
      if (this.token) {
        localStorage.setItem('authToken', this.token);
        Swal.fire({
          icon: 'info',
          allowOutsideClick: false,
          text: 'Espere por favor...',
        });
        Swal.showLoading(null);
        this.servicioAutenticacion.inicioVigia2(this.token).subscribe({
          next: (respuesta: IniciarSesionRespuesta) => {
            Swal.close()
            this.servicioAutenticacion.guardarInformacionInicioSesion(
              respuesta.token,
              respuesta.rol,
              respuesta.usuario
            )
            if (respuesta.claveTemporal === true) {
              this.enrutador.navigateByUrl('/actualizar-contrasena')
            } else {
              if(respuesta.rol.modulos.length > 0){
                if(!respuesta.rol.modulos[0].ruta && respuesta.rol.modulos[0].submodulos.length > 0){
                  this.enrutador.navigateByUrl(`/administrar${respuesta.rol.modulos[0].submodulos[0].ruta}`);
                }else{
                  this.enrutador.navigateByUrl(`/administrar${respuesta.rol.modulos[0].ruta}`);
                }
              }
              else{
                this.enrutador.navigateByUrl(`/administrar`);
              }
            }
          },
          error: (error: HttpErrorResponse) => {
            if (error.status == 423) {
              this.popup.abrirPopupFallido('Error al iniciar sesión', error.error.message)
            }
            if (error.status == 400) {
              this.popup.abrirPopupFallido('Error al iniciar sesión', error.error.message)
            }
          }
        })
      };
    })
  }
}
