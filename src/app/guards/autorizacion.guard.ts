import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutorizacionGuard implements CanActivate {
  public readonly llaveRolesLocalStorage = 'rolVigia'
  constructor(private enrutador: Router) {
  }
  async canActivate(siguiente: ActivatedRouteSnapshot, estado: RouterStateSnapshot): Promise<boolean>{
    let rol = JSON.parse(localStorage.getItem(this.llaveRolesLocalStorage)!)
    for (let modulos of rol._modulos) {
      if (`/administrar${modulos._ruta}` === estado.url) {
        return true
      }
    }
    this.enrutador.navigateByUrl('/inicio-sesion')
    return false;
  }

}
