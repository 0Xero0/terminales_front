import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { ArchivoGuardado } from 'src/app/archivos/modelos/ArchivoGuardado';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import { ServicioProveedores } from '../../servicios/proveedores.service';
import { Aplicativos } from '../../modelos/Aplicativos';

@Component({
  selector: 'app-formulario-aspirante',
  templateUrl: './formulario-aspirante.component.html',
  styleUrls: ['./formulario-aspirante.component.css']
})
export class FormularioAspiranteComponent {
  @ViewChild('popup') popup!: PopupComponent

  formulario: FormGroup
  documentoCertificacion?: ArchivoGuardado
  documentoCamara?: ArchivoGuardado

  aplicativos:Aplicativos[] = []
  aplicativosSelect:{aplicativoId?:number,estado?:boolean}[] = []
  sinAplicativos:boolean = false

  constructor(private servicio: ServicioProveedores, private servicioArchivos: ServicioArchivos){
    this.formulario = new FormGroup({
      razon_social: new FormControl('', [ Validators.required ]),
      nit: new FormControl('', [ Validators.required ]),
      dv: new FormControl('', [ Validators.required ]),
      sigla: new FormControl('', [ Validators.required ]),
      estado_matricula: new FormControl('', [ Validators.required ]),
      correo_notificacion: new FormControl('', [ Validators.required ]),
      direccion: new FormControl('', [ Validators.required ]),

      nombres_rep_legal: new FormControl('', [ Validators.required ]),
      apellidos_rep_legal: new FormControl('', [ Validators.required ]),
      tipo_documento_rep_legal: new FormControl('', [ Validators.required ]),
      identificacion_rep_legal: new FormControl('', [ Validators.required ]),
      numero_contacto_rep_legal: new FormControl('', [ Validators.required ]),
      correo_rep_legal: new FormControl('', [ Validators.required ]),
      direccion_rep_legal: new FormControl('', [ Validators.required ]),

      nombres_cont_tecnico: new FormControl('', [ Validators.required ]),
      apellidos_cont_tecnico: new FormControl('', [ Validators.required ]),
      tipo_documento_cont_tecnico: new FormControl('', [ Validators.required ]),
      identificacion_cont_tecnico: new FormControl('', [ Validators.required ]),
      numero_contacto_cont_tecnico: new FormControl('', [ Validators.required ]),
      correo_cont_tecnico: new FormControl('', [ Validators.required ]),
      direccion_cont_tecnico: new FormControl('', [ Validators.required ]),

      doc_certificacion: new FormControl(null, [ Validators.required ]),
      doc_camara: new FormControl(null, [ Validators.required ]),
    })
  }

  ngOnInit(): void {
    this.obtenerAplicativos()
    this.formulario.get('doc_certificacion')?.valueChanges.subscribe({
      next: (valor: File | null)=>{
        this.manejarCambioDocumentoCertificacion(valor)
      }
    })

    this.formulario.get('doc_camara')?.valueChanges.subscribe({
      next: (valor: File | null)=>{
        this.manejarCambioDocumentoCamara(valor)
      }
    })
  }

  obtenerAplicativos(){
    this.servicio.maestraAplicativos().subscribe({
      next: (respuesta:any) => {
        this.aplicativos = respuesta
      }
    })
  }

  aplicativosSeleccionados(event:any,id?:any){
    if(event.target.checked){
      const checkbox = event.target as HTMLInputElement;
      const appSelect = (this.aplicativos.find(app => app.id === id))
      const aplicativoId = appSelect?.id
      const estado = checkbox.checked
      this.aplicativosSelect.push({aplicativoId,estado})
    }else{
      this.aplicativosSelect = this.aplicativosSelect.filter(aplicativo => aplicativo.aplicativoId !== id)
    }
    if(this.aplicativosSelect.length > 0){this.sinAplicativos = false}else{this.sinAplicativos = true}
  }

