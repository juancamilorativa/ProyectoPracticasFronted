

let token = localStorage.getItem("token");
let editId = null;

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
const descripcion = document.getElementById("descripcion");
const fotos = document.getElementById("fotos");
const personas = document.getElementById("personas");

const listaInformesAdmin = document.getElementById("listaInformes");
const listaInformesTecnico = document.getElementById("listaInformesTecnico");

const modalEditar = document.getElementById("modalEditar");
const editFecha = document.getElementById("editFecha");
const editDescripcion = document.getElementById("editDescripcion");

/* =========================
   MENSAJES
========================= */
function msg(t, error=false){
 alert((error ? "❌ " : "✅ ") + t);
}

/* =========================
   AUTH
========================= */
function authHeader(){
 return {
  "Authorization": "Bearer " + localStorage.getItem("token")
 };
}

/* =========================
   LOGIN
========================= */
function login(){

 if(!user.value || !pass.value)
  return msg("Completa los campos", true);

 fetch(`${API_URL}/login`,{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({
   user:user.value,
   pass:pass.value
  })
 })
 .then(r=>r.json())
 .then(d=>{
  if(!d.ok) return msg(d.error,true);

  localStorage.setItem("token", d.data.token);
  localStorage.setItem("role", d.data.role);

  iniciarApp(d.data.role);
 })
 .catch(()=>msg("Error conexión",true));
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
  mostrarInformes(); // 🔥 CLAVE
 }
}

/* AUTO LOGIN */
window.onload = ()=>{
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

 if(sec==="tecnicos"){
  tecnicosSec.classList.remove("hidden");
 }

 if(sec==="proyectos"){
  proyectosSec.classList.remove("hidden");
 }

 if(sec==="informes"){
  informesSec.classList.remove("hidden");
  mostrarInformes(); // refrescar
 }
}

/* =========================
   TECNICOS
========================= */
function agregarTecnico(){

 if(!nuevoTecnico.value.trim())
  return msg("Nombre requerido",true);

 fetch(`${API_URL}/tecnicos`,{
  method:"POST",
  headers:{
   "Content-Type":"application/json",
   ...authHeader()
  },
  body:JSON.stringify({nombre:nuevoTecnico.value})
 })
 .then(r=>r.json())
 .then(d=>{
  if(!d.ok) return msg(d.error,true);

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

  (d.data||[]).forEach(t=>{
   listaTecnicos.innerHTML+=`
   <div>
    ${t.nombre}
    <button onclick="eliminarTecnico(${t.id})">Eliminar</button>
   </div>`;
  });
 });
}

function eliminarTecnico(id){
 fetch(`${API_URL}/tecnicos/${id}`,{
  method:"DELETE",
  headers:authHeader()
 })
 .then(()=>mostrarTecnicos());
}

/* =========================
   PROYECTOS
========================= */
function agregarProyecto(){

 if(!numeroProyecto.value || !nombreSitio.value)
  return msg("Campos vacíos",true);

 fetch(`${API_URL}/proyectos`,{
  method:"POST",
  headers:{
   "Content-Type":"application/json",
   ...authHeader()
  },
  body:JSON.stringify({
   numero:numeroProyecto.value,
   sitio:nombreSitio.value
  })
 })
 .then(r=>r.json())
 .then(d=>{
  if(!d.ok) return msg(d.error,true);

  msg("Proyecto agregado");
  numeroProyecto.value="";
  nombreSitio.value="";
  mostrarProyectos();
 });
}

function mostrarProyectos(){
 fetch(`${API_URL}/proyectos`,{headers:authHeader()})
 .then(r=>r.json())
 .then(d=>{
  listaProyectos.innerHTML="";

  (d.data||[]).forEach(p=>{
   listaProyectos.innerHTML+=`
   <div>
    ${p.numero} - ${p.sitio}
    <button onclick="eliminarProyecto(${p.id})">Eliminar</button>
   </div>`;
  });
 });
}

function eliminarProyecto(id){
 fetch(`${API_URL}/proyectos/${id}`,{
  method:"DELETE",
  headers:authHeader()
 })
 .then(()=>mostrarProyectos());
}

/* =========================
   SELECTS
========================= */
function cargarProyectosSelect(){
 fetch(`${API_URL}/proyectos`,{headers:authHeader()})
 .then(r=>r.json())
 .then(d=>{
  proyecto.innerHTML="";

  (d.data||[]).forEach(p=>{
   proyecto.innerHTML+=`
   <option value="${p.numero}" data-sitio="${p.sitio}">
    ${p.numero}
   </option>`;
  });
 });
}

proyecto.addEventListener("change",()=>{
 const s = proyecto.options[proyecto.selectedIndex];
 if(s) sitio.value = s.getAttribute("data-sitio");
});

function cargarTecnicosSelect(){
 fetch(`${API_URL}/tecnicos`,{headers:authHeader()})
 .then(r=>r.json())
 .then(d=>{
  personas.innerHTML="";

  (d.data||[]).forEach(t=>{
   personas.innerHTML+=`<option value="${t.id}">${t.nombre}</option>`;
  });
 });
}

/* =========================
   INFORMES
========================= */
function guardarInforme(){

 if(!proyecto.value || !descripcion.value)
  return msg("Campos incompletos",true);

 let fd=new FormData();

 let seleccionados=[...personas.selectedOptions].map(o=>o.value);

 fd.append("proyecto",proyecto.value);
 fd.append("sitio",sitio.value);
 fd.append("descripcion",descripcion.value);
 fd.append("personas",JSON.stringify(seleccionados));

 for(let f of fotos.files) fd.append("fotos",f);

 fetch(`${API_URL}/informes`,{
  method:"POST",
  headers:authHeader(),
  body:fd
 })
 .then(r=>r.json())
 .then(d=>{
  if(!d.ok) return msg(d.error,true);

  msg("Informe guardado");

  descripcion.value="";
  fotos.value="";
  personas.selectedIndex=-1;

  mostrarInformes();
 });
}

/* =========================
   MOSTRAR INFORMES
========================= */
function mostrarInformes(){
 fetch(`${API_URL}/informes`,{headers:authHeader()})
 .then(r=>r.json())
 .then(d=>{
  renderInformes(d.data || []);
 });
}

/* =========================
   RENDER (CORREGIDO)
========================= */
function renderInformes(data){

 const role = localStorage.getItem("role");

 const contenedor = role === "admin"
  ? listaInformesAdmin
  : listaInformesTecnico;

 if(!contenedor) return;

 contenedor.innerHTML = "";

 data.forEach(i=>{

  const minutos = (new Date() - new Date(i.fecha)) / 60000;

  let botones="";

  if(role==="admin"){
   botones=`
    <button onclick='editarInforme(${JSON.stringify(i)})'>Editar</button>
    <button onclick='eliminarInforme(${i.id})'>Eliminar</button>
   `;
  }

  if(role==="tecnico" && minutos<=15){
   botones=`<button onclick='editarInforme(${JSON.stringify(i)})'>Editar</button>`;
  }

  contenedor.innerHTML+=`
  <div class="card">
   <b>${i.proyecto}</b><br>
   ${i.sitio}<br>
   ${new Date(i.fecha).toLocaleString("es-CO")}<br>
   ${i.descripcion}<br>

   <b>Responsables:</b> ${i.responsables || "Sin asignar"}<br>

   ${botones}

   <button onclick='descargarInforme(${JSON.stringify(i)})'>PDF</button>
  </div>`;
 });
}

/* =========================
   EDITAR
========================= */
function editarInforme(i){
 editId=i.id;
 editFecha.value=i.fecha;
 editDescripcion.value=i.descripcion;
 modalEditar.classList.remove("hidden");
}

function guardarEdicion(){
 fetch(`${API_URL}/informes/${editId}`,{
  method:"PUT",
  headers:{
   "Content-Type":"application/json",
   ...authHeader()
  },
  body:JSON.stringify({
   fecha:editFecha.value,
   descripcion:editDescripcion.value
  })
 })
 .then(()=>{
  modalEditar.classList.add("hidden");
  mostrarInformes();
 });
}

/* =========================
   ELIMINAR
========================= */
function eliminarInforme(id){
 if(!confirm("¿Eliminar?")) return;

 fetch(`${API_URL}/informes/${id}`,{
  method:"DELETE",
  headers:authHeader()
 })
 .then(()=>mostrarInformes());
}

/* =========================
   PDF (IGUAL QUE TENÍAS)
========================= */
async function descargarInforme(i){

 const { jsPDF } = window.jspdf;
 const doc = new jsPDF();

 let y = 20;

 // 🔥 FUNCIÓN PARA SALTO DE LÍNEA AUTOMÁTICO
 function textoLargo(txt, x, yPos, maxWidth = 180){
  const lineas = doc.splitTextToSize(txt || "", maxWidth);
  doc.text(lineas, x, yPos);
  return yPos + (lineas.length * 7);
 }

 doc.setFontSize(16);
 doc.text("INFORME", 20, y);
 y += 10;

 doc.setFontSize(11);

 y = textoLargo(`Proyecto: ${i.proyecto}`, 20, y);
 y = textoLargo(`Sitio: ${i.sitio}`, 20, y);
 y = textoLargo(`Fecha: ${new Date(i.fecha).toLocaleString()}`, 20, y);

 // 🔥 RESPONSABLES 
 y += 5;
 doc.setFont(undefined, "bold");
 doc.text("Responsables:", 20, y);
 doc.setFont(undefined, "normal");

 y += 7;
 y = textoLargo(i.responsables || "N/A", 20, y);

 // 🔥 DESCRIPCIÓN
 y += 5;
 doc.setFont(undefined, "bold");
 doc.text("Descripción:", 20, y);
 doc.setFont(undefined, "normal");

 y += 7;
 y = textoLargo(i.descripcion || "", 20, y);

 // 🔥 IMÁGENES
 if(i.fotos){

  const lista = i.fotos.split(",");

  for(let f of lista){

   try{
    const url = `${API_URL}/uploads/${f}`;

    const res = await fetch(url);
    const blob = await res.blob();

    const base64 = await new Promise(resolve=>{
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

    const img = new Image();
    img.src = base64;

    await new Promise(resolve => img.onload = resolve);

    let imgWidth = img.width;
    let imgHeight = img.height;

    const maxWidth = 180;
    const ratio = maxWidth / imgWidth;

    imgWidth = maxWidth;
    imgHeight = imgHeight * ratio;

    // 🔥 SALTO DE PÁGINA
    if(y + imgHeight > 280){
     doc.addPage();
     y = 20;
    }

    doc.addImage(base64, "JPEG", 15, y, imgWidth, imgHeight);

    y += imgHeight + 10;

   }catch(e){
    console.log("Error imagen:", e);
   }
  }
 }

 doc.save("informe_"+i.id+".pdf");
}

/* =========================
   LOGOUT
========================= */
function logout(){
 localStorage.clear();
 location.reload();
}