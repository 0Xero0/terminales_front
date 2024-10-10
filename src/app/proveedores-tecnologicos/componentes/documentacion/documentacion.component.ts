import { Component, OnInit } from '@angular/core';
import { ArchivoGuardado } from 'src/app/archivos/modelos/ArchivoGuardado';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import Swal from 'sweetalert2';
import { ServicioProveedores } from '../../servicios/proveedores.service';
import { Aplicativos } from '../../modelos/Aplicativos';
import { Formulario } from '../../modelos/Formulario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documentacion',
  templateUrl: './documentacion.component.html',
  styleUrls: ['./documentacion.component.css']
})
export class DocumentacionComponent implements OnInit {

  hayCambios: boolean = false
  usuario?:{usuario:string,nombre:string};rol?:{id:number,nombre:string}
  editable:boolean = true
  aplicativos:Aplicativos[] = []
  aplicativosSelect:{aplicativoId?:number,estado?:boolean}[] = []

  formulario:Formulario[] = []
  faltantes:Array<number> = []

  solicitud:any
  solicitudId:any
  verificacionEditable:boolean = true
  verificacionVisible:boolean = false
  respuestasVerificador:{id:number, corresponde?:number | null, observacion?:string}[] = []
  aprobado: boolean = false
  faltantesVerificador:Array<number> = []

  corresponde = [
    {id:1,nombre:'Si'},
    {id:2,nombre:'No'}
  ]
  verificador:boolean = true

  backupObservacion:string = ''
  tamanoMaximoMb: number = 5

