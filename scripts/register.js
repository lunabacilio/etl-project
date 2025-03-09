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

function register() {
    // Crear array de fuentes seleccionadas
    let fuentes = [];
    if (inputFuente1.checked) fuentes.push(inputFuente1.value);
    if (inputFuente2.checked) fuentes.push(inputFuente2.value);
    if (inputFuente3.checked) fuentes.push(inputFuente3.value);

    // Crear objeto
    let newNewRequest = new newRequest(inputName.value, inputDesc.value, fuentes, inputOther.value, inputFreq.value, inputPrior.value);

    // Desplegar el objeto
    if (inputName.value == "") {
        alert("Por favor ingrese un nombre");
        return;
    } else {
        console.log(newNewRequest);
        display(newNewRequest);
    }
}

function display(request) {
    const list = document.getElementById("list");
    let fuentesHTML = '';
    request.fuentes.forEach(fuente => {
        fuentesHTML += `<p class="card-text">${fuente}</p>`;
    });

    const p = `
    <div class="col-md-6 mb-3">
      <div class="card" style="width: 100%;">
        <div class="card-body">
            <h5 class="card-title">${request.name}</h5>
            <p class="card-text">${request.desc}</p>
            ${fuentesHTML}
            <p class="card-text">${request.other}</p>
            <p class="card-text">${request.freq}</p>
            <p class="card-text">${request.prior}</p>
            <a href="#" class="card-link">Ver Detalles</a>
        </div>
      </div>
    </div>
    `;
    list.innerHTML += p;
}

// Objetos de prueba
let request1 = new newRequest("Solicitud 1", "Descripcion 1", ["Fuente 1", "Fuente 2", "Fuente 3"], "Otro", "Diaria", "Alta");
let request2 = new newRequest("Solicitud 2", "Descripcion 2", ["Fuente 1", "Fuente 2", "Fuente 3"], "Otro", "Mensual", "Baja");

// Mostrar objetos de prueba
display(request1);
display(request2);