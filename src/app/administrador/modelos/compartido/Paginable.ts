import { Paginacion } from "./Paginacion"

export interface Paginable<T>{
    datos: T[]
    paginacion: Paginacion
}