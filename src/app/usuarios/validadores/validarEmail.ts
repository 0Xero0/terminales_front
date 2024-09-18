export function validateEmail(correo: string): boolean {
  if(!correo){return false}
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailPattern.test(correo)) {
    return true
  } else {
    return false
  }
  return false
}
