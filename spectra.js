const API_URL = "https://proyectopracticas1.onrender.com";

let token = null;

/* =========================
   ELEMENTOS
========================= */
const loginDiv = document.getElementById("login");
const panelAdmin = document.getElementById("panelAdmin");
const panelTecnico = document.getElementById("panelTecnico");

const user = document.getElementById("user");
const pass = document.getElementById("pass");

/* =========================
   LOGIN
========================= */
function login() {

 fetch(`${API_URL}/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
   user: user.value,
   pass: pass.value
  })
 })
 .then(r => {
  if (!r.ok) throw new Error("Login incorrecto");
  return r.json();
 })
 .then(data => {

  token = data.token;

  loginDiv.classList.add("hidden");

  if (data.role === "admin") {
   panelAdmin.classList.remove("hidden");
  } else {
   panelTecnico.classList.remove("hidden");
  }

  localStorage.setItem("token", token);
  localStorage.setItem("role", data.role);

 });

}

/* =========================
   HEADERS AUTH
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
 .then(() => mostrarTecnicos());

}

function mostrarTecnicos() {
 fetch(`${API_URL}/tecnicos`, {
  headers: authHeader()
 })
 .then(r => r.json())
 .then(data => {
  listaTecnicos.innerHTML = "";
  data.forEach(t => {
   listaTecnicos.innerHTML += `<div>${t.nombre}</div>`;
  });
 });
}

/* =========================
   PROYECTOS
========================= */
function agregarProyecto() {

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
 .then(() => mostrarProyectos());

}

function mostrarProyectos() {
 fetch(`${API_URL}/proyectos`, {
  headers: authHeader()
 })
 .then(r => r.json())
 .then(data => {
  listaProyectos.innerHTML = "";
  data.forEach(p => {
   listaProyectos.innerHTML += `<div>${p.numero} - ${p.sitio}</div>`;
  });
 });
}

/* =========================
   INFORMES
========================= */
function guardarInforme() {

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
 .then(() => mostrarInformes());

}

function mostrarInformes() {
 fetch(`${API_URL}/informes`, {
  headers: authHeader()
 })
 .then(r => r.json())
 .then(data => {
  listaInformes.innerHTML = "";
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