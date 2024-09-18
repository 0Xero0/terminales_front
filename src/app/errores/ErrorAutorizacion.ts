export class ErrorAutorizacion extends Error{
    private static readonly mensaje = 'Error de autorización, porfavor inicia sesión antes de continuar.'
    constructor(){
        super(ErrorAutorizacion.mensaje)
    }
}