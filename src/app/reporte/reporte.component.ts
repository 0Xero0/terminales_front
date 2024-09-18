import { Component } from '@angular/core';
import { ReportesService } from './servicios/reportes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Reporte } from './modelos/Reporte';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent {
  //formulario: FormGroup
  reporte: Reporte[] = []
  public readonly ESTADOS = [
    {
      id: 1,
      descripcion: 'ABIERTO'
    },/*
    {
      id: 2,
      descripcion: 'EN PROCESO'
    }, */
    {
      id: 3,
      descripcion: 'CERRADO'
    }
  ]

  reportesFiltrados: Reporte[] = [];
  page = 1;
  pageSize = 10;
  buscarRadicado = '';
  estadoSeleccionado: any = 0;
  aplicativos:any
  aplicativoSeleccionado: string | null = null

  constructor(private servicioReportes: ReportesService, private router: Router, private activatedRoute: ActivatedRoute){
    /* this.formulario = this.construirFormulario(); */
    this.obtenerReportes();
    this.obtenerAplicativos()
  }

  obtenerReportes(){
    this.servicioReportes.obtenerReportes().subscribe({
      next: ( resultado )=>{
        this.reporte = resultado
        this.reportesFiltrados = resultado
        this.filtrar()
      },
      error: (error: HttpErrorResponse) => {

      }
    })
  }

  limpiarFiltros(){
    this.buscarRadicado = ''
    this.estadoSeleccionado = 0
    this.aplicativoSeleccionado = null
    this.reportesFiltrados = this.reporte;
    this.page = 1
  }

  filtrar(): void {
    let tempDatos = this.reporte;
    if (this.buscarRadicado) {
      tempDatos = tempDatos.filter(dato =>
        dato.radicado.toLowerCase().includes(this.buscarRadicado.toLowerCase())
      );
      this.page = 1
    }
    if (this.estadoSeleccionado) {
      tempDatos = tempDatos.filter(dato =>
        dato.id_estado === Number(this.estadoSeleccionado)
      );
      this.page = 1
    }
    if(this.aplicativoSeleccionado){
      tempDatos = tempDatos.filter(dato => dato.aplicativo === this.aplicativoSeleccionado)
      this.reportesFiltrados = tempDatos
      this.page = 1
    }
    this.reportesFiltrados = tempDatos;
  }

  filtraPorAplicativo(aplicativo:string){
    this.aplicativoSeleccionado = aplicativo;
    this.filtrar()
  }

  construirFormulario(){
    return new FormGroup({
      termino: new FormControl<string>(""),
      estado: new FormControl<number>(0)
    })
  }

  obtenerDescripcionEstado(id: string | number): any{
    id = typeof id === 'string' ? Number(id) : id;
    const estado = this.ESTADOS.find( estado => estado.id == id)
    return estado ? estado.descripcion : ' - '
  }

  obtenerAplicativos(){
    this.servicioReportes.maestraAplicativos().subscribe({
      next: (respuesta) => {
        this.aplicativos = respuesta
        //console.log(this.aplicativos[0])
      }
    })
  }
}
