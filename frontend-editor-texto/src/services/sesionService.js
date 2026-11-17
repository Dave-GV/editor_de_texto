// Simulación de autenticación y suscripción, 100% en el navegador (localStorage).
// No existe backend de usuarios: esto solo reproduce el flujo, no una autenticación real.

const CLAVE_CUENTAS = "editor-texto-saas.cuentas";
const CLAVE_SESION_ACTIVA = "editor-texto-saas.sesionActiva";

const LIMITE_DOCUMENTOS_FREE = 3;

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function leerCuentas() {
  const raw = localStorage.getItem(CLAVE_CUENTAS);
  return raw ? JSON.parse(raw) : {};
}

function guardarCuentas(cuentas) {
  localStorage.setItem(CLAVE_CUENTAS, JSON.stringify(cuentas));
}

function leerEmailActivo() {
  return localStorage.getItem(CLAVE_SESION_ACTIVA);
}

function sesionDesde(email) {
  const cuentas = leerCuentas();
  const cuenta = cuentas[email];
  if (!cuenta) return null;
  return { email, nombre: cuenta.nombre, plan: cuenta.plan };
}

export function obtenerSesionActual() {
  const email = leerEmailActivo();
  if (!email) return null;
  return sesionDesde(email);
}

export function limiteDocumentosFree() {
  return LIMITE_DOCUMENTOS_FREE;
}

export async function registrarse(nombre, email, password) {
  await esperar(600);
  const correo = email.trim().toLowerCase();
  if (!nombre.trim() || !correo || !password.trim()) {
    throw new Error("Completa nombre, correo y contraseña.");
  }
  const cuentas = leerCuentas();
  if (cuentas[correo]) {
    throw new Error("Ya existe una cuenta con ese correo. Inicia sesión.");
  }
  cuentas[correo] = { nombre: nombre.trim(), password, plan: "FREE" };
  guardarCuentas(cuentas);
  localStorage.setItem(CLAVE_SESION_ACTIVA, correo);
  return sesionDesde(correo);
}

export async function iniciarSesion(email, password) {
  await esperar(600);
  const correo = email.trim().toLowerCase();
  const cuentas = leerCuentas();
  const cuenta = cuentas[correo];
  if (!cuenta) {
    throw new Error("No existe una cuenta con ese correo. Regístrate primero.");
  }
  if (cuenta.password !== password) {
    throw new Error("Contraseña incorrecta.");
  }
  localStorage.setItem(CLAVE_SESION_ACTIVA, correo);
  return sesionDesde(correo);
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION_ACTIVA);
}

export async function actualizarAPro() {
  await esperar(900);
  const email = leerEmailActivo();
  if (!email) throw new Error("No hay sesión activa.");
  const cuentas = leerCuentas();
  cuentas[email].plan = "PRO";
  guardarCuentas(cuentas);
  return sesionDesde(email);
}

export async function cancelarSuscripcion() {
  await esperar(500);
  const email = leerEmailActivo();
  if (!email) throw new Error("No hay sesión activa.");
  const cuentas = leerCuentas();
  cuentas[email].plan = "FREE";
  guardarCuentas(cuentas);
  return sesionDesde(email);
}
