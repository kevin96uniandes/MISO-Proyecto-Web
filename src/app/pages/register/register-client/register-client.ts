export class RegisterClient {
  nombre_completo: String;
  email: String;
  tipo_documento: Number;
  numero_documento: Number;
  sector: String;
  telefono: Number;
  pais: String;
  usuario: String;
  contrasena: String;
  confirmar_contrasena: String;

  constructor(
    nombre_completo: String,
    email: String,
    tipo_documento: Number,
    numero_documento: Number,
    sector: String,
    telefono: Number,
    pais: String,
    usuario: String,
    contrasena: String,
    confirmar_contrasena: String
  ){
    this.nombre_completo = nombre_completo;
    this.email = email;
    this.tipo_documento = tipo_documento;
    this.numero_documento = numero_documento;
    this.sector = sector;
    this.telefono = telefono;
    this.pais = pais;
    this.usuario = usuario;
    this.contrasena = contrasena;
    this.confirmar_contrasena = confirmar_contrasena;
  }
}
