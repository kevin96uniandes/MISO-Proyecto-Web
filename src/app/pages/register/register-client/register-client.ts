export class RegisterClient {
  nombre_empresa: String;
  email: String;
  tipo_identificacion: Number;
  numero_identificacion: Number;
  sector: String;
  telefono: Number;
  pais: String;
  usuario: String;
  contrasena: String;
  confirmar_contrasena: String;

  constructor(
    nombre_empresa: String,
    email: String,
    tipo_identificacion: Number,
    numero_identificacion: Number,
    sector: String,
    telefono: Number,
    pais: String,
    usuario: String,
    contrasena: String,
    confirmar_contrasena: String
  ){
    this.nombre_empresa = nombre_empresa;
    this.email = email;
    this.tipo_identificacion = tipo_identificacion;
    this.numero_identificacion = numero_identificacion;
    this.sector = sector;
    this.telefono = telefono;
    this.pais = pais;
    this.usuario = usuario;
    this.contrasena = contrasena;
    this.confirmar_contrasena = confirmar_contrasena;
  }
}
