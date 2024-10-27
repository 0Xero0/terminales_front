import { Component, Input, OnInit, Output } from '@angular/core';
import { Ruta } from '../modelos/ruta';
import { Paradas } from '../modelos/paradas';
import { Clases } from '../modelos/clases';
import { Usuario } from 'src/app/usuarios/modelos/Usuario';
import { TerminalesService } from '../servicios/terminales.service';
import { ReplaySubject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-terminales',
  templateUrl: './terminales.component.html',
  styleUrls: ['./terminales.component.css']
})
export class TerminalesComponent implements OnInit {
  hayCambios: boolean = false
  verificacionVisible: boolean = false
  verificacionEditable: boolean = false
  editable: boolean = true
  aprobado: boolean = false

  usuario: Usuario
  cantidadRutas: any

  rutas: Array<Ruta> = []
  paradas: Array<Paradas> = []
  clases: Array<Clases> = []

  selectedValue: any
  inputValue: any
  opciones: Array<any> = [{ codigo: 1, nombre: 'opción 1' }, { codigo: 2, nombre: 'opción 2' }]

  constructor(private servicioTerminales: TerminalesService) {
    this.usuario = JSON.parse(localStorage.getItem('UsuarioVigia')!)
  }

  ngOnInit() {
    this.obtenerCantidadRutas(this.usuario!.id)
    //console.log(this.usuario)
  }
  obtenerCantidadRutas(idUsuario: any) {
    this.servicioTerminales.cantidadRutas(idUsuario).subscribe({
      next: (respuesta: any) => {
        console.log(respuesta)
        if (respuesta.message) { this.cantidadRutas = 'No se pudo obtener un total de las rutas registradas.' }
        else { this.cantidadRutas = respuesta }

      }
    })
  }

  recibirHayCambios(hayCambios: boolean) {
    this.hayCambios = hayCambios
  }

  recibirRutas(rutas: Ruta[]) {
    this.rutas = rutas
    console.log('Rutas: ', this.rutas)
  }

  recibirParada(paradas: any) {
    this.paradas = paradas
    //console.log('Paradas: ', this.paradas)
  }

  recibirClases(clases: any) {
    this.clases = clases
    //console.log('Clases: ', this.clases)
  }

  guardar() {
    let JSONTerminales:{Rutas:Array<any>} = {Rutas:[]}
    let JSONRutas: Array<any> = []
    for (let ruta of this.rutas) {
      JSONRutas.push({
        id: ruta.id,
        idRuta: ruta.id_ruta,
        idUnicoRuta: ruta.id_unico_ruta,
        centroPobladoOrigen: ruta.cp_origen_codigo,
        centroPobladoDestino: ruta.cp_destino_codigo,
        tipoLLegada: ruta.tipo_llegada_id,
        direccion: ruta.direccion_id,
        via: ruta.via,
        rutaHabilitada: ruta.estado,
        corresponde: ruta.corresponde,
        resolucionActual: ruta.resolucion_actual,
        direccionTerritorial: ruta.direccion_territorial,
        documento: ruta.documento,
        nombreOriginal: ruta.nombre_original,
        rutaArchivo: ruta.ruta_archivo

      })
    }
    JSONTerminales = {Rutas:JSONRutas}
    console.log(JSONTerminales)
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });
    Swal.showLoading(null);
    this.servicioTerminales.guardar(JSONTerminales).subscribe({
      next: (respuesta:any) => {
        Swal.fire({ icon: 'success', titleText: '¡Guardado exitosamente!' });
        console.log(respuesta)
        this.hayCambios = false
      }
    })
  }

  enviarST() { }

  volver() {

  }
}
