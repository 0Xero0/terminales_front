export function validarCampos(obj: any): boolean {
  // Verificamos que todos los valores del objeto sean distintos de null, undefined y no estén vacíos
  return Object.values(obj).every(value => value !== null && value !== undefined && value !== '' && value !== 0);
}

export function validarCampos2(obj: any): boolean {
  if (Array.isArray(obj)) {
    // Si es un arreglo, verificamos que cada elemento pase la validación
    return obj.every(item => validarCampos(item));
  } else if (obj !== null && typeof obj === 'object') {
    // Si es un objeto, validamos cada valor recursivamente
    return Object.values(obj).every(value => validarCampos(value));
  } else {
    // Verificamos valores primitivos
    return obj !== null && obj !== undefined && obj !== '';
  }
}
