import { Observable } from "rxjs"
import { Paginacion } from "./Paginacion"

export class Paginador<T>{
    public readonly opcionesLimiteRegistros = [ 5, 10, 15, 20, 30 ]
    private readonly limitePorDefecto = 5
    private readonly paginaActualPorDefecto = 1
    private _totalRegistros?: number
    private _pagina: number
    private _totalPaginas?: number
    private _limite: number
    private _filtros?: T
    private _funcionObtenerRecursos: (pagina: number, limite: number, filtros?: T) => Observable<Paginacion>

    constructor(funcionObtenerRecursos: (pagina: number, limite: number, filtros?: T)=> Observable<Paginacion>) {
        this._limite = this.limitePorDefecto
        this._pagina = this.paginaActualPorDefecto
        this._funcionObtenerRecursos = funcionObtenerRecursos
    }

    inicializar(
        pagina:number = this.paginaActualPorDefecto, 
        limite: number = this.limitePorDefecto, 
        filtros?: T
    ){
        this._pagina = pagina
        this._limite = limite
        this._filtros = filtros
        this._funcionObtenerRecursos(pagina, limite, filtros).subscribe({
            next: (paginacion) => {
                this.cambiarTotales(paginacion)
            }
        })
    }

    cambiarLimitePorPagina(nuevoLimite: number){
        this._limite = nuevoLimite;
        if(!this._pagina){
            throw Error('No se ha establecido una pagina actual');
        }
        this._funcionObtenerRecursos(this.pagina, nuevoLimite, this._filtros).subscribe({
            next: (paginacion) => {
                this.cambiarTotales(paginacion)
            }
        })
    }

    cambiarPagina(pagina: number){
        this._pagina = pagina
        this._funcionObtenerRecursos(pagina, this._limite, this._filtros).subscribe({
            next: (paginacion) => {
                this.cambiarTotales(paginacion)
            }
        })
    }

    filtrar(filtros?: T){
        this._filtros = filtros
        this._funcionObtenerRecursos(this._pagina, this._limite, this._filtros).subscribe({
            next: (paginacion) => {
                this.cambiarTotales(paginacion)
            }
        })
    }

    refrescar(){
        this._funcionObtenerRecursos(this._pagina, this._limite, this._filtros).subscribe({
            next: ()=>{}
        })
    }

    private cambiarTotales(paginacion: Paginacion){
        this._totalRegistros = paginacion.totalRegistros
        this._totalPaginas = paginacion.totalPaginas
    }

    public get totalRegistros(){
        return this._totalRegistros
    }
    public get totalPaginas(){
        return this._totalPaginas
    }
    public get pagina(){
        return this._pagina
    }
    public get limite(){
        return this._limite
    }
}