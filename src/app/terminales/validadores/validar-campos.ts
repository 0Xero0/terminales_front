export function validarCampos(obj: any): boolean {
  // Verificamos que todos los valores del objeto sean distintos de null, undefined y no estén vacíos
  return Object.values(obj).every(value => value !== null && value !== undefined && value !== '');
}
