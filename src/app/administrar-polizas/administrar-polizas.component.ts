import { Component, OnInit} from '@angular/core';
import { ServicioAdministrarPolizas } from './servicios/administrar-polizas.service';

@Component({
  selector: 'app-administrar-polizas',
  templateUrl: './administrar-polizas.component.html',
  styleUrls: ['./administrar-polizas.component.css']
})
export class AdministrarPolizasComponent implements OnInit{
  titulo: string = "SISI/POLIZA"

  constructor(
    private servicioAdministrarPoliza: ServicioAdministrarPolizas,
  ){
    
  }
  ngOnInit(): void {
    //this.obtenerModalidades()
  }
}
