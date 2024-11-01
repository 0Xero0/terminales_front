import { Component, Input, OnInit, Output } from '@angular/core';
import { Ruta } from '../modelos/ruta';
import { Paradas } from '../modelos/paradas';
import { Clases } from '../modelos/clases';
import { Usuario } from 'src/app/usuarios/modelos/Usuario';
import { TerminalesService } from '../servicios/terminales.service';
import { ReplaySubject } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { RutasComponent } from './rutas/rutas.component';

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
  todoGuardado: boolean = false

  usuario: Usuario
  cantidadRutas: any

  rutas: Array<Ruta> = []
  paradas: Array<Paradas> = []
  clases: Array<Clases> = []
  faltantes: Array<number> = []

  constructor(private servicioTerminales: TerminalesService) {
    this.usuario = JSON.parse(localStorage.getItem('UsuarioVigia')!)
  }

  ngOnInit() { }

  recibirNumeroRutas(numeroRutas: number) {
    this.cantidadRutas = numeroRutas
  }

  recibirHayCambios(hayCambios: boolean) {
    this.hayCambios = hayCambios
  }

  recibirRutas(rutas: Ruta[]) {
    this.rutas = rutas
    //console.log('Rutas: ', this.rutas)
  }

  recibirParada(paradas: any) {
    this.paradas = paradas
    //console.log('Paradas: ', this.paradas)
  }

  recibirClases(clases: any) {
    this.clases = clases
    //console.log('Clases: ', this.clases)
  }

  recivirVerificacionVisible(verificacionVisible: boolean) {
    this.verificacionVisible = verificacionVisible
  }

  recivirVerificacionEditable(verificacionEditable: boolean) {
    this.verificacionEditable = verificacionEditable
  }

  recibirEditable(editable: boolean) {
    this.editable = editable
  }

  guardar() {
    let JSONTerminales: {
      Rutas: Array<any>, Paradas: Array<any>, Clases: Array<any>
    } = {
      Rutas: [], Paradas: [], Clases: []
    }
    let JSONRutas: Array<any> = []
    let JSONParadas: Array<any> = []
    let JSONClases: Array<any> = []
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
    if (this.paradas.length > 0) {
      for (let parada of this.paradas) {
        JSONParadas.push({
          idParada: parada.parada_id,
          idRuta: parada.ruta_id,
          centroPobladoId: parada.codigo_cp,
          direccionId: parada.direccion_id,
          estado: true
        })
      }
    }
    if (this.clases.length > 0) {
      for (let clase of this.clases) {
        JSONClases.push({
          id: clase.id_ruta_vehiculos,
          idRuta: clase.ruta_id,
          idClaseVehiculo: clase.tipo_vehiculo_id,
          estado: clase.estado
        })
      }
    }
    JSONTerminales = { Rutas: JSONRutas, Paradas: JSONParadas, Clases: JSONClases }
    //console.log(JSONTerminales)
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });
    Swal.showLoading(null);
    this.servicioTerminales.guardar(JSONTerminales).subscribe({
      next: (respuesta: any) => {
        Swal.fire({ icon: 'success', titleText: '¡Guardado exitosamente!' });
        //console.log(respuesta)
        this.hayCambios = false
        this.todoGuardado = !this.todoGuardado
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == 400) {
          Swal.fire('¡Fallo al guardar!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
        } else {
          Swal.fire('¡Error desconocido!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
        }
      }
    })
  }

  enviarST() {
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });
    Swal.showLoading(null);
    this.servicioTerminales.enviarST().subscribe({
      next: (respuesta: any) => {
        this.faltantes = respuesta.faltantes
        this.todoGuardado = respuesta.aprobado

        if (this.faltantes.length <= 0) {
          Swal.fire('¡Envio exitoso!', 'Enviado a la Superintendencia de transporte.', 'success');
        }
        else {
          Swal.fire('¡Errores encontrados!', 'Por favor, corrija antes de vlver a enviar.', 'error');
          for (let ruta of this.rutas) {
            if (this.faltantes?.includes(ruta.id)) ruta.errorRutas = true
            //console.log(ruta.errorRutas)
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == 400) {
          Swal.fire('¡Fallo al enviar a ST!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
        } else {
          Swal.fire('¡Error desconocido!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
        }
      }
    })
  }

  volver() {

  }
}
