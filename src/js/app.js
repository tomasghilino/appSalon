let pagina = 1;

const cita = {
    nombre = '',
    fecha = '',
    hora = '',
    servicios = []

}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    mostrarServicios();

    //Resalta el DIV actual segun el tab al que se presiona
    mostrarSeccion();

    //Oculta o muestra una seccion segun el tab al que se presiona
    cambiarSeccion();

    //Paginacion siguiente y anterior
    paginaSiguiente();

    paginaAnterior();

    //Comprueba la pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();

    //Muestra el resumen de la cita o mensaje de error en casao de no pasar la validacion
    mostrarResumen();

    // Almacena el nombre de la cita en el objeto
    nombreCita();

    //Almacena la fecha de la cita en el objeto
    fechaCita();

    //desabilita dias pasados
    deshabilitarFechaAnterior();

    // Almacena la hora de la cita en el objeto
    horaCita();
}

function mostrarSeccion(){

    //Eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion')
    if( seccionAnterior ){
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion')

    //Eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if( tabAnterior ){
        tabAnterior.classList.remove('actual');
    }
    

    //Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');
    enlaces.forEach( enlace =>{
        enlace.addEventListener('click', e =>{
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            //LLamar la funcion de mostrar seccion
            mostrarSeccion();

            botonesPaginador();
        })
    })
}

async function mostrarServicios(){
    try{

        const url = 'http://localhost:3000/servicios.php';
        const resultado = await fetch(url);
        const db = await resultado.json();

        // const {servicios} = db;

        //Generar el HTML
        db.forEach( servicio =>{
            const {id, nombre , precio} = servicio; // Extraigo datos y genero variable

            // DOM Scripting

            //Generar nombre de servicio.
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre; // nombre viene de desconstructuring
            nombreServicio.classList.add('nombre-servicio');

            //Generar precio de servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //Generar div contenedor de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            // Inyectar precio y nombre al div de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            // Selecciona un servicio.
            servicioDiv.onclick = seleccionarServicio;

            //Inyectarlo en el HTML
            document.querySelector('#servicios').appendChild(servicioDiv);

            
            
        });



    }catch (error){
        console.log(error);
    }
}

function seleccionarServicio(e){

    let elemento;
    //Forzar el elemento al cual le damos click sea el DIV
    if(e.target.tagName === 'P'){
        elemento = e.target.parentElement; // Si le doy click a algun parrafo toma el DIV (padre)
    }else{
        elemento = e.target;
    }

    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    }else{
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt( elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        agregarServicio(servicioObj);
    }
}

function eliminarServicio(id){

    const { servicios } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id); // Trae los diferentes al id que estoy eliminando, dejando a ese afuera basicamente

}

function agregarServicio(servicioObj){
    const { servicios} = cita;
    cita.servicios = [...servicios, servicioObj];

}

function paginaSiguiente(){
    const paginaSiguiente =  document.querySelector('#siguiente')
    paginaSiguiente.addEventListener('click', () =>{
        pagina++;
        botonesPaginador();
    })
}

function paginaAnterior(){
    const paginaAnterior =  document.querySelector('#anterior')
    paginaAnterior.addEventListener('click', () =>{
        pagina--;
        botonesPaginador();
    })
}

function botonesPaginador(){
    const paginaSiguiente =  document.querySelector('#siguiente');
    const paginaAnterior =  document.querySelector('#anterior');

    if(pagina === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }     
    else if (pagina === 3){
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
        mostrarResumen();
    } else{
        paginaAnterior.classList.remove('ocultar')
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

function mostrarResumen(){
    // Destructuring
    const { nombre, fecha, hora, servicios} = cita;

    //Seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    //Limpia el html previo
    while(resumenDiv.firstChild){
        resumenDiv.removeChild(resumenDiv.firstChild);
    }
   

    // Validacion de objetos
    if(Object.values(cita).includes('')){
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre'

        noServicios.classList.add('invalidar-cita');

        //Agregar al resumen Div
        resumenDiv.appendChild(noServicios);

        return;

    }

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita'
    //Mostrar el resumen
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;

    // Iterar sobre el arreglo de servicios
    servicios.forEach(servicio =>{

        const {nombre, precio} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');
        cantidad += parseInt(totalServicio[1].trim());

        // Colocar texto y precio en el div
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);
    })

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(serviciosCita);

    // Cantidad a pagar
    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total')
    cantidadPagar.innerHTML = `<span>Total a pagar: </span> ${cantidad}`
    resumenDiv.appendChild(cantidadPagar);
}

function nombreCita(){
    const nombreInput  = document.querySelector('#nombre');
    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim(); // quita los espacios en blanco al inicio-final

        //Validacion de que nombreTexto debe tener algo
        if(nombreTexto === '' || nombreTexto.length < 3){
            mostrarAlerta('Nombre no valido', 'error')
        }else{
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    })
}

function mostrarAlerta(mensaje, tipo){

    // Si hay una alerta previa, entonces no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error'){
        alerta.classList.add('error');
    }

    // Insertar en el HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //Eliminar la alerta despues de 3 seg
    setTimeout(() =>{
        alerta.remove();
    }, 3000);
}

function fechaCita(){
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e =>{
        const dia = new Date(e.target.value).getUTCDay(); // retorna el numero del dia del 0 al 6 // 0 es domingo
        if([0, 6].includes(dia)){ // Si es domingo o sabado
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de semana no son permitidos', 'error');
        } else{
            cita.fecha = fechaInput.value;
           
        }
    })
}

function deshabilitarFechaAnterior(){
    const inputFecha = document.querySelector('#fecha');
    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const dia = ("0" + fechaAhora.getDate()).slice(-2);
    const mes = ("0" + (fechaAhora.getMonth() + 1)).slice(-2);

    //Formato deseado: AAAA-MM-DD
    const fechaDeshabilitar = `${year}-${mes}-${dia}`;
    inputFecha.min = fechaDeshabilitar;

    console.log(inputFecha);
}

function horaCita(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e =>{
        const horaCita = e.target.value;
        const hora = horaCita.split(':');
        if(hora[0] < 10 || hora[0] > 18){
            mostrarAlerta('Hora no válida.', 'error');

            setTimeout(() => {
                inputHora.value = '';
            }, 3000);

        }else{
            cita.hora = horaCita;
        }
    })
}