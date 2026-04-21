
let token = localStorage.getItem("token");

/* =========================
   MENSAJES
========================= */
function msg(t, e=false){
 alert((e?"❌ ":"✅ ")+t);
}

/* =========================
   AUTH
========================= */
function authHeader(){
 return {
  "Authorization":"Bearer "+localStorage.getItem("token")
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
const personas = document.getElementById("personas");
const listaInformes = document.getElementById("listaInformes");

const filtroProyecto = document.getElementById("filtroProyecto");
const filtroFecha = document.getElementById("filtroFecha");

/* =========================
   LOGIN
========================= */
function login(){

 if(!user.value || !pass.value)
  return msg("Completa los campos",true);

 fetch(`${API_URL}/login`,{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({user:user.value,pass:pass.value})
 })
 .then(async r=>{
  const d = await r.json();
  if(!d.ok) throw new Error(d.error);
  return d.data;
 })
 .then(data=>{
  localStorage.setItem("token",data.token);
  localStorage.setItem("role",data.role);
  iniciarApp(data.role);
 })
 .catch(e=>msg(e.message,true));
}

/* =========================
   INICIAR APP
========================= */
function iniciarApp(role){

 loginDiv.classList.add("hidden");

 if(role==="admin"){
  panelAdmin.classList.remove("hidden");
  mostrarTecnicos();
  mostrarProyectos();
  mostrarInformes();
 }else{
  panelTecnico.classList.remove("hidden");
  cargarProyectosSelect();
  cargarTecnicosSelect();
  mostrarInformes();
 }
}

/* AUTO LOGIN */
window.onload=()=>{
 const role = localStorage.getItem("role");
 if(token && role) iniciarApp(role);
};

/* =========================
   SECCIONES
========================= */
function mostrarSeccion(sec){
 tecnicosSec.classList.add("hidden");
 proyectosSec.classList.add("hidden");
 informesSec.classList.add("hidden");

 if(sec==="tecnicos") tecnicosSec.classList.remove("hidden");
 if(sec==="proyectos") proyectosSec.classList.remove("hidden");
 if(sec==="informes") informesSec.classList.remove("hidden");
}

/* =========================
   TECNICOS
========================= */
function agregarTecnico(){

 if(!nuevoTecnico.value.trim())
  return msg("Nombre requerido",true);

 fetch(`${API_URL}/tecnicos`,{
  method:"POST",
  headers:{ "Content-Type":"application/json", ...authHeader() },
  body:JSON.stringify({nombre:nuevoTecnico.value})
 })
 .then(r=>r.json())
 .then(()=>{
  msg("Técnico agregado");
  nuevoTecnico.value="";
  mostrarTecnicos();
 });
}

function mostrarTecnicos(){
 fetch(`${API_URL}/tecnicos`,{headers:authHeader()})
 .then(r=>r.json())
 .then(d=>{
  listaTecnicos.innerHTML="";
  d.data.forEach(t=>{
   listaTecnicos.innerHTML+=`<div>${t.nombre}</div>`;
  });
 });
}

/* =========================
   PROYECTOS
========================= */
function agregarProyecto(){

 if(!numeroProyecto.value || !nombreSitio.value)
  return msg("Campos vacíos",true);

 fetch(`${API_URL}/proyectos`,{
  method:"POST",
  headers:{ "Content-Type":"application/json", ...authHeader() },
  body:JSON.stringify({
   numero:numeroProyecto.value,
   sitio:nombreSitio.value
  })
 })
 .then(r=>r.json())
 .then(()=>{
  msg("Proyecto agregado");
  mostrarProyectos();
 });
}

function mostrarProyectos(){
 fetch(`${API_URL}/proyectos`,{headers:authHeader()})
 .then(r=>r.json())
 .then(d=>{
  listaProyectos.innerHTML="";
  d.data.forEach(p=>{
   listaProyectos.innerHTML+=`<div>${p.numero} - ${p.sitio}</div>`;
  });
 });
}

/* =========================
   SELECT PROYECTO
========================= */
function cargarProyectosSelect(){
 fetch(`${API_URL}/proyectos`,{headers:authHeader()})
 .then(r=>r.json())
 .then(d=>{
  proyecto.innerHTML="";
  d.data.forEach(p=>{
   proyecto.innerHTML+=`
   <option value="${p.numero}" data-sitio="${p.sitio}">
   ${p.numero}
   </option>`;
  });
 });
}

proyecto.addEventListener("change",()=>{
 const s = proyecto.options[proyecto.selectedIndex];
 sitio.value = s.getAttribute("data-sitio");
});

/* =========================
   TECNICOS SELECT
========================= */
function cargarTecnicosSelect(){
 fetch(`${API_URL}/tecnicos`,{headers:authHeader()})
 .then(r=>r.json())
 .then(d=>{
  personas.innerHTML="";
  d.data.forEach(t=>{
   personas.innerHTML+=`<option value="${t.id}">${t.nombre}</option>`;
  });
 });
}

/* =========================
   INFORMES
========================= */
function guardarInforme(){

 if(!proyecto.value || !fecha.value || !descripcion.value)
  return msg("Campos incompletos",true);

 let fd=new FormData();

 let seleccionados=[...personas.selectedOptions].map(o=>o.value);

 fd.append("proyecto",proyecto.value);
 fd.append("sitio",sitio.value);
 fd.append("fecha",fecha.value);
 fd.append("descripcion",descripcion.value);
 fd.append("personas",JSON.stringify(seleccionados));

 for(let f of fotos.files) fd.append("fotos",f);

 fetch(`${API_URL}/informes`,{
  method:"POST",
  headers:authHeader(),
  body:fd
 })
 .then(r=>r.json())
 .then(()=>{
  msg("Informe guardado");
  mostrarInformes();
 });
}

/* =========================
   RENDER PRO
========================= */
function renderInformes(data){

 listaInformes.innerHTML="";

 if(!data.length){
  listaInformes.innerHTML="Sin informes";
  return;
 }

 data.forEach(i=>{

  let fotosHTML="";
  if(i.fotos){
   i.fotos.split(",").forEach(f=>{
    fotosHTML+=`<img src="${API_URL}/uploads/${f}" width="60">`;
   });
  }

  listaInformes.innerHTML+=`
  <div style="border:1px solid #ccc; margin:10px; padding:10px;">

   <b>Proyecto:</b> ${i.proyecto}<br>
   <b>Sitio:</b> ${i.sitio}<br>
   <b>Fecha:</b> ${i.fecha}<br>
   <b>Descripción:</b> ${i.descripcion}<br>

   ${fotosHTML}<br>

   <button onclick='descargarInforme(${JSON.stringify(i)})'>PDF</button>
   <button onclick='eliminarInforme(${i.id})'>Eliminar</button>

  </div>`;
 });
}

function mostrarInformes(){
 fetch(`${API_URL}/informes`,{headers:authHeader()})
 .then(r=>r.json())
 .then(d=>renderInformes(d.data));
}

/* =========================
   FILTRO
========================= */
function filtrarInformes(){

 fetch(`${API_URL}/informes`,{headers:authHeader()})
 .then(r=>r.json())
 .then(d=>{

  let data=d.data;

  if(filtroProyecto.value)
   data=data.filter(i=>i.proyecto.includes(filtroProyecto.value));

  if(filtroFecha.value)
   data=data.filter(i=>i.fecha===filtroFecha.value);

  renderInformes(data);
 });
}

/* =========================
   ELIMINAR
========================= */
function eliminarInforme(id){

 if(!confirm("Eliminar?")) return;

 fetch(`${API_URL}/informes/${id}`,{
  method:"DELETE",
  headers:authHeader()
 })
 .then(()=>mostrarInformes());
}

/* =========================
   PDF
========================= */
function descargarInforme(i){

 const {jsPDF}=window.jspdf;
 const doc=new jsPDF();

 doc.setFontSize(16);
 doc.text("INFORME TECNICO",20,20);

 doc.setFontSize(12);
 doc.text("Proyecto: "+i.proyecto,20,40);
 doc.text("Sitio: "+i.sitio,20,50);
 doc.text("Fecha: "+i.fecha,20,60);

 doc.text("Descripcion:",20,80);
 doc.text(i.descripcion||"",20,90,{maxWidth:160});

 doc.save("informe_"+i.id+".pdf");
}

/* =========================
   LOGOUT
========================= */
function logout(){
 localStorage.clear();
 location.reload();
}