let startX = 0;
let endX = 0;
let startTime = 0;

const TIME_THRESHOLD= 200;
const SPACE_THRESHOLD = 100;


//función que carga los datos del json a la variable todos
const loadTasks =() => {  
    fetch('/tasks/get')
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
        todos = data;
        displayTodos();
        detectar_swipe();
    }).catch(function(err) {
        console.log(err);
    });
    
}

//función que crea una tarea
const add = () => {
    let newTodo = document.getElementById("input_tarea");
    //si el campo de texto está vacío, no se añade nada
    if (newTodo.value === '') {
        return;
    }
    todos.push({ "id": todos.length + 1, "title": newTodo.value, "done": false });

    newTodo.value = '';

    displayTodos();
    detectar_swipe();
    
  
}

//función que elimina una tarea
const remove= (element) =>{
    //nombre de la tarea
    const titulo = element.innerHTML;
    //eliminar tarea de la lista que coincide con el nombre de la tarea
    const index = todos.findIndex((tarea) => tarea.title === titulo);
    if (index !== -1) {
    todos.splice(index, 1);
    }

    displayTodos();
    detectar_swipe();
}

//función que cambia el atributo done de la tarea
const toggleDone = (element) => {
    //nombre de la tarea
    const titulo = element.innerHTML;
    //cambiar el atributo done de la tarea que coincide con el nombre de la tarea
    const index = todos.findIndex((tarea) => tarea.title === titulo);
    if (index !== -1) {
        todos[index].done = !todos[index].done;
    }
    displayTodos();
    detectar_swipe();
}



 


function detectar_swipe(){
    const items = document.querySelectorAll("td");

    items.forEach(item => {
    item.addEventListener("touchstart", e => {
        e.preventDefault();
        startX = e.targetTouches[0].screenX;
        startTime = e.timeStamp;

        timer = setInterval(() => {
            if (Date.now() - startTime >= TIME_THRESHOLD) {
                toggleDone(e.target);
                setTimeout(function(){ modal_done(); }, 1000);
                setTimeout(function(){ modal_off(); }, 1000);
                navigator.vibrate(100);
                clearInterval(timer);
            }
        }, 200);

    }, { passive: false });

    item.addEventListener("touchmove", e => {
        e.preventDefault();
        endX = e.changedTouches[0].screenX;
    }, { passive: false });

    item.addEventListener("touchend", e => {
        e.preventDefault();
        endTime = e.timeStamp;
        endX = e.changedTouches[0].screenX;
        clearInterval(timer);
        if (endTime - startTime < TIME_THRESHOLD && endX - startX > SPACE_THRESHOLD) {
            remove(e.target);
            setTimeout(function(){ modal_eliminar(); }, 1000);
            setTimeout(function(){ modal_off(); }, 1000);
            navigator.vibrate(300);
        }
        
        
    });
    });
}



//función que muestra las tareas y cambia el color a las tareas completadas
function displayTodos() {
    tablaTareas.innerHTML = '';
    todos.forEach(function(tarea) {
        const fila = document.createElement('tr');
        const celda = document.createElement('td');
        celda.textContent = tarea.title;
        if (tarea.done) {
            celda.classList.remove('not-done');
            celda.classList.add('done');
        }
        else {
            celda.classList.remove('done');
            celda.classList.add('not-done');
        }     
        fila.appendChild(celda);
        tablaTareas.appendChild(fila);
    });
}


function modal_eliminar(){
    let modal_content = document.getElementById("modal-content");
    let modal_container = document.getElementById("modal-container");
    modal_content.classList.add("modal_eliminar");
    modal_container.style.display = "block";
    modal_content.style.display = "block";
    modal_content.innerHTML="Tarea eliminada";
}

function modal_done(){
    let modal_content = document.getElementById("modal-content");
    let modal_container = document.getElementById("modal-container");
    modal_content.classList.add("modal_done");
    modal_container.style.display = "block";
    modal_content.style.display = "block";
    modal_content.innerHTML=" ✓ ";
}


function modal_off(){
    let modal_content = document.getElementById("modal-content");
    let modal_container = document.getElementById("modal-container");
    modal_container.style.display = "none";
    modal_content.style.display = "none";
    modal_content.classList.remove("modal_done");
    modal_content.classList.remove("modal_eliminar");

}


//lista de tareas
let todos = [];

loadTasks();

const tablaTareas = document.getElementById('tabla-tareas');

const addButton = document.querySelector("#fab-add");

addButton.addEventListener("touchend", add);