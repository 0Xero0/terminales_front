import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';
import { map } from 'rxjs';
import { ServicioUsuarios} from '../administrador/servicios/usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionGuard implements CanActivate {
  public readonly llaveToken = 'jwtVigia'
  public readonly llaveExpiracion = 'expira'

  public constructor(private enrutador:Router, private servicioUsuario: ServicioUsuarios ){}

  async canActivate(): Promise<boolean>{
    const fechaUnixActual = new Date().getTime()
    let token = localStorage.getItem(this.llaveToken)
    let expiracion = localStorage.getItem(this.llaveExpiracion)

    if(!token){
      this.enrutador.navigateByUrl('/inicio-sesion')
      return false
    }
/*     if(!expiracion){
      this.enrutador.navigateByUrl('/inicio-sesion')
      return false
    }
    if(fechaUnixActual >= parseInt(expiracion)){
      console.log('fecha actual', fechaUnixActual, 'fecha expira', parseInt(expiracion))
      console.log('jwt expirado')
      this.enrutador.navigateByUrl('/inicio-sesion')
      return false;
    } */

    return true;
  }

}
