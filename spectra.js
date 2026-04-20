let token = localStorage.getItem("token");

/* =========================
   MENSAJES
========================= */
function msg(texto, error = false) {
 alert((error ? "❌ " : "✅ ") + texto);
}

/* =========================
   AUTH
========================= */
function auth() {
 return {
  "Authorization": "Bearer " + localStorage.getItem("token")
 };
}

/* =========================
   ELEMENTOS
========================= */
const loginDiv = document.getElementById("login");
const panelAdmin = document.getElementById("panelAdmin");
const panelTecnico = document.getElementById("panelTecnico");

const user = document.getElementById("user");
const pass = document.getElementById("pass");

const tecnicosSec = document.getElementById("tecnicosSec");
const proyectosSec = document.getElementById("proyectosSec");
const informesSec = document.getElementById("informesSec");

const nuevoTecnico = document.getElementById("nuevoTecnico");
const listaTecnicos = document.getElementById("listaTecnicos");

const numeroProyecto = document.getElementById("numeroProyecto");
const nombreSitio = document.getElementById("nombreSitio");
const listaProyectos = document.getElementById("listaProyectos");

const proyecto = document.getElementById("proyecto");
const sitio = document.getElementById("sitio");
const fecha = document.getElementById("fecha");
const descripcion = document.getElementById("descripcion");
const fotos = document.getElementById("fotos");
const listaInformes = document.getElementById("listaInformes");

/* =========================
   LOGIN
========================= */
function login() {

 if (!user.value || !pass.value)
  return msg("Completa usuario y contraseña", true);

 fetch(`${API_URL}/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ user: user.value, pass: pass.value })
 })
 .then(async r => {
  const d = await r.json();
  if (!d.ok) throw new Error(d.error);
  return d.data;
 })
 .then(d => {
  localStorage.setItem("token", d.token);
  localStorage.setItem("role", d.role);
  iniciarApp(d.role);
 })
 .catch(e => msg(e.message, true));
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
  cargarProyectosSelect();
  mostrarInformes();
 }
}

/* =========================
   AUTO LOGIN
========================= */
window.onload = () => {
 const role = localStorage.getItem("role");
 if (token && role) iniciarApp(role);
};

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

 if (!nuevoTecnico.value.trim())
  return msg("Nombre requerido", true);

 fetch(`${API_URL}/tecnicos`, {
  method: "POST",
  headers: { "Content-Type": "application/json", ...auth() },
  body: JSON.stringify({ nombre: nuevoTecnico.value })
 })
 .then(async r => {
  const d = await r.json();
  if (!d.ok) throw new Error(d.error);
 })
 .then(() => {
  msg("Técnico agregado");
  nuevoTecnico.value = "";
  mostrarTecnicos();
 })
 .catch(e => msg(e.message, true));
}

function mostrarTecnicos() {
 fetch(`${API_URL}/tecnicos`, { headers: auth() })
 .then(r => r.json())
 .then(d => {
  listaTecnicos.innerHTML = "";
  if (!d.data.length) return listaTecnicos.innerHTML = "Sin técnicos";
  d.data.forEach(t => {
   listaTecnicos.innerHTML += `<div>${t.nombre}</div>`;
  });
 });
}

/* =========================
   PROYECTOS
========================= */
function agregarProyecto() {

 if (!numeroProyecto.value || !nombreSitio.value)
  return msg("Completa campos", true);

 fetch(`${API_URL}/proyectos`, {
  method: "POST",
  headers: { "Content-Type": "application/json", ...auth() },
  body: JSON.stringify({
   numero: numeroProyecto.value,
   sitio: nombreSitio.value
  })
 })
 .then(async r => {
  const d = await r.json();
  if (!d.ok) throw new Error(d.error);
 })
 .then(() => {
  msg("Proyecto agregado");
  mostrarProyectos();
 })
 .catch(e => msg(e.message, true));
}

function mostrarProyectos() {
 fetch(`${API_URL}/proyectos`, { headers: auth() })
 .then(r => r.json())
 .then(d => {
  listaProyectos.innerHTML = "";
  if (!d.data.length) return listaProyectos.innerHTML = "Sin proyectos";
  d.data.forEach(p => {
   listaProyectos.innerHTML += `<div>${p.numero} - ${p.sitio}</div>`;
  });
 });
}

/* =========================
   SELECT PROYECTOS
========================= */
function cargarProyectosSelect() {
 fetch(`${API_URL}/proyectos`, { headers: auth() })
 .then(r => r.json())
 .then(d => {
  proyecto.innerHTML = "";
  d.data.forEach(p => {
   proyecto.innerHTML += `<option value="${p.numero}">${p.numero}</option>`;
  });
 });
}

/* =========================
   INFORMES
========================= */
function guardarInforme() {

 if (!proyecto.value || !fecha.value || !descripcion.value)
  return msg("Campos incompletos", true);

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
  headers: auth(),
  body: fd
 })
 .then(async r => {
  const d = await r.json();
  if (!d.ok) throw new Error(d.error);
 })
 .then(() => {
  msg("Informe guardado");
  mostrarInformes();
 })
 .catch(e => msg(e.message, true));
}

function mostrarInformes() {
 fetch(`${API_URL}/informes`, { headers: auth() })
 .then(r => r.json())
 .then(d => {
  listaInformes.innerHTML = "";
  if (!d.data.length) return listaInformes.innerHTML = "Sin informes";
  d.data.forEach(i => {
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
