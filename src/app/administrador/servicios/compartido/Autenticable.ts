import { HttpHeaders } from "@angular/common/http";

export class Autenticable {
    public readonly llaveTokenLocalStorage = 'jwtVigia'
    public constructor(){}

    public obtenerTokenAutorizacion():string{
        const token = localStorage.getItem(this.llaveTokenLocalStorage)
        if(token) return token;
        else throw new Error("No se encontró el token de autorización en el localStorage");
    }

    public obtenerCabeceraAutorizacion(): HttpHeaders{
        return new HttpHeaders({
            'Authorization': `Bearer ${this.obtenerTokenAutorizacion()}`
        })
    }
}
