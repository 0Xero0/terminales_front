import { Component, OnInit, ViewChild } from '@angular/core';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { FiltrosUsuarios } from '../../modelos/FiltrosUsuarios';
import { ServicioUsuarios } from '../../servicios/usuarios.service';
import { Observable } from 'rxjs';
import { Usuario } from '../../modelos/Usuario';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { ModalActualizarUsuarioComponent } from '../../componentes/modal-actualizar-usuario/modal-actualizar-usuario.component';
import { Rol } from '../../modelos/Rol';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { Departamento } from '../../modelos/Departamento';
import { Ciudad } from '../../modelos/Ciudad';
import { formatDate } from '@angular/common';
import { formatearFechaIso } from 'src/app/compartido/Fechas';
import { DateTime } from 'luxon';
import { Aplicativos } from '../../modelos/Aplicativos';
import { InfoSistemaVigia } from 'src/app/administrador/modelos/usuarios/InfoSistemaVigia';
import Swal from 'sweetalert2';
import { onlyNumberKey } from '../../validadores/SoloNumeros';
import { validateEmail } from '../../validadores/validarEmail';

@Component({
  selector: 'app-pagina-crear-usuario',
  templateUrl: './pagina-crear-usuario.component.html',
  styleUrls: ['./pagina-crear-usuario.component.css']
})
export class PaginaCrearUsuarioComponent implements OnInit{
  @ViewChild('modalActualizarUsuario') modalActualizarUsuario!: ModalActualizarUsuarioComponent
  @ViewChild('popup') popup!: PopupComponent
  paginador: Paginador<FiltrosUsuarios>
  usuarios: Usuario[] = []
  termino: string = ""
  rol: string = ""
  roles: Rol[] = []
  //formulario: FormGroup

  usuarioVigia?: InfoSistemaVigia

  nombre: string = ""
  apellido: string = ''
  identificacion: string = ''
  fechaNacimiento: string = ''
  correo: string = ''
  telefono: string | null = ''
  idRol?: number
  check:boolean = false

  deshabilitado: boolean = false
  aplicativos:Aplicativos[] = []
  aplicativosSelect:{aplicativoId?:number,estado?:boolean}[] = []
  errorForm: string = ""
  esVigilado: boolean = false
  esProveedor: boolean = false
  errorCorreo: boolean = false

  /* cargo: string = ""
  departamentos: Departamento[] = []
  municipios: Ciudad[] = [] */

  constructor(
    private servicio: ServicioUsuarios
  ){
    this.paginador = new Paginador<FiltrosUsuarios>(this.obtenerUsuarios)
  }

  ngOnInit(): void {
    this.paginador.inicializar(1, 5)
    this.obtenerRoles()
    this.obtenerAplicativos()
  }

  obtenerUsuarios = (pagina: number, limite: number, filtros?: FiltrosUsuarios)=>{
    return new Observable<Paginacion>( subscripcion => {
      this.servicio.listar(pagina, limite, filtros).subscribe({
        next: (respuesta)=>{
          this.usuarios = respuesta.usuarios
          subscripcion.next(respuesta.paginacion)
        }
      })
    })
  }

  manejarUsuarioActualizado(){
    this.paginador.refrescar()
    Swal.fire({titleText:'Usuario actualizado con éxito.',icon:'success'})
  }

  validar(event:Event,input:string) {
    const selectElement = event.target as HTMLSelectElement
    const dato = selectElement.value
    if(input == 'identificacion' && dato === ''){this.errorForm = input}
    else if(input == 'nombre' && dato === ''){this.errorForm = input}
    else if(input == 'correo' && dato === ''){this.errorForm = input}
    else if(input == 'rol' && dato === ''){this.errorForm = input}
    else{this.errorForm = ''}
  }
  validarRol(event:Event){
    const selectElement = event.target as HTMLSelectElement
    const rolId = Number(selectElement.value)
    this.esVigilado = (rolId === 3)
    this.esProveedor = (rolId === 5)
    console.log(this.esVigilado)
  }
  validarSoloNumeros(event:KeyboardEvent){
    onlyNumberKey(event)
  }
  validarEmail(){
    this.errorCorreo = validateEmail(this.correo)
  }

  crear(){
    if(!this.identificacion || !this.idRol || !this.nombre || !this.correo){
      //alert('Por favor, complete todos los campos obligatorios.');
      Swal.fire({
        titleText: 'Por favor, complete todos los campos obligatorios.',
        icon: 'warning'
      })
      return
    }else if(this.esVigilado){
      if(this.aplicativosSelect.length === 0){
        //alert('Por favor, selecciona al menos un aplicativo.');
        Swal.fire({
          titleText: 'Debe asignar al Vigilado al menos un módulo.',
          icon: 'warning'
        })
        return
      }
    }
    const usuarioJSON = {
      nombre: this.nombre,
      identificacion: this.identificacion,
      telefono: this.telefono,
      correo: this.correo,
      idRol: this.idRol,
      aplicativos:this.aplicativosSelect
    }
    //console.log(usuarioJSON)
    this.servicio.guardar(usuarioJSON).subscribe({
      next: ()=>{
        //this.popup.abrirPopupExitoso("Usuario creado con éxito.")
        Swal.fire({titleText:'Usuario creado con éxito.',icon:'success'})
        this.limpiarFormulario()
        this.paginador.refrescar()
      },
      error: ()=>{
        this.popup.abrirPopupFallido("Error al crear el usuario", "Intentalo más tarde.")
      }
    })
  }

  actualizarFiltros(){
    this.paginador.filtrar({
      termino: this.termino,
      rol: this.rol
    })
  }

  limpiarFiltros(){
    this.termino = ""
    this.rol = ""
    this.paginador.filtrar({})
  }

  limpiarFormulario(){
    this.deshabilitado = false
    this.identificacion = ''
    this.nombre = ''
    this.correo = ''
    this.idRol = undefined
    this.aplicativos.forEach(app => app.estado = false); console.log(this.aplicativos)
    this.esVigilado = false
    this.aplicativosSelect = []
    console.log(this.aplicativos)
  }

  abrirModalActualizarUsuario(usuario: Usuario){
    this.modalActualizarUsuario.abrir(usuario)
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
        //console.log(this.aplicativos[0])
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
  }

  llenarFormulario(event:any){
    if(this.identificacion){
      this.servicio.obtenerInformacionSistemaVigia(this.identificacion).subscribe({
        next: (respuesta) => {
          if(respuesta.numeroDocumento === this.identificacion){
            this.deshabilitado = true
            this.nombre = respuesta.razonSocial
            this.telefono = respuesta.telefono
            this.correo = respuesta.correoPrincipalNotificacion
          }else{
            this.deshabilitado = false
            this.nombre = ''
            this.telefono = ''
            this.correo = ''
          }
        },
        error: (error) => {
        }
      })
    }else{
      this.limpiarFormulario()
    }
  }

  /* obtenerDepartamentos(){
    this.servicioDepartamento.obtenerDepartamentos().subscribe({
      next: (departamentos)=>{
        this.departamentos = departamentos
      }
    })
  }

  obtenerMunicipios(departamentoId: number){
    this.servicioDepartamento.obtenerCiudades(departamentoId).subscribe({
      next: (municipios)=>{
        this.municipios = municipios
      }
    })
  } */

}
