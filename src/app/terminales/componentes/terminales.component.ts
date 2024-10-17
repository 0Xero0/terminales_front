import { Component, Input, OnInit, Output } from '@angular/core';
import { Ruta } from '../modelos/ruta';
import { Paradas } from '../modelos/paradas';
import { Clases } from '../modelos/clases';
import { Usuario } from 'src/app/usuarios/modelos/Usuario';
import { TerminalesService } from '../servicios/terminales.service';

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
    if (this.rutas.length < 0) {
      // Convertimos array1 a un mapa para facilitar la búsqueda por id
      const arrayRutasMap = new Map(this.rutas.map(item => [item.id_ruta, item]));
      // Iteramos sobre array2 para comparar y actualizar/agregar en array1
      rutas.forEach((item2:Ruta) => {
        const item1 = arrayRutasMap.get(item2.id_ruta);

        if (item1) {
          // Si el item ya existe en array1 (se encontró por id), lo actualizamos
          Object.assign(item1, item2);
        } else {
          // Si no existe, lo agregamos al array1
          this.rutas.push(item2);
        }
      });
    }
    console.log('Rutas: ', this.rutas)
  }

  recibirParada(paradas: any) {
    this.paradas = paradas
    console.log('Paradas: ', this.paradas)
  }

  recibirClases(clases: any) {
    this.clases = clases
    //console.log('Clases: ', this.clases)
  }

  guardar() { }

  enviarST() { }

  volver() {

  }
}
