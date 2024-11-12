import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacionService } from 'src/app/autenticacion/servicios/autenticacion.service';
import { BarraNavegacionComponent } from '../barra-navegacion/barra-navegacion.component';
import { MenuComponent } from '../menu/menu.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.component.html',
  styleUrls: ['./plantilla.component.css']
})
export class PlantillaComponent implements OnInit {
  @ViewChild('menuLateral') menuLateral!:MenuComponent
  @ViewChild('barraDeNavegacion') barraDeNavegacion!:BarraNavegacionComponent

  inicioSesion: boolean = false
  inicioVigia2: boolean = false

  constructor(private servicioAutenticacion:AutenticacionService, private enrutador:Router) { }

  ngOnInit(): void {
    const inicioSesion = JSON.parse(localStorage.getItem('inicio-sesion') || 'false');
    if(inicioSesion){this.inicioSesion = inicioSesion}
    const inicioVigia2 = JSON.parse(localStorage.getItem('inicio-vigia2') || 'false');
    if(inicioVigia2){this.inicioVigia2 = inicioVigia2}
  }

  cerrarSesion() {

    /* this.servicioAutenticacion.cerrarSesion()
    this.router.navigateByUrl('/inicio-sesion') */
    if(this.inicioVigia2){
      window.location.href = environment.urlVigia2+'/administrar/administrar-aplicativos'
    }else if(this.inicioSesion){
      this.enrutador.navigateByUrl('/inicio-sesion')
    }
  }

  public abrirMenuLateral(){
    this.menuLateral.abrir()
  }
}
