import { Component, DoCheck, EventEmitter, OnInit, Output } from '@angular/core';
import { TitleStrategy } from '@angular/router';
import { ServicioCabeceraService } from '../../servicios/servicio-cabecera.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { ServicioLocalStorage } from '../../servicios/local-storage.service';

@Component({
  selector: 'app-barra-navegacion',
  templateUrl: './barra-navegacion.component.html',
  styleUrls: ['./barra-navegacion.component.css']
})
export class BarraNavegacionComponent implements OnInit {
  @Output() usuarioQuiereCerrarSesion:EventEmitter<void>
  @Output() menuLateralDesplegado:EventEmitter<void>
  usuario?: Usuario | null;
  public roles: any;
  public nombre: string = '';
  public cabeceraModulo: string[] = [];
  public menuOpcionesDeUsuarioColapsado = true;
  public readonly llaveRolesLocalStorage = 'rolTerminales'
  public readonly llaveUsuarioLocalStorage = 'UsuarioTerminales'

  inicioSesion: boolean = false
  inicioVigia2: boolean = false

  constructor(private servicioCabecera: ServicioCabeceraService, private servicioLocalStorage: ServicioLocalStorage,) {
    this.usuarioQuiereCerrarSesion = new EventEmitter<void>()
    this.menuLateralDesplegado = new EventEmitter<void>()
    this.servicioCabecera.suscribirseACambioDeTitulo().subscribe(cabeceraModulo =>{
      this.cabeceraModulo = cabeceraModulo;
    })
  }

  ngOnInit(): void {
    const inicioSesion = JSON.parse(localStorage.getItem('inicio-sesion') || 'false');
    if(inicioSesion){this.inicioSesion = inicioSesion}
    const inicioVigia2 = JSON.parse(localStorage.getItem('inicio-vigia2') || 'false');
    if(inicioVigia2){this.inicioVigia2 = inicioVigia2}

    this.usuario = this.servicioLocalStorage.obtenerUsuario()
    this.roles = JSON.parse(localStorage.getItem(this.llaveRolesLocalStorage)!)
    const Usuario = JSON.parse(localStorage.getItem(this.llaveUsuarioLocalStorage)!)
    this.nombre = `${Usuario.nombre} ${Usuario.apellido}`
  }

  public abrirMenuLateral(){
    this.menuLateralDesplegado.emit()
  }

  public cerrarSesion(){
    localStorage.removeItem('rutasRevisadas');
    this.usuarioQuiereCerrarSesion.emit()
  }
}
