import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class InterceptorAutorizacion implements HttpInterceptor {
    constructor(private enrutador:Router){}
    
    intercept(peticion: HttpRequest<any>, siguiente: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('jwtVigia');
        const peticionClonada = peticion.clone()
        if (!token) {
            return siguiente.handle(peticionClonada);
        }
        return siguiente.handle(peticionClonada).pipe(
            catchError(error=>{
                if(error instanceof(HttpErrorResponse)){
                    if(error.status === 401){
                        this.enrutador.navigateByUrl('/inicio-sesion')
                    }
                }
                return throwError(error)
            })
        )
    }
}