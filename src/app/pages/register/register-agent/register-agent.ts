export class RegisterAgent {
  nombre_completo: String;
  correo_electronico: String;
  tipo_identificacion: Number;
  numero_identificacion: Number;
  telefono: Number;
  usuario: String;
  contrasena: String;
  confirmar_contrasena: String;

  constructor(
    nombre_completo: String,
    correo_electronico: String,
    tipo_identificacion: Number,
    numero_identificacion: Number,
    telefono: Number,
    usuario: String,
    contrasena: String,
    confirmar_contrasena: String
  ){
    this.nombre_completo = nombre_completo;
    this.correo_electronico = correo_electronico;
    this.tipo_identificacion = tipo_identificacion;
    this.numero_identificacion = numero_identificacion;
    this.telefono = telefono;
    this.usuario = usuario;
    this.contrasena = contrasena;
    this.confirmar_contrasena = confirmar_contrasena;
  }
}
