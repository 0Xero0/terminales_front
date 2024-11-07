import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Clases } from '../../modelos/clases';
import Swal from 'sweetalert2';
import { TerminalesService } from '../../servicios/terminales.service';
import { validarCampos } from '../../validadores/validar-campos';
import { Ruta } from '../../modelos/ruta';

@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.css']
})
export class ClasesComponent implements OnInit, OnChanges {
  @Output() hayCambios: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clasesGuardar: EventEmitter<Array<Clases>> = new EventEmitter<Array<Clases>>();
  @Input() rutaId?: any
  @Input() verificacionVisible: boolean = false
  @Input() verificacionEditable?: boolean
  @Input() editable: boolean = false
  @Input() aprobado?: boolean
  @Input() ruta?:Ruta
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
        this.maestraTipoVehiculo(this.clases[i].clase_id, i,undefined,this.clases[i].id_ruta_vehiculos)
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

  maestraTipoVehiculo(idGrupo: any, index?: any, cambio?: boolean, claseId?:any) {
    if (index !== undefined) {
      if(idGrupo !== 'null' || idGrupo !== null){
        this.servicioTerminales.maestraTiposVehiculos(idGrupo).subscribe({
          next: (respuesta: any) => {
            for(let clase of this.clases){
              if(clase.id_ruta_vehiculos == claseId){
                clase.tipoVehiculo = []
                if(respuesta.respuestaTiposvehiculos.length > 0){
                  clase.tipoVehiculo = respuesta.respuestaTiposvehiculos
                }else{ clase.tipo_vehiculo_id = null}
                if(cambio){
                  clase.tipo_vehiculo_id = null
                  this.manejarCambios()
                }
              }
            }
          }
        })
      }
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
      Swal.fire({
        titleText: "¿Está seguro que quiere agregar una clase nueva?",
        text: "Después de agregar una clase nueva, no podrá eliminarla.",
        confirmButtonText: "Agregar",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.servicioTerminales.crearClase(JSONClaseNueva).subscribe({
            next: (respuesta: any) => {
              this.listarClases()
              this.nuevaClase = this.inicializarClaseNueva()
              this.estadoAgregarClase(false)
              this.manejarCambios()
              Swal.fire('¡Clase crada!', 'La nueva clase ha sido añadida.', 'success');
            }
          })
        } else if (result.isDismissed) {
          Swal.close()
        }
      })
    } else {
      this.error = true
      Swal.fire('¡Información incompleta!', 'Por favor, completa la información de la nueva parada antes de agregarla.', 'error');
    }
  }

  manejarTipoVehiculo(tipo_vehiculo_id:any, index?:any, clase?:Clases){
    if(index !== undefined && clase){
      clase.tipo_vehiculo_id = tipo_vehiculo_id
      this.manejarCambios()
    }
  }

  manejarEstado(index?: any, clase?:Clases) {
    if (index !== undefined && clase) {
      if(clase.estado === 'true') clase.estado = true
      else if(clase.estado === 'false') clase.estado = false
      else  clase.estado = null
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
