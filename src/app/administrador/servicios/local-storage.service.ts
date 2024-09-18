import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { LlavesLocalStorage } from '../LlavesLocalStorage';
import { Rol } from 'src/app/autenticacion/modelos/Rol';

@Injectable({
    providedIn: 'root'
})
export class ServicioLocalStorage {

    constructor() {}

    obtenerUsuario(): Usuario | null {
        const usuario = localStorage.getItem( LlavesLocalStorage.Usuario ) 
        if(!usuario) return null;
        return JSON.parse(usuario) as Usuario | null;
    }

    obtenerRol(): Rol | null {
        const rol = localStorage.getItem( LlavesLocalStorage.Rol ) 
        if(!rol) return null;
        return JSON.parse(rol) as Rol | null;
    }

    actualizarUsuario(usuario: Usuario): void{
        localStorage.setItem(LlavesLocalStorage.Usuario, JSON.stringify(usuario))
    }
}
