import { DateTime } from "luxon";

export function formatearFechaIso(fechaIso: string, formato: string){
    return DateTime.fromISO(fechaIso).toFormat(formato)
}