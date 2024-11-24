import { Component, Input, OnInit, Output } from '@angular/core';
import { Faltantes, Ruta, Ruta2 } from '../modelos/ruta';
import { Paradas } from '../modelos/paradas';
import { Clases } from '../modelos/clases';
import { TerminalesService } from '../servicios/terminales.service';
import { ReplaySubject } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { RutasComponent } from './rutas/rutas.component';
import { Rol } from 'src/app/autenticacion/modelos/Rol';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';

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

  usuario: Usuario | null
  rol: Rol | null
  cantidadRutas: any

  rutas: Array<Ruta2> = []
  paradas: Array<Paradas> = []
  clases: Array<Clases> = []
  faltantes: Array<Faltantes> = []

  constructor(private servicioTerminales: TerminalesService, servicioLocalStorage: ServicioLocalStorage) {
    this.usuario = servicioLocalStorage.obtenerUsuario()
    this.rol = servicioLocalStorage.obtenerRol()
  }

  ngOnInit() { }

  recibirNumeroRutas(numeroRutas: number) {
    this.cantidadRutas = numeroRutas
  }

  recibirHayCambios(hayCambios: boolean) {
    this.hayCambios = hayCambios
    console.log(hayCambios)
  }

  recibirRutas(rutas: Ruta2[]) {
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

  enviarST() {
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });
    Swal.showLoading(null);
    this.servicioTerminales.enviarST(this.usuario?.id).subscribe({
      next: (respuesta: any) => {
        this.faltantes = respuesta.faltantes
        this.todoGuardado = respuesta.aprobado
        localStorage.removeItem('rutasRevisadas'); // Elimina solo la clave "rutasRevisadas"
        if (this.faltantes.length <= 0) {
          Swal.fire('¡Envio exitoso!', 'Enviado a la Superintendencia de transporte.', 'success');
        }
        else {
          Swal.fire('¡Errores encontrados!', 'Por favor, corrija antes de volver a enviar.', 'error');
          for (let ruta of this.rutas) {
            if (this.faltantes.some((faltante:Faltantes) => ruta.idRuta === faltante.idRuta)) ruta.errorRutas = true
            //console.log(ruta.errorRutas)
          }
          this.mostrarFaltantes(this.faltantes, this.rutas)
          //console.log(this.rutas);

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

  mostrarFaltantes(faltantes: any[], rutas: Ruta2[]) {
    // Crear una tabla HTML con los datos de las rutas faltantes
    let tablaHTML = `
      <div style="padding: 30px;">
        <table style="width: 100%; border-collapse: collapse; box-shadow: 0px 3px 6px #00000029;">
          <thead style="background: #e6effd 0% 0% no-repeat padding-box; color: #004884; font-weight: 600;">
            <tr>
              <th style="border: 1px solid transparent; padding: 10px;">Ruta</th>
              <th style="border: 1px solid transparent; padding: 10px;">Falta información en la ruta</th>
              <th style="border: 1px solid transparent; padding: 10px;">Falta agregar via</th>
              <th style="border: 1px solid transparent; padding: 10px;">Falta agregar clase</th>
            </tr>
          </thead>
          <tbody>
    `;

    // Recorrer los datos para llenar las filas de la tabla
    for (const registro of faltantes) {
      const ruta = rutas.find((r: any) => r.idRuta === registro.idRuta);
      const indice = ruta?.index || 'N/A'; // Obtener el índice desde el arreglo de rutas
      tablaHTML += `
        <tr>
          <td style="border: 1px solid transparent;border-bottom: 2px solid #dee2e6; padding: 5px; text-align: center;">${indice}</td>
          <td style="border: 1px solid transparent;border-bottom: 2px solid #dee2e6; padding: 5px; text-align: center;">${registro.rutasFaltantes ? 'Sí' : 'No'}</td>
          <td style="border: 1px solid transparent;border-bottom: 2px solid #dee2e6; padding: 5px; text-align: center;">${registro.viasFaltantes ? 'Sí' : 'No'}</td>
          <td style="border: 1px solid transparent;border-bottom: 2px solid #dee2e6; padding: 5px; text-align: center;">${registro.clasesFaltantes ? 'Sí' : 'No'}</td>
        </tr>
      `;
    }

    tablaHTML += '</tbody></table></div>';

    // Mostrar el modal con la tabla
    Swal.fire({
      title: 'Información faltante encontrada',
      html: tablaHTML,
      width: '90%',
      confirmButtonText: 'Cerrar',
    });
  }

  volver() {

  }
}
