import { Component } from '@angular/core';
import { Ruta } from '../../modelos/ruta';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import { TerminalesService } from '../../servicios/terminales.service';

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.component.html',
  styleUrls: ['./rutas.component.css']
})
export class RutasComponent {

  verificacionVisibles: boolean = false
  desplegado: boolean = true
  resolucionCorresponde: boolean = false

  rutas: Ruta[] = [];
  rutaSeleccionada: number | null = null;  // Índice de la ruta seleccionada
  rutaConsultada: boolean = false

  tipoLlegada: Array<{id:number,nombre:string}> = []
  direcciones: Array<{id:number,nombre:string}> = []

  constructor(private servicioArchivos: ServicioArchivos, private servicioTerminales: TerminalesService) {}

  ngOnInit(): void {
    this.agregarRuta(); // Inicializamos con un registro vacío
    this.maestraTipoLlegadas();
  }

  consultarInformacionRuta(id_ruta: string | number) {this.rutaConsultada = true}

  //Maestras
  maestraTipoLlegadas(){
    this.tipoLlegada = [
      {id:1, nombre:'Terminal'},
      {id:2, nombre:'infraestructura de acenso/ descenso'},
      {id:3, nombre:'sitio /lugar acenso/ descenso empresa'},
      {id:4, nombre:'paraderos'},
    ]
  }

  maestraDireccion(id:any, index:any){
    console.log(id)
    if(id !== 'null'){
      const idLlegada = Number(id)
      if(idLlegada === 1){
        this.direcciones = [
          {id:1, nombre:'Dirección 1.1'},
          {id:2, nombre:'Dirección 1.2'},
          {id:3, nombre:'Dirección 1.3'},
        ]
      }else if(idLlegada === 2){
        this.direcciones = [
          {id:1, nombre:'Dirección 2.1'},
          {id:2, nombre:'Dirección 2.2'},
          {id:3, nombre:'Dirección 2.3'},
        ]
      }
      else if(idLlegada === 3){
        this.direcciones = [
          {id:1, nombre:'Dirección 3.1'},
          {id:2, nombre:'Dirección 3.2'},
          {id:3, nombre:'Dirección 3.3'},
        ]
      }else if(idLlegada === 4){
        this.direcciones = [
          {id:1, nombre:'Dirección 4.1'},
          {id:2, nombre:'Dirección 4.2'},
          {id:3, nombre:'Dirección 4.3'},
        ]
      }
      this.rutas[index].tipo_llegada = idLlegada
      console.log(this.rutas)
    }else{
      this.rutas[index].tipo_llegada = null
    }
  }

  //Acciones
  seleccionarRuta(ruta: Ruta, index: number) {
    // Verificamos si es el mismo registro que ya está seleccionado
    if (this.rutaSeleccionada === index) return;

    // Marcar el registro actual como seleccionado
    this.rutaSeleccionada = index;

    // Consultar la información en la base de datos
    this.consultarInformacionRuta(ruta.id_ruta);
  }

  agregarRuta() {
    const nuevoRuta:Ruta = {
      id_ruta: '001',
      departamento_origen: 'Cundinamarca',
      municipio_origen: 'Bogotá',
      departamento_destino: 'Antioquia',
      municipio_destino: 'Medellín',
      tipo_llegada: null,
      direccion: null,
      via: 'Cartago',
      ruta_activa: null,
      n_resolucion_bd: 156,
      resolucion_corresponde: null,
      n_resolucion_actual: null,
      pdf: null
    };
    this.rutas.push(nuevoRuta);
  }

  eliminarRuta(index: number) {
    this.rutas.splice(index, 1);
  }

  direccion(idDireccion:any,index:any){
    if(idDireccion === 'null'){
      this.rutas[index].direccion = null
    }else {
      this.rutas[index].direccion = Number(idDireccion)
    }
    console.log(this.rutas)
  }

  corresponde(idCorresponde:any,index:any){
    if(idCorresponde === 'null'){
      this.rutas[index].resolucion_corresponde = null
    }else {
      this.rutas[index].resolucion_corresponde = Number(idCorresponde)
    }
    console.log(this.rutas)
  }

  activa(idActiva:any,index:any){
    if(idActiva === 'null'){
      this.rutas[index].ruta_activa = null
    }else {
      this.rutas[index].ruta_activa = Number(idActiva)
    }
    console.log(this.rutas)
  }

  alternarDesplegar(){
    this.desplegado = !this.desplegado
  }
}
