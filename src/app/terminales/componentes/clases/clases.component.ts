import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Clases } from '../../modelos/clases';
import Swal from 'sweetalert2';
import { TerminalesService } from '../../servicios/terminales.service';
import { validarCampos } from '../../validadores/validar-campos';

@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.css']
})
export class ClasesComponent implements OnInit, OnChanges {
  @Output() hayCambios: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clasesGuardar: EventEmitter<Array<Clases>> = new EventEmitter<Array<Clases>>();
  @Input() rutaId?: any
  @Input() verificacionVisible?: boolean
  @Input() verificacionEditable?: boolean
  @Input() editable?: boolean
  @Input() aprobado?: boolean
  clases: Array<Clases> = []
  nuevaClase: Clases
  claseNuevaHabilitada: boolean = false

  error: boolean = false

  tiposVehiculos: Array<{ descripcion: string | null, id: number | null, idClasePorGrupo: number | null }> = []
  grupos: Array<{ id: number | null, descripcion: string | null }> = []

  pageClases: number = 1

  constructor(private servicioTerminales: TerminalesService) {
    this.nuevaClase = this.inicializarClaseNueva()
  }

  ngOnInit(): void {
    this.maestraGrupos()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rutaId']) {
      this.clases = []
      this.listarClases();
      //console.log('El array ha cambiado:', this.paradas);
    }
  }

  inicializarClaseNueva(): Clases { //Inicializa vacio los parametros de la ruta nueva
    return {
      clase_id: null,
      tipo_vehiculo_id: null,
      estado: null,
      clase: null
    };
  }
  listarClases() {
    this.servicioTerminales.listarClases(this.rutaId).subscribe({
      next: (respuesta) => {
        this.clases = respuesta.clases
        for (let clase of this.clases) {
          clase.ruta_id = this.rutaId
        }
        this.maestrasClases()
        this.clasesGuardar.emit(this.clases)
        //console.log(this.clases)
      }
    })
  }

  ///////////// MAESTRAS //////////////////////////////////////////////////////////////////////////////////
  maestrasClases() { // Consulta las maestras que corresponda llenar en la lista de Clases
    if (this.clases.length > 0) {
      for (let i = 0; i < this.clases.length; i++) {
        this.maestraTipoVehiculo(this.clases[i].clase_id, i)
      }
    }
  }

  maestraGrupos() {
    this.servicioTerminales.maestraGrupos().subscribe({
      next: (respuesta: any) => {
        this.grupos = respuesta.respuestaclasesPorGrupos
      }
    })
  }

  maestraTipoVehiculo(idGrupo: any, index?: any, cambio?: boolean) {
    if (index !== undefined) {
      this.servicioTerminales.maestraTiposVehiculos(idGrupo).subscribe({
        next: (respuesta: any) => {
          this.clases[index].tipoVehiculo = []
          this.clases[index].tipoVehiculo = respuesta.respuestaTiposvehiculos
          if (cambio) {
            this.clases[index].tipo_vehiculo_id = null
            this.manejarCambios()
          }
        }
      })
    } else {
      this.servicioTerminales.maestraTiposVehiculos(idGrupo).subscribe({
        next: (respuesta: any) => {
          this.tiposVehiculos = []; this.nuevaClase.tipo_vehiculo_id = null
          this.tiposVehiculos = respuesta.respuestaTiposvehiculos
        }
      })
    }

  }

  ///////////// ACCIONES //////////////////////////////////////////////////////////////////////////////////
  estadoAgregarClase(estado: boolean) {
    this.claseNuevaHabilitada = estado
    this.nuevaClase = this.inicializarClaseNueva()
    if (!estado) this.error = estado
  }

  agregarNuevaClase() {
    const JSONClaseNueva = {
      idRuta: this.rutaId,
      idClaseVehiculo: this.nuevaClase.tipo_vehiculo_id,
      estado: this.nuevaClase.estado
    }
    if (validarCampos(JSONClaseNueva)) {
      this.servicioTerminales.crearClase(JSONClaseNueva).subscribe({
        next: (respuesta: any) => {
          //console.log('JSONParadaNueva: ', JSONClaseNueva)
          //console.log('respuesta: ', respuesta)
          Swal.fire('¡Clase crada!', 'La nueva clase ha sido añadida.', 'success');
          this.listarClases()
          this.nuevaClase = this.inicializarClaseNueva()
          this.estadoAgregarClase(false)
          this.manejarCambios()
        }
      })
    } else {
      this.error = true
      Swal.fire('¡Información incompleta!', 'Por favor, completa la información de la nueva parada antes de agregarla.', 'error');
    }
  }

  manejarTipoVehiculo(tipo_vehiculo_id:any, index?:any){
    if(index !== undefined){
      this.clases[index].tipo_vehiculo_id = tipo_vehiculo_id
      this.manejarCambios()
    }
  }

  manejarEstado(index?: any) {
    if (index !== undefined) {
      if(this.clases[index].estado === 'true') this.clases[index].estado = true
      else if(this.clases[index].estado === 'false') this.clases[index].estado = false
      else  this.clases[index].estado = null
      this.manejarCambios()
    } else {
      if (this.nuevaClase.estado === 'true') this.nuevaClase.estado = true
      else if (this.nuevaClase.estado === 'false') this.nuevaClase.estado = false
      else this.nuevaClase.estado = null
    }

  }

  manejarCambios() {
    this.hayCambios.emit(true)
    console.log(this.clases)
    //this.clasesGuardar.emit(this.clases)
  }
}
