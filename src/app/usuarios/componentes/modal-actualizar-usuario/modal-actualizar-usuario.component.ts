import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Usuario } from '../../modelos/Usuario';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ServicioUsuarios } from '../../servicios/usuarios.service';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { Rol } from '../../modelos/Rol';
import { DateTime } from 'luxon';
import { Departamento } from '../../modelos/Departamento';
import { Ciudad } from '../../modelos/Ciudad';
import { Aplicativos } from '../../modelos/Aplicativos';
import Swal from 'sweetalert2';
import { onlyNumberKey } from '../../validadores/SoloNumeros';
import { validateEmail } from '../../validadores/validarEmail';

@Component({
  selector: 'app-modal-actualizar-usuario',
  templateUrl: './modal-actualizar-usuario.component.html',
  styleUrls: ['./modal-actualizar-usuario.component.css']
})
export class ModalActualizarUsuarioComponent implements OnInit{
  @ViewChild('modal') modal!: ElementRef
  @ViewChild('popup') popup!: PopupComponent

  @Output('usuarioActualizado') usuarioActualizado: EventEmitter<void>;
  usuario?: Usuario
  formulario: FormGroup
  roles: Rol[] = []
  aplicativos: Aplicativos[] = []
  departamentos: Departamento[] = []
  municipios: Ciudad[] = []

  deshabilitado: boolean = true
  aplicativosSelect:{aplicativoId?:number,estado?:boolean}[] = []
  esVigilado: boolean = false
  mostrarAplicativos:Aplicativos[] = []
  errorCorreo: boolean = false

  constructor(
    private servicioModal: NgbModal,
    private servicio: ServicioUsuarios,
  ){
    this.usuarioActualizado = new EventEmitter<void>();
    this.formulario = new FormGroup({
      nombre: new FormControl(undefined, [ Validators.required ]),
      identificacion: new FormControl(undefined, [ Validators.required ]),
      correo: new FormControl(undefined, [ Validators.required]),
      rol: new FormControl("", [ Validators.required ])
    })
  }

  ngOnInit(): void {
    this.obtenerRoles()
    this.obtenerAplicativos()
  }

  validarCorreo(){
    this.errorCorreo = validateEmail(this.formulario.controls['correo'].value)
  }

  abrir(usuario: Usuario){
    this.usuario = usuario
    this.rellenarFormulario(usuario)
    this.servicioModal.open(this.modal, {
      size: 'xl'
    })
  }

  cerrar(){
    this.servicioModal.dismissAll();
  }

  actualizar(){

    if(this.formulario.invalid){
      marcarFormularioComoSucio(this.formulario)
      return;
    };
    if(this.esVigilado){
      if(this.aplicativosSelect.length === 0){
        Swal.fire({titleText: 'Debe asignar al Vigilado al menos un módulo.', icon: 'warning'})
        return
      }
    };//console.log(this.formulario.controls)
    const appCrear = this.aplicativosSelect.map(app => ({aplicativoId:app.aplicativoId,estado:app.estado}))
    const controls = this.formulario.controls
    const usuarioJSON = {
      nombre: controls['nombre'].value,
      identificacion: controls['identificacion'].value,
      correo: controls['correo'].value,
      idRol: controls['rol'].value,
      aplicativos:appCrear
    }
    console.log(usuarioJSON)
    this.servicio.actualizar(this.usuario!.identificacion, usuarioJSON).subscribe({
      next: ()=>{
        this.usuarioActualizado.emit();
        this.cerrar()
      },
      error: ()=>{
        this.popup.abrirPopupFallido("Error al actualizar el usuario", "Intentalo más tarde.")
      }
    })
  }

  rellenarFormulario(usuario: Usuario){
    const controls = this.formulario.controls
    controls['nombre'].setValue(usuario.nombre)
    controls['correo'].setValue(usuario.correo)
    controls['identificacion'].setValue(usuario.identificacion)
    controls['rol'].setValue(usuario.idRol)
    const selectedIds = new Set(usuario.aplicativos.map(ap => ap.id))
    this.mostrarAplicativos = this.aplicativos.map(ap => ({
      id: ap.id,
      titulo: ap.titulo,
      estado: selectedIds.has(ap.id)
    }))
    this.aplicativosSelect = this.mostrarAplicativos.map(ap => ({
      aplicativoId:ap.id,
      estado: ap.estado
    }))
    this.deshabilitarVigilado()
    //console.log(this.aplicativosSelect)
  }

  limpiarFormulario(){
    this.formulario.reset()
    this.formulario.get('rol')!.setValue("")
    this.esVigilado = false
    this.aplicativosSelect = []
  }

  obtenerRoles(){
    this.servicio.listarRoles().subscribe({
      next: (respuesta) => {
        this.roles = respuesta.rols
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

  validarRol(rolId:any){
    this.esVigilado = (rolId === "003")
  }

  aplicativosSeleccionados(event:any,id?:any){
    if(event.target.checked){
      for(let app of this.aplicativosSelect){
        if(app.aplicativoId === id){
          app.estado = true
        }
      }
    }else{
      for(let app of this.aplicativosSelect){
        if(app.aplicativoId === id){
          app.estado = false
        }
      }
    }
    console.log('seleccionados: ', this.aplicativosSelect)
  }

  deshabilitarVigilado(){
    const controls = this.formulario.controls
    if(controls['rol'].value === '003'){
      //console.log('desactivar')
      controls['identificacion'].disable()
      controls['nombre'].disable()
      controls['correo'].disable()
      controls['rol'].disable()
    }else{
      controls['identificacion'].enable()
      controls['nombre'].enable()
      controls['correo'].enable()
      controls['rol'].enable()
    }
  }

  validarSoloNumeros(event:KeyboardEvent){
    onlyNumberKey(event)
  }
}
