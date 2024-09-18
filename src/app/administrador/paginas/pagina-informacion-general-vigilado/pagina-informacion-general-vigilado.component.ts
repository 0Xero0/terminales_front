import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ServicioUsuarios } from '../../servicios/usuarios.service';
import { InfoSistemaVigia } from '../../modelos/usuarios/InfoSistemaVigia';
import { ServicioLocalStorage } from '../../servicios/local-storage.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { ErrorAutorizacion } from 'src/app/errores/ErrorAutorizacion';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';

@Component({
  selector: 'app-pagina-informacion-general-vigilado',
  templateUrl: './pagina-informacion-general-vigilado.component.html',
  styleUrls: ['./pagina-informacion-general-vigilado.component.css']
})
export class PaginaInformacionGeneralVigiladoComponent implements OnInit, AfterViewInit {
  @ViewChild('popup') popup!: PopupComponent
  informacion?: InfoSistemaVigia
  usuario: Usuario
  formulario: FormGroup
  hayError: boolean = false
  mensajeError = ""

  constructor(private servicioUsuarios: ServicioUsuarios, localStorage: ServicioLocalStorage){
    this.formulario = new FormGroup({
      numeroDocumento: new FormControl({ value: undefined, disabled: true }),
      razonSocial: new FormControl({ value: undefined, disabled: true }),
      vigilado: new FormControl({ value: undefined, disabled: true }),
      direccion: new FormControl({ value: undefined, disabled: true }),
      idMunicipio: new FormControl({ value: undefined, disabled: true }),
      nombreMunicipio: new FormControl({ value: undefined, disabled: true }),
      idDepartamento: new FormControl({ value: undefined, disabled: true }),
      nombreDepto: new FormControl({ value: undefined, disabled: true }),
      tipoDocRepLegal: new FormControl({ value: undefined, disabled: true }),
      numeroDocuRepresentante: new FormControl({ value: undefined, disabled: true }),
      nombreRepresentante: new FormControl({ value: undefined, disabled: true }),
      apellidoRepresentante: new FormControl({ value: undefined, disabled: true }),
      correoElectronicoRepres: new FormControl({ value: undefined, disabled: true }),
      correoElectronico: new FormControl({ value: undefined, disabled: true}),
      correoPrincipalNotificacion: new FormControl({ value: undefined, disabled: true}),
      correoOpcionalNotificacion: new FormControl({ value: undefined, disabled: true}),
      tipoDoc: new FormControl({ value: undefined, disabled: true}),
      telefono: new FormControl({ value: undefined, disabled: true})
    })
    const usuario = localStorage.obtenerUsuario()
    if(!usuario){
      throw new ErrorAutorizacion()
    }
    this.usuario = usuario
  }
  
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.obtenerInfoSistemaVigia(this.usuario.usuario)
  }

  obtenerInfoSistemaVigia(documentoUsuario: string){
    this.servicioUsuarios.obtenerInformacionSistemaVigia(documentoUsuario).subscribe({
      next: (info) =>{
        this.informacion = info
        this.rellenarFormulario(info)
      },
      error: (error: HttpErrorResponse) => { 
        this.mensajeError = error.error.mensaje
        this.hayError = true
        this.popup.abrirPopupFallido('¡Lo sentimos!', this.mensajeError)
      }
    })
  }

  inicializarFormulario(){

  }

  rellenarFormulario(informacion: InfoSistemaVigia){
    this.formulario.controls['numeroDocumento'].setValue( informacion.numeroDocumento) 
    this.formulario.controls['razonSocial'].setValue( informacion.razonSocial) 
    this.formulario.controls['vigilado'].setValue( informacion.vigilado) 
    this.formulario.controls['direccion'].setValue( informacion.direccion) 
    this.formulario.controls['idMunicipio'].setValue( informacion.idMunicipio) 
    this.formulario.controls['nombreMunicipio'].setValue( informacion.nombreMunicipio) 
    this.formulario.controls['idDepartamento'].setValue( informacion.idDepartamento) 
    this.formulario.controls['nombreDepto'].setValue( informacion.nombreDepto) 
    this.formulario.controls['tipoDocRepLegal'].setValue( informacion.tipoDocRepLegal) 
    this.formulario.controls['numeroDocuRepresentante'].setValue( informacion.numeroDocuRepresentante) 
    this.formulario.controls['nombreRepresentante'].setValue( informacion.nombreRepresentante) 
    this.formulario.controls['apellidoRepresentante'].setValue( informacion.apellidoRepresentante) 
    this.formulario.controls['correoElectronicoRepres'].setValue( informacion.correoElectronicoRepres)
    this.formulario.controls['correoElectronico'].setValue(informacion.correoElectronico)
    this.formulario.controls['correoPrincipalNotificacion'].setValue(informacion.correoPrincipalNotificacion)
    this.formulario.controls['correoOpcionalNotificacion'].setValue(informacion.correoOpcionalNotificacion)
    this.formulario.controls['telefono'].setValue(informacion.telefono)
    this.formulario.controls['tipoDoc'].setValue(informacion.tipoDoc)
  }
}