  constructor(private servicioArchivos: ServicioArchivos, private servicioProveedores: ServicioProveedores, private router: Router){}

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('UsuarioVigia')!)
    this.solicitud = JSON.parse(localStorage.getItem('solicitud')!);console.log(this.solicitud)
    this.solicitudId = JSON.parse(localStorage.getItem('solicitudId')!);console.log(this.solicitudId)
    this.rol = JSON.parse(localStorage.getItem('rolVigia')!);console.log(this.rol)
    if(this.solicitud){
      this.iniciarVerificacion()
      this.obtenerAplicativos(this.solicitud.aplicativos)
    }else{
      this.obtenerFormulario()
      this.obtenerAplicativos()
    }

  }

  iniciarVerificacion(){
    this.editable = this.solicitud.editable
    this.verificacionEditable = this.solicitud.verificacionEditable
    this.verificacionVisible = this.solicitud.verificacionVisible
    this.formulario = this.solicitud.preguntas
    for(let preguntas of this.solicitud.preguntas){
      this.respuestasVerificador.push({id:preguntas.id,corresponde:preguntas.corresponde,observacion:preguntas.observacion})
    }
    /* console.log('Respuestas', this.respuestasVerificador)
    console.log('Preguntas: ',this.formulario) */
  }

  obtenerFormulario(){
    this.servicioProveedores.mostrarFormulario().subscribe({
      next: (form:any) => {
        this.formulario = form.preguntas
        this.aplicativosSelect = form.aplicativos
        this.editable = form.editable
        this.verificacionVisible = form.verificacionVisible
        this.verificacionEditable = form.verificacionEditable
        this.aplicativosSelect.forEach((app1:any) => {
          const aplicativo = this.aplicativos.find(app2 => app2.id === app1.aplicativoId)
          if(aplicativo){aplicativo.estado = app1.estado}
        });
      }
    })
  }

  obtenerAplicativos(estadoAplicativos?:Array<any>){
    this.servicioProveedores.maestraAplicativos().subscribe({
      next: (respuesta:any) => {
        this.aplicativos = respuesta
        if(estadoAplicativos){
          this.aplicativos.forEach(app => {
            let estado = estadoAplicativos.find(e => e.aplicativoId === app.id)?.estado;
            //console.log(estado)
            if (estado !== undefined) {
              app.estado = estado;
            }
          });
          //console.log(this.aplicativos)
        }
        //console.log(estadoAplicativos)
      }
    })
  }

  aplicativosSeleccionados(event:any,id?:any){
    this.hayCambios = true
    const estado = event.target.checked;
    for (let aplicativo of this.aplicativosSelect) {
      if (aplicativo.aplicativoId === id) {
        aplicativo.estado = estado;
        break;
      }
    }
  }

  guardar(){
    this.hayCambios = false
    const respuestas:{id:number,ruta:string,nombre:string,nombreOriginal:string}[] = []
    const aplicativos:{aplicativoId:number,estado:boolean}[] = []
    for(let respuesta of this.formulario){
      respuestas.push({id:respuesta.id, ruta:respuesta.ruta, nombre:respuesta.nombre, nombreOriginal:respuesta.nombreOriginal})
    }
    for(let aplicativo of this.aplicativosSelect){
      aplicativos.push({aplicativoId:aplicativo.aplicativoId!, estado:aplicativo.estado!})
    }
    const JSONrespuestas = {
      respuestas,
      aplicativos
    }
    //console.log(JSONrespuestas)
    this.servicioProveedores.guardarDocumentacion(JSONrespuestas).subscribe({
      next: (respuesta:any) => {
        this.obtenerFormulario();
        this.faltantes = []
      }
    })
  }

  enviar(){
    this.servicioProveedores.enviarST().subscribe({
      next: (respuesta:any) => {
        this.faltantes = respuesta.faltantes
        //console.log(this.faltantes)
        if(this.faltantes.length > 0){
          Swal.fire({title:'¡Faltan documentos por adjuntar!', icon:'warning'})
        }else{
          Swal.fire({title:'¡Documentos enviados exitosamente!', icon:'success'});
          this.obtenerFormulario();
        }
      }
    })
  }
  marcarFaltante(idPregunta:number, tipo:number):boolean{
    if(tipo === 1){return this.faltantes.includes(idPregunta) && !this.formulario[idPregunta-1].nombre}
    if(tipo === 2){
      return this.faltantesVerificador.includes(idPregunta) &&
      !this.respuestasVerificador[idPregunta-1].corresponde && !this.respuestasVerificador[idPregunta-1].observacion
    }
    return false;
  }

  guardarArchivo(event:any,codigo:string){
    this.hayCambios = true
    if(event){
      Swal.fire({
        icon: 'info',
        allowOutsideClick: false,
        text: 'Espere por favor...',
      });
      Swal.showLoading(null);
      console.log(this.tamanoValido(event.target.files[0]))
      if(this.tamanoValido(event.target.files[0])){
        this.servicioArchivos.guardarArchivo(event.target.files[0], 'terminales', this.usuario?.usuario!).subscribe({
          next: (archivo:any)=>{
            Swal.close()
            for(let i = 0;i < this.formulario.length;i++){
              if(this.formulario[i].codigo === codigo){
                this.formulario[i].nombre = archivo.nombreAlmacenado
                this.formulario[i].nombreOriginal = archivo.nombreOriginalArchivo
                this.formulario[i].ruta = archivo.ruta
                break;
              }
            }
          }
        })
      }else{
        Swal.fire({icon: 'error', titleText: '¡Error alcargar el archivo!',text:'El tamaño máximo del archivo debe ser de hasta 5Mb.'});
      }
    }
  }
  descargarArchivo(nombreOriginal:string,nombre:string, ruta:string){
    //console.log(nombre, ruta)
    this.servicioArchivos.descargarArchivo(nombre, ruta, nombreOriginal)
  }

  manejarCorresponde(event:Event, id:number){
    this.hayCambios = true
    const selectElement = event?.target as HTMLSelectElement;
    const selectedValue = Number(selectElement.value);
    const textareaElement = document.getElementById(id + '-textarea') as HTMLTextAreaElement;
    const respuesta = this.respuestasVerificador.find(item => item.id === Number(id))
    const pregunta = this.formulario.find(item => item.id === Number(id))

    //console.log(selectedValue,id)
    if(selectedValue === 1 || selectedValue === null || Number.isNaN(selectedValue)){
      textareaElement.disabled = true; textareaElement.value = ''
      if(respuesta){respuesta.observacion = ''}
      if(Number.isNaN(selectedValue) || selectedValue === null){
        if(pregunta){pregunta.corresponde = null}
        if(respuesta){respuesta.corresponde = null}
      }
    }
    else if(selectedValue === 2){textareaElement.disabled = false;}

    if(selectedValue){
      if(respuesta){respuesta.corresponde = selectedValue}
      if(pregunta){pregunta.corresponde = selectedValue}
    }


    if(this.respuestasVerificador[id-1].corresponde){
      const index = this.faltantesVerificador.indexOf(id);
      if(index !== -1){
        this.faltantesVerificador.splice(index, 1);
      }
    }else{}

    /* console.log('Respuestas del verificador: ',this.respuestasVerificador)
    console.log('Pregunta: ',this.formulario) */
  }

  manejarObservacion(event:Event, id:number){
    this.hayCambios = true
    const textareaElement = event?.target as HTMLSelectElement;
    const textareaValue = textareaElement.value

    const item = this.respuestasVerificador.find(respuesta => respuesta.id === Number(id))
    if(item){
      item.observacion = textareaValue
    }
    //console.log(this.respuestasVerificador)
  }

  guardarVerificacion(){
    if (this.validarRespuestas(this.respuestasVerificador)) {
      this.servicioProveedores.guardarRespuestasVerificador(this.solicitudId,this.respuestasVerificador).subscribe({
        next: (respuesta) => {
          if(respuesta){localStorage.setItem('solicitud',JSON.stringify(respuesta))}
          this.hayCambios = false
          this.solicitud = respuesta
          this.respuestasVerificador = []
          this.iniciarVerificacion()
          this.modal()
          //console.log(this.solicitud)
        }
      })
    }else{
      // Mostrar advertencia si la validación falla
      Swal.fire({
        title: 'Advertencia',
        text: 'Si el documento verificado NO corresponde, debe llenar el campo de observación.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'my-swal-popup',  // Clase personalizada para el modal
          //content: 'my-swal-content'  Clase personalizada para el contenido
        }
      });
    }

  }

  enviarVerificacion(){
    this.servicioProveedores.enviarSTVerificador(this.solicitudId).subscribe({
      next: (respuesta) => {
        this.aprobado = respuesta.aprobado
        this.faltantesVerificador = respuesta.faltantes
        //console.log(this.aprobado,this.faltantes)
        if(this.faltantes.length > 0){
          Swal.fire({title:'¡Faltan documentos por adjuntar!', icon:'warning'})
        }else{
          Swal.fire({title:'¡Documentos enviados exitosamente!', icon:'success'});
          this.iniciarVerificacion()
        }
      }
    })
  }

  manejarRemoverArchivo(input:HTMLInputElement,event:any,codigo?:string){
    input.value = ''
    this.hayCambios = true
    event.preventDefault();
    this.removeFile(codigo)
  }

  removeFile(codigo?:string){
    for(let i = 0;i < this.formulario.length;i++){
      if(this.formulario[i].codigo === codigo){
        this.formulario[i].nombre = ''
        this.formulario[i].nombreOriginal = ''
        this.formulario[i].ruta = ''
        break;
      }
    }
  }

  modal(){
    Swal.fire({
      title: 'Confirmación',
      text: 'Operación realizada con éxito.',
      icon: 'success',  // El icono 'success' viene en color verde por defecto
      position: 'bottom',  // Coloca la alerta en la parte inferior
      showConfirmButton: false,  // Oculta el botón de confirmación
      timer: 3000,  // La alerta desaparecerá después de 3 segundos
      background: '#d4edda',  // Color de fondo verde claro
      toast: true,  // Modo toast, hace que la alerta sea más pequeña y similar a un mensaje emergente
      customClass: {
        popup: 'custom-toast',  // Clase CSS personalizada
      }
    });
  }

  validarRespuestas(respuestas: {id: number, corresponde?: number | null, observacion?: string}[]): boolean {
    for (let respuesta of respuestas) {
      if (respuesta.corresponde === 2 && (!respuesta.observacion || respuesta.observacion.trim() === '')) {
        // Si corresponde es 2 y observacion está vacía o es solo espacios en blanco
        return false;
      }
    }
    return true;
  }

  volver(){
    const ruta = '/listado-solicitudes'
    this.router.navigateByUrl(`/administrar${ruta}`)
  }

  private tamanoValido(archivo: File): boolean{
    if(this.tamanoMaximoMb){
      return this.tamanoMaximoMb * 1048576 >= archivo.size ? true : false
    }else{
      return true
    }
  }
}