  enviarFormulario(){
    if(this.formulario.invalid){
      if(this.aplicativosSelect.length === 0){this.sinAplicativos = true}
      marcarFormularioComoSucio(this.formulario)
      this.popup.abrirPopupFallido('Formulario inválido.', 'Rellena todos los campos correctamente.')
      return;
    }else if(this.aplicativosSelect.length === 0){
      this.sinAplicativos = true;
      this.popup.abrirPopupFallido('Formulario inválido.', 'Rellena todos los campos correctamente.')
      return;
    }
    const controles = this.formulario.controls
    const formularioJSON = {
      razonSocial: controles['razon_social'].value,
      nit: controles['nit'].value,
      dv: controles['dv'].value,
      sigla: controles['sigla'].value,
      estadoMatricula: controles['estado_matricula'].value,
      correoNotificacion: controles['correo_notificacion'].value,
      direccion: controles['direccion'].value,

      nombresRepLegal: controles['nombres_rep_legal'].value,
      apellidosRepLegal: controles['apellidos_rep_legal'].value,
      correoRepLegal: controles['correo_rep_legal'].value,
      direccionRepLegal: controles['direccion_rep_legal'].value,
      numeroContactoRepLegal: controles['numero_contacto_rep_legal'].value,
      tipoDocumentoRepLegal: controles['tipo_documento_rep_legal'].value,
      identificacionRepLegal: controles['identificacion_rep_legal'].value,

      nombresContTecnico: controles['nombres_cont_tecnico'].value,
      apellidosContTecnico: controles['apellidos_cont_tecnico'].value,
      correoContTecnico: controles['correo_cont_tecnico'].value,
      direccionContTecnico: controles['direccion_cont_tecnico'].value,
      numeroContactoContTecnico: controles['numero_contacto_cont_tecnico'].value,
      tipoDocumentoContTecnico: controles['tipo_documento_cont_tecnico'].value,
      identificacionContTecnico: controles['identificacion_cont_tecnico'].value,

      docCamaraNombre: this.documentoCamara ? this.documentoCamara.nombreAlmacenado : '',
      docCamaraNombreOriginal: this.documentoCamara ? this.documentoCamara.nombreOriginalArchivo : '',
      docCamaraRuta: this.documentoCamara ? this.documentoCamara.ruta : '',

      docCertificacionNombre: this.documentoCertificacion ? this.documentoCertificacion.nombreAlmacenado : '',
      docCertificacionNombreOriginal: this.documentoCertificacion ? this.documentoCertificacion.nombreOriginalArchivo : '',
      docCertificacionRuta: this.documentoCertificacion ? this.documentoCertificacion.ruta : '',

      aplicativos: this.aplicativosSelect
    };
    this.servicio.enviarFormularioAspiranteTecnologico(formularioJSON).subscribe({
      next: (aspirante:any)=>{
        this.popup.abrirPopupExitoso('Formulario enviado correctamente.')
        this.limpiarFormulario()
      },
      error: (error:any)=>{
        this.popup.abrirPopupFallido('Ha ocurrido un error.', 'Intentalo más tarde.')
      }
    })
  }

  manejarCambioDocumentoCamara(file: File | null){
    if(file){
      this.guardarArchivoCamara(file)
    }
  }

  manejarCambioDocumentoCertificacion(file: File | null){
    if(file){
      this.guardarArchivoCertificacion(file)
    }
  }

  guardarArchivoCamara(file: File){
    this.servicioArchivos.guardarArchivo(file, 'proveedores', this.formulario.get('nit')!.value).subscribe({
      next: (archivo:any)=>{
        this.documentoCamara = archivo
        //console.log(this.documentoCamara)
      }
    })
  }

  guardarArchivoCertificacion(file: File){
    this.servicioArchivos.guardarArchivo(file, 'proveedores', this.formulario.get('nit')!.value).subscribe({
      next: (archivo:any)=>{
        this.documentoCertificacion = archivo
        //console.log(this.documentoCertificacion)
      }
    })
  }

  limpiarFormulario(){
    this.formulario.reset()
    this.aplicativos.forEach(app => app.estado = false);
    this.aplicativosSelect = []
  }
}
