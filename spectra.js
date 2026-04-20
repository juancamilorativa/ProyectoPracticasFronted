let token = localStorage.getItem("token");

/* =========================
   MENSAJES
========================= */
function mostrarMensaje(msg, tipo = "ok") {
 alert((tipo === "error" ? "❌ " : "✅ ") + msg);
}

/* =========================
   ELEMENTOS
========================= */
const loginDiv = document.getElementById("login");
const panelAdmin = document.getElementById("panelAdmin");
const panelTecnico = document.getElementById("panelTecnico");

const user = document.getElementById("user");
const pass = document.getElementById("pass");

// ADMIN
const tecnicosSec = document.getElementById("tecnicosSec");
const proyectosSec = document.getElementById("proyectosSec");
const informesSec = document.getElementById("informesSec");

const nuevoTecnico = document.getElementById("nuevoTecnico");
const listaTecnicos = document.getElementById("listaTecnicos");

const numeroProyecto = document.getElementById("numeroProyecto");
const nombreSitio = document.getElementById("nombreSitio");
const listaProyectos = document.getElementById("listaProyectos");

// TECNICO
const proyecto = document.getElementById("proyecto");
const sitio = document.getElementById("sitio");
const fecha = document.getElementById("fecha");
const personas = document.getElementById("personas");
const descripcion = document.getElementById("descripcion");
const fotos = document.getElementById("fotos");
const listaInformes = document.getElementById("listaInformes");

/* =========================
   LOGIN
========================= */
function login() {

 if (!user.value || !pass.value) {
  return mostrarMensaje("Completa usuario y contraseña", "error");
 }

 fetch(`${API_URL}/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
   user: user.value,
   pass: pass.value
  })
 })
 .then(r => {
  if (!r.ok) throw new Error();
  return r.json();
 })
 .then(data => {

  token = data.token;

  localStorage.setItem("token", token);
  localStorage.setItem("role", data.role);

  iniciarApp(data.role);

 })
 .catch(() => mostrarMensaje("Credenciales incorrectas", "error"));
}

/* =========================
   INICIAR APP
========================= */
function iniciarApp(role) {

 loginDiv.classList.add("hidden");

 if (role === "admin") {
  panelAdmin.classList.remove("hidden");
  mostrarTecnicos();
  mostrarProyectos();
 } else {
  panelTecnico.classList.remove("hidden");
  mostrarInformes();
 }
}

/* =========================
   AUTO LOGIN
========================= */
window.onload = () => {
 const role = localStorage.getItem("role");
 if (token && role) {
  iniciarApp(role);
 }
};

/* =========================
   AUTH HEADER
========================= */
function authHeader() {
 return {
  "Authorization": "Bearer " + token
 };
}

/* =========================
   SECCIONES
========================= */
function mostrarSeccion(sec) {

 tecnicosSec.classList.add("hidden");
 proyectosSec.classList.add("hidden");
 informesSec.classList.add("hidden");

 if (sec === "tecnicos") tecnicosSec.classList.remove("hidden");
 if (sec === "proyectos") proyectosSec.classList.remove("hidden");
 if (sec === "informes") informesSec.classList.remove("hidden");
}

/* =========================
   TECNICOS
========================= */
function agregarTecnico() {

 if (!nuevoTecnico.value.trim()) {
  return mostrarMensaje("Ingresa el nombre del técnico", "error");
 }

 fetch(`${API_URL}/tecnicos`, {
  method: "POST",
  headers: {
   "Content-Type": "application/json",
   ...authHeader()
  },
  body: JSON.stringify({
   nombre: nuevoTecnico.value
  })
 })
 .then(r => r.json())
 .then(() => {
  mostrarMensaje("Técnico agregado");
  nuevoTecnico.value = "";
  mostrarTecnicos();
 });

}

function mostrarTecnicos() {
 fetch(`${API_URL}/tecnicos`, {
  headers: authHeader()
 })
 .then(r => r.json())
 .then(data => {
  listaTecnicos.innerHTML = "";

  if (data.length === 0) {
   listaTecnicos.innerHTML = "No hay técnicos registrados";
   return;
  }

  data.forEach(t => {
   listaTecnicos.innerHTML += `<div>${t.nombre}</div>`;
  });
 });
}

/* =========================
   PROYECTOS
========================= */
function agregarProyecto() {

 if (!numeroProyecto.value.trim() || !nombreSitio.value.trim()) {
  return mostrarMensaje("Completa todos los campos del proyecto", "error");
 }

 fetch(`${API_URL}/proyectos`, {
  method: "POST",
  headers: {
   "Content-Type": "application/json",
   ...authHeader()
  },
  body: JSON.stringify({
   numero: numeroProyecto.value,
   sitio: nombreSitio.value
  })
 })
 .then(r => r.json())
 .then(() => {
  mostrarMensaje("Proyecto agregado");
  numeroProyecto.value = "";
  nombreSitio.value = "";
  mostrarProyectos();
 });

}

function mostrarProyectos() {
 fetch(`${API_URL}/proyectos`, {
  headers: authHeader()
 })
 .then(r => r.json())
 .then(data => {
  listaProyectos.innerHTML = "";

  if (data.length === 0) {
   listaProyectos.innerHTML = "No hay proyectos registrados";
   return;
  }

  data.forEach(p => {
   listaProyectos.innerHTML += `<div>${p.numero} - ${p.sitio}</div>`;
  });
 });
}

/* =========================
   INFORMES
========================= */
function guardarInforme() {

 if (!proyecto.value) {
  return mostrarMensaje("Selecciona un proyecto", "error");
 }

 if (!fecha.value) {
  return mostrarMensaje("Selecciona una fecha", "error");
 }

 if (!descripcion.value.trim()) {
  return mostrarMensaje("Escribe una descripción", "error");
 }

 if (fotos.files.length === 0) {
  return mostrarMensaje("Debes subir al menos una foto", "error");
 }

 let fd = new FormData();

 fd.append("proyecto", proyecto.value);
 fd.append("sitio", sitio.value);
 fd.append("fecha", fecha.value);
 fd.append("descripcion", descripcion.value);

 for (let f of fotos.files) {
  fd.append("fotos", f);
 }

 fetch(`${API_URL}/informes`, {
  method: "POST",
  headers: {
   "Authorization": "Bearer " + token
  },
  body: fd
 })
 .then(r => r.json())
 .then(() => {
  mostrarMensaje("Informe guardado correctamente");
  mostrarInformes();
 });

}

function mostrarInformes() {
 fetch(`${API_URL}/informes`, {
  headers: authHeader()
 })
 .then(r => r.json())
 .then(data => {
  listaInformes.innerHTML = "";

  if (data.length === 0) {
   listaInformes.innerHTML = "No hay informes aún";
   return;
  }

  data.forEach(i => {
   listaInformes.innerHTML += `<div>${i.sitio} - ${i.fecha}</div>`;
  });
 });
}

/* =========================
   LOGOUT
========================= */
function logout() {
 localStorage.clear();
 location.reload();
}
