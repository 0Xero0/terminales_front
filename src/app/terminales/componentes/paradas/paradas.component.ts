import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Paradas } from '../../modelos/paradas';

@Component({
  selector: 'app-paradas',
  templateUrl: './paradas.component.html',
  styleUrls: ['./paradas.component.css']
})
export class ParadasComponent implements OnInit {
  @Output() hayCambios: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() paradasGuardar: EventEmitter<Array<Paradas>> = new EventEmitter<Array<Paradas>>();

  paradas:Array<Paradas> = []

  tipoLlegada: Array<{ id: number, nombre: string }> = []
  direcciones: Array<{ id: number, nombre: string }> = []
  departamentos: Array<{ id: number, nombre: string }> = []
  municipios: Array<{ id: number, nombre: string }> = []
  centrosPoblados: Array<{ id: number, nombre: string }> = []

  constructor(){}

  ngOnInit(): void {
    this.listarParadas(); // Inicializamos con un registro vacío
    this.maestraTipoLlegadas();
    this.maestraDepartamentos()
  }

  listarParadas() { //listamos las rutas que vienen de base de datos
    const nuevaParada: Paradas = {
      numero: '001',
      departamento: null,
      municipio: null,
      centroPoblado: null,
      tipoLlegada: null,
      direccion: null
    };
    this.paradas.push(nuevaParada);
  }

  maestraDepartamentos(){
    this.departamentos = [
      { id: 1, nombre: 'Córdoba' },
      { id: 2, nombre: 'Atlantico' },
      { id: 3, nombre: 'Sucre' },
      { id: 4, nombre: 'Bolivar' },
    ]
  }

  maestraMunicipios(id_departamento:any, index:any){
    console.log(id_departamento,index)
    if (id_departamento !== 'null') {
      if (id_departamento === '1') {
        this.municipios = [
          { id: 1, nombre: 'Montería' },
          { id: 2, nombre: 'Tierralta' },
          { id: 3, nombre: 'Valencia' },
        ]
      } else if (id_departamento === '2') {
        this.municipios = [
          { id: 1, nombre: 'Barranquilla' },
          { id: 2, nombre: 'Soledad' },
          { id: 3, nombre: 'Galapa' },
        ]
      }
      else if (id_departamento === '3') {
        this.municipios = [
          { id: 1, nombre: 'Sincelejo' },
          { id: 2, nombre: 'Corozal' },
          { id: 3, nombre: 'Obeja' },
        ]
      } else if (id_departamento === '4') {
        this.municipios = [
          { id: 1, nombre: 'Cartagena' },
          { id: 2, nombre: 'Magangué' },
          { id: 3, nombre: 'Turbaco' },
        ]
      }
      this.paradas[index].departamento = id_departamento
      console.log(this.paradas)
    } else {
      this.paradas[index].departamento = null
    }
    this.manejarCambios()
  }

  maestraCentrosPoblados(){}

  maestraTipoLlegadas() {
    this.tipoLlegada = [
      { id: 1, nombre: 'Terminal' },
      { id: 2, nombre: 'infraestructura de acenso/ descenso' },
      { id: 3, nombre: 'sitio /lugar acenso/ descenso empresa' },
      { id: 4, nombre: 'paraderos' },
    ]
  }

  maestraDireccion(id: any, index?: any) {
    //console.log(id, index, id !== 'null')
    if (id !== 'null') {
      const idLlegada = id
      if (idLlegada === '1') {
        this.direcciones = [
          { id: 1, nombre: 'Dirección 1.1' },
          { id: 2, nombre: 'Dirección 1.2' },
          { id: 3, nombre: 'Dirección 1.3' },
        ]
      } else if (idLlegada === '2') {
        this.direcciones = [
          { id: 1, nombre: 'Dirección 2.1' },
          { id: 2, nombre: 'Dirección 2.2' },
          { id: 3, nombre: 'Dirección 2.3' },
        ]
      }
      else if (idLlegada === '3') {
        this.direcciones = [
          { id: 1, nombre: 'Dirección 3.1' },
          { id: 2, nombre: 'Dirección 3.2' },
          { id: 3, nombre: 'Dirección 3.3' },
        ]
      } else if (idLlegada === '4') {
        this.direcciones = [
          { id: 1, nombre: 'Dirección 4.1' },
          { id: 2, nombre: 'Dirección 4.2' },
          { id: 3, nombre: 'Dirección 4.3' },
        ]
      }
      this.paradas[index].tipoLlegada = idLlegada
      //console.log(this.rutas)
    } else {
      this.paradas[index].tipoLlegada = null
    }
    this.manejarCambios()
  }

  manejarCambios() {
    this.hayCambios.emit(true)
    this.paradasGuardar.emit(this.paradas)
  }
}
