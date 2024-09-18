import { Component, HostListener, OnInit, Output } from '@angular/core';
import { Aplicativos } from './modelos/aplicativos';
import Swal from 'sweetalert2';
import { ServicioApp } from '../app.service';
import { Router } from '@angular/router';
import { ServicioProveedores } from '../proveedores-tecnologicos/servicios/proveedores.service';

@Component({
  selector: 'app-aplicativos',
  templateUrl: './aplicativos.component.html',
  styleUrls: ['./aplicativos.component.css']
})
export class AplicativosComponent implements OnInit{
  aplicativos: Array<Aplicativos> = []
  token: string | null
  rol: any
  estadoProveedor = ''

  proveedores = [{
    descripcion: "Seguimiento a proveedor tecnólogico.",
    documentacion: [{link:''}],
    estado: "pendiente",
    id: 4,
    ruta: "/modulo-proveedor",
    titulo:"PROVEEDORES"
  }]

  constructor(private servicioApp:ServicioApp,private router: Router, private servicioProveedores: ServicioProveedores){
    this.token = localStorage.getItem('tokenVigia');
    this.rol = JSON.parse(localStorage.getItem('rolVigia')!);
    const aplicativosJSON = localStorage.getItem('aplicativos')
    /* console.log(aplicativosJSON) */
    if(!aplicativosJSON){return ;}
    try{
      const aplicativosParseados = JSON.parse(aplicativosJSON);
      // Asegúrate de que los datos parseados sean un array
      if (!Array.isArray(aplicativosParseados)) {
        throw new Error('Datos inválidos en localStorage');
      }else{
        this.aplicativos = aplicativosParseados
      }
    }catch (error){
      console.error('Error al parsear los aplicativos del localStorage:', error);
    return ;
    }
  }
  ngOnInit(): void {
    console.log(this.rol.id)
    this.servicioProveedores.estadoProveedores().subscribe({
      next: (respuesta:any) => {
        this.estadoProveedor = respuesta.estado
      }
    })
  }

  obtenerEstadoProveedor(){
    this.servicioProveedores.estadoProveedores().subscribe({
      next: (respuesta:any) => {
        console.log(respuesta)
      }
    })
  }

  documentacion(link:string){
    if(link){
      window.open(link)
    }else{
      Swal.fire({
        title: 'No hay documentación'
      })
    }
  }

  /* verificarRol(rol:string | number):boolean{
    return rol === 5;
  } */

  redirigir(ruta:string, nombreVentana:string){
    /* if(nombreVentana === 'PROVEEDORES'){
      window.location.href = ''
      return
    } */
    // URL que se va a abrir
    const rutaCompleta = ruta+`?token=${this.token}`
    window.location.href = rutaCompleta

  }
}
