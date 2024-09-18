
export function tamanioValido(archivo: File, tamanioMaximoMb: number){
  const tm  = tamanioMaximoMb * 1048576
  if(archivo.size > tm){
    return true
  }else{
    return false
  }
}
