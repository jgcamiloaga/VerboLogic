document.addEventListener("DOMContentLoaded", async () => {
  const palabras = await obtenerPalabras();
  const palabrasNormalizadas = palabras.map(normalizarPalabra);

  const palabraSeleccionada =
    palabrasNormalizadas[
      Math.floor(Math.random() * palabrasNormalizadas.length)
    ].toUpperCase();
  const longitudPalabra = palabraSeleccionada.length;
  const letterBoxes = document.getElementById("letter-boxes");
  const estadoJuego = document.getElementById("estado-juego");
  const inputLetra = document.getElementById("input-letra");
  const botonVerificar = document.getElementById("verificar");
  const playerHistory = document.getElementById("player-history");
  const aciertos = new Array(longitudPalabra).fill(false);

  // Crear cuadros para las letras, inicialmente con el caracter "?"
  crearCuadrosLetras();

  // Limitar la cantidad de caracteres en el input según la longitud de la palabra seleccionada
  inputLetra.maxLength = longitudPalabra;

  // Agregar eventos para validar la entrada
  inputLetra.addEventListener("input", validarEntrada);
  inputLetra.addEventListener("keydown", prevenirEntradaInvalida);

  // Evento para verificar la palabra ingresada
  botonVerificar.addEventListener("click", () => {
    const letraIngresada = normalizarPalabra(inputLetra.value.toUpperCase());
    if (letraIngresada.length === longitudPalabra) {
      verificarPalabra(letraIngresada);
      inputLetra.value = ""; // Limpiar el input después de verificar
    }
  });

  // Función para obtener palabras desde un archivo JSON
  async function obtenerPalabras() {
    try {
      const response = await fetch("palabras.json");
      if (!response.ok) throw new Error("Error al cargar el JSON");
      return await response.json();
    } catch (error) {
      console.error("Hubo un problema con la solicitud", error);
      return [];
    }
  }

  // Función para normalizar palabras eliminando acentos
  function normalizarPalabra(palabra) {
    return palabra.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Elimina acentos
  }

  // Crear cuadros de letras vacíos (con "?")
  function crearCuadrosLetras() {
    for (let i = 0; i < longitudPalabra; i++) {
      const letterBox = document.createElement("div");
      letterBox.classList.add("letter-box");
      letterBox.setAttribute("id", `box-${i}`);
      letterBox.innerText = "?";
      letterBoxes.appendChild(letterBox);
    }
  }

  // Función para verificar la palabra ingresada
  function verificarPalabra(letra) {
    const colores = new Array(longitudPalabra).fill("");
    const letrasContadas = contarLetras(palabraSeleccionada);
    let todasCorrectas = true;

    for (let i = 0; i < longitudPalabra; i++) {
      const box = document.getElementById(`box-${i}`);

      if (letra[i] === palabraSeleccionada[i]) {
        box.innerText = letra[i];
        colores[i] = "green";
        letrasContadas[letra[i]]--;
        aciertos[i] = true;
      } else {
        if (!aciertos[i]) {
          box.innerText = "?";
        }
        todasCorrectas = false;
      }
    }

    // Verificar letras correctas en posiciones incorrectas
    for (let i = 0; i < longitudPalabra; i++) {
      if (
        colores[i] !== "green" &&
        palabraSeleccionada.includes(letra[i]) &&
        letrasContadas[letra[i]] > 0
      ) {
        colores[i] = "orange";
        letrasContadas[letra[i]]--;
      }
    }

    mostrarIntento(letra, colores);

    if (todasCorrectas) {
      mostrarModal();
    }
  }

  // Función para contar la frecuencia de cada letra en una palabra
  function contarLetras(palabra) {
    return palabra.split("").reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {});
  }

  // Mostrar el intento en el historial
  function mostrarIntento(letra, colores) {
    const intentoContainer = document.createElement("div");
    intentoContainer.classList.add("letter-boxes");

    letra.split("").forEach((char, i) => {
      const box = document.createElement("div");
      box.classList.add("letter-box");
      box.innerText = char;
      box.style.backgroundColor = colores[i];
      intentoContainer.appendChild(box);
    });

    playerHistory.prepend(intentoContainer); // Añadir el intento al principio del historial
  }
});

// Funciones para validar solo letras
function SoloLetras(e) {
  const teclado = e.key;
  const letras = /^[A-Za-z]$/;
  const especiales = ["Backspace", "ArrowLeft", "ArrowRight", "Tab"];
  return letras.test(teclado) || especiales.includes(teclado);
}

function MarcoError(e) {
  const marco = document.getElementById("input-letra");
  if (!SoloLetras(e)) {
    marco.classList.add("marco-error");
    return false; // Evita la entrada de caracteres no válidos
  } else {
    marco.classList.remove("marco-error");
    return true; // Permite la entrada de caracteres válidos
  }
}

function validarEntrada(e) {
  const entrada = e.target.value;
  const entradaValida = entrada.replace(/[^A-Za-z]/g, '').toUpperCase();
  
  if (entrada !== entradaValida) {
    e.target.value = entradaValida;
  }
}

function prevenirEntradaInvalida(e) {
  if (!SoloLetras(e)) {
    e.preventDefault();
  }
}

// Mostrar el modal cuando se encuentra la palabra correcta
function mostrarModal() {
  const modal = document.getElementById("modal-ganador");
  modal.style.display = "block";
}

// Cerrar el modal
function cerrarModal() {
  const modal = document.getElementById("modal-ganador");
  modal.style.display = "none";
}

//Cerrar Modal
document.querySelector(".close").addEventListener("click", cerrarModal);
document.getElementById("cerrar-modal").addEventListener("click", cerrarModal);

// Cerrar modal si el usuario hace clic fuera del contenido
window.onclick = function (event) {
  const modal = document.getElementById("modal-ganador");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
