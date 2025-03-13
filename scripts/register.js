// Constructor
function newRequest(name, desc, fuentes, other, freq, prior) {
    this.name = name;
    this.desc = desc;
    this.fuentes = fuentes;
    this.other = other;
    this.freq = freq;
    this.prior = prior;
}

// Obtener los inputs del HTML
const inputName = document.getElementById("nombreDataset");
const inputDesc = document.getElementById("descripcion");
const inputFuente1 = document.getElementById("fuente1");
const inputFuente2 = document.getElementById("fuente2");
const inputFuente3 = document.getElementById("fuente3");
const inputOther = document.getElementById("otro");
const inputFreq = document.getElementById("frecuencia");
const inputPrior = document.getElementById("prioridad");

let requests = JSON.parse(localStorage.getItem('requests')) || [];

function register() {
    // Crear arreglo de fuentes seleccionadas
    let fuentes = [];
    if (inputFuente1.checked) fuentes.push(inputFuente1.value);
    if (inputFuente2.checked) fuentes.push(inputFuente2.value);
    if (inputFuente3.checked) fuentes.push(inputFuente3.value);

    // Validar que se haya ingresado un nombre para la solicitud
    if (inputName.value == "") {
        alert("Por favor ingrese un nombre");
        return;
    }

    // Crear un objeto de solicitud
    const request = new newRequest(inputName.value, inputDesc.value, fuentes, inputOther.value, inputFreq.value, inputPrior.value);
    //Agregar la solicitud al arreglo de solicitudes
    requests.push(request);
    //Guardar el arreglo de solicitudes en localStorage
    localStorage.setItem('requests', JSON.stringify(requests));
    // Mostrar mensaje de éxito
    const successAlert = document.getElementById("success-alert");
    successAlert.style.display = "block";
    // Redirigir a requests-list.html
    setTimeout(() => {
        window.location.href = 'requests-list.html';
    }, 5000);
}

function displayRequests() {
    const list = document.getElementById("list");
    if (!list) return; // Si no existe el elemento, salir de la función
    list.innerHTML = '';
    requests.forEach((request, index) => {
        let fuentesHTML = '';
        request.fuentes.forEach(fuente => {
            fuentesHTML += `<p class="card-text">${fuente}</p>`;
        });
        let requestElement = `
        <div class="col-md-6 mb-3">
            <div class="card" style="width: 100%;">
                <div class="card-body">
                    <h5 class="card-title">${request.name}</h5>
                    <p class="card-text">${request.desc}</p>
                    ${fuentesHTML}
                    <p class="card-text">${request.other}</p>
                    <p class="card-text">${request.freq}</p>
                    <p class="card-text">${request.prior}</p>
                    <a class="btn btn-danger" onclick="deleteRequest(${index})">Eliminar</a>
                </div>
            </div>
        </div>
        `;
        list.innerHTML += requestElement;
    });
}

// Función para eliminar una solicitud
function deleteRequest(index) {
    let requests = JSON.parse(localStorage.getItem('requests')) || [];
    requests.splice(index, 1);
    localStorage.setItem('requests', JSON.stringify(requests));
    const deleteReqAlert = document.getElementById("delete-req-alert");
    deleteReqAlert.style.display = "block";
    setTimeout(() => {
        window.location.reload();
    }, 2000);
}

// Función para limpiar el localStorage - Eliminar todas las solicitudes
function clearStorage() {
    localStorage.clear();
    requests = [];
    const deleteAlert = document.getElementById("delete-alert");
    deleteAlert.style.display = "block";
    setTimeout(() => {
        window.location.reload();
    }, 2000);
}

document.addEventListener("DOMContentLoaded", displayRequests);