export function fechaValida(event: any){

  const fecha = new Date();
  const fechaActual = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;

  if(fechaActual > event.target.value){
    console.log(fechaActual," > ",event.target.value);
    return false
  }else{
    return true
  }
}
