export class RegisterAgent {
  nombres: String;
  apellidos: String;
  correo_electronico: String;
  tipo_identificacion: Number;
  numero_identificacion: Number;
  telefono: Number;
  usuario: String;
  contrasena: String;
  confirmar_contrasena: String;
  id_empresa: String;

  constructor(
    nombres: String,
    apellidos: String,
    correo_electronico: String,
    tipo_identificacion: Number,
    numero_identificacion: Number,
    telefono: Number,
    usuario: String,
    contrasena: String,
    confirmar_contrasena: String,
    id_empresa: String
  ){
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.correo_electronico = correo_electronico;
    this.tipo_identificacion = tipo_identificacion;
    this.numero_identificacion = numero_identificacion;
    this.telefono = telefono;
    this.usuario = usuario;
    this.contrasena = contrasena;
    this.confirmar_contrasena = confirmar_contrasena;
    this.id_empresa = id_empresa
  }
}
