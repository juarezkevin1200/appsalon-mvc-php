let paso = 1;
const pasoInicial=1;
const pasoFinal =3;

const cita ={
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []

}

document.addEventListener('DOMContentLoaded',function(){

    iniciarApp();
});

function iniciarApp(){
    mostrarSeccion();//muestra y oculta
    tabs(); //Cambia la seccion cuando se precionan los tabs
    botonesPaginador();//Agrega o quita los botones
    paginaSiguiente();
    paginaAnterior();
    consultarAPI();//Consulta la api en el backend de php
    nombreCliente();//añade el nombre del clinte al objeto de cita
    idCliente();
    seleccionaFecha();//añade la fecha
    seleccionarHora();//Seelcciona la hora
    mostrarResumen();//Muestra el resumen de la cita
}
function mostrarSeccion(){
    //Ocultar la seccion que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior){ 
         seccionAnterior.classList.remove('mostrar');
    }
    //Selecciona la seccion con el paso
    const PasoSelector =`#paso-${paso}`;
    const seccion  = document.querySelector(PasoSelector);
    seccion.classList.add('mostrar');
    //quita la clase actual al tab anterior
    const tabAnterior = document.querySelector(".actual");
    if(tabAnterior){
        tabAnterior.classList.remove("actual");
    }
    //Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');

}

function tabs(){
    const botones =  document.querySelectorAll('.tabs button');
    botones.forEach(boton =>{
        boton.addEventListener('click',function (e){
            paso = parseInt(e.target.dataset.paso);
            botonesPaginador();
            mostrarSeccion();
        });
    })
}

function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(paso === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }else if(paso === 3){
        paginaAnterior.classList.remove('ocultar'); 
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen();
    }else{
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');

    }

    mostrarSeccion();
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click',function(){
        if(paso <= pasoInicial) return;
        paso--;
        botonesPaginador();
    });
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click',function(){
        if(paso >= pasoFinal) return;
        paso++;
        botonesPaginador();
    });
}

async function consultarAPI(){
    try {
        const url = `${location.origin}/api/servicios`;
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);
    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios(servicios){
    servicios.forEach(servicio =>{
        const {id,nombre,precio} = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function(){
            seleccionarServicio(servicio);
        }
        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);
        document.querySelector('#servicios').appendChild(servicioDiv);
    });
}
function seleccionarServicio(servicio){
    const {id} = servicio;
    const {servicios} = cita;

    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);
    
    //Comprobar que un servicio ya fue agregado o quitarlo
    if(servicios.some(agregado => agregado.id === id)){
        //Eliminarlo
        cita.servicios = servicios.filter(agregado => agregado.id != id);
        divServicio.classList.remove('seleccionado');
    }else{
        cita.servicios = [...servicios,servicio];
        divServicio.classList.add('seleccionado');
    }
}

function idCliente(){
    cita.id = document.querySelector('#id').value;
   
}

function nombreCliente(){
     cita.nombre = document.querySelector('#nombre').value;
    
}

function seleccionaFecha(){
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input',function(e){
        const dia= new Date(e.target.value).getUTCDay();
        if([6,0].includes(dia)){
            e.target.value = "";
            mostrarAlerta('Fines de semana no permitidos','error','.formulario');
        }else{
            cita.fecha = e.target.value;
        }
        
    });
}

function seleccionarHora(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input',function(e){

        const horaCita =e.target.value;
        const hora  = horaCita.split(":")[0];
        if(hora < 10 || hora > 18){
            e.target.value = '';
            mostrarAlerta('Hora No válida','error','.formulario');
        }else{
            cita.hora = e.target.value;
        }
    })
}

function mostrarAlerta(mensaje,tipo,elemento,desaparece = true){

    const AlertaPrevia = document.querySelector('.alerta');
    if(AlertaPrevia) {
        AlertaPrevia.remove();
    }
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);
    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);
    if(desaparece){
        setTimeout(() => {
            alerta.remove();
        },3000);
    }
 
}

function mostrarResumen(){
    const resumen = document.querySelector('.contenido-resumen');
    

    //Limpiar el contenido de resumen
    while(resumen.firstChild){
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0){
        mostrarAlerta('Faltan datos de servicios, Fecha o Hora','error','.contenido-resumen',false);
        return;
    }

    //Formatear el div de resumen
    const {nombre , fecha, hora,servicios} = cita;
    
    //Heading
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de servicios';
    resumen.appendChild(headingServicios);

    //iterando y mostrando servicios
    servicios.forEach(servicio =>{
        const {id,precio,nombre} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;
        
        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    })

    //Heading cita 
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de cita';
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    //Formatear la fecha en español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() +2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date(Date.UTC(year,mes,dia));
    const opciones = {weekday: 'long',year:'numeric',month:'long',day:'numeric'}
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX',opciones);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

    //Boton para crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;


    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(botonReservar);

}

async function reservarCita(){
    const {id,fecha,hora,servicios} = cita;
    const idServicios = servicios.map(servicio => servicio.id);
    const datos = new FormData();
    datos.append('usuarioId',id);
    datos.append('fecha',fecha);
    datos.append('hora',hora);
    datos.append('servicios',idServicios);
    //console.log([...datos]);
    //return;
    try {
            //Peticion hacia la API
        const url = `${location.origin}/api/citas`;

        const respuesta = await fetch(url,{
            method: 'POST',
            body:  datos
        });

        const resultado = await respuesta.json();
        if(resultado.resultado){
            Swal.fire({
                icon: "success",
                title: "Cita creada",
                text: "Tu cita fue creada correctamente",
                button: 'OK'
            }).then(() => {
                setTimeout(() => {
                    window.location.reload();
                },3000);
                
            })
        }
        console.log(resultado.resultado);
        //console.log([...datos]);
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al guardar una cita"
          });
    }

    

}

