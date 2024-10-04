document.addEventListener("DOMContentLoaded", async () => {
    const palabras = await obtenerPalabras();
    const palabraSeleccionada = palabras[Math.floor(Math.random() * palabras.length)].toUpperCase();
    const longitudPalabra = palabraSeleccionada.length;
    const letterBoxes = document.getElementById('letter-boxes');
    const estadoJuego = document.getElementById('estado-juego');
    const inputLetra = document.getElementById('input-letra');
    const botonVerificar = document.getElementById('verificar');
    const playerHistory = document.getElementById('player-history');
    const aciertos = new Array(longitudPalabra).fill(false); // Array para seguir las letras acertadas

    // Crear los cuadros para las letras con el caracter "?"
    for (let i = 0; i < longitudPalabra; i++) {
        const letterBox = document.createElement('div');
        letterBox.classList.add('letter-box');
        letterBox.setAttribute('id', `box-${i}`);
        letterBox.innerText = '?'; // Los cuadros comienzan con un "?"
        letterBoxes.appendChild(letterBox);
    }

    // Función para obtener palabras desde el JSON
    async function obtenerPalabras() {
        try {
            const response = await fetch('palabras.json');
            if (!response.ok) throw new Error('Error al cargar el JSON');
            return await response.json();
        } catch (error) {
            console.error('Hubo un problema con la solicitud Fetch:', error);
            return []; // Retornar un array vacío para evitar errores posteriores
        }
    }

    // Función para verificar la letra
    botonVerificar.addEventListener('click', () => {
        const letraIngresada = inputLetra.value.toUpperCase();

        // Verificar que la longitud de la palabra ingresada coincida con la palabra objetivo
        if (letraIngresada.length !== longitudPalabra) {
            alert(`Por favor, ingresa una palabra de ${longitudPalabra} letras.`);
            return;
        }

        // Limpiar el input solo después de la verificación
        inputLetra.value = '';
        verificarPalabra(letraIngresada);
    });

    // Función para mostrar el intento en el historial
    function mostrarIntento(letra, colores) {
        const intentoContainer = document.createElement('div');
        intentoContainer.classList.add('letter-boxes');

        for (let i = 0; i < letra.length; i++) {
            const box = document.createElement('div');
            box.classList.add('letter-box');
            box.innerText = letra[i]; // Muestra la letra ingresada en el cuadro
            box.style.backgroundColor = colores[i]; // Aplica el color correspondiente solo en el historial
            intentoContainer.appendChild(box);
        }

        //Para que el nuevo intento aparezca primero
        playerHistory.prepend(intentoContainer);
    }

    // Función para verificar la palabra
    function verificarPalabra(letra) {
        const colores = new Array(longitudPalabra).fill(''); // Inicializa un array de colores
        const letrasContadas = {}; // Objeto para contar letras en la palabra seleccionada

        // Contamos las letras de la palabra seleccionada
        for (const char of palabraSeleccionada) {
            letrasContadas[char] = (letrasContadas[char] || 0) + 1;
        }

        // Primero verificamos las letras en la posición correcta
        for (let i = 0; i < longitudPalabra; i++) {
            const box = document.getElementById(`box-${i}`);

            if (letra[i] === palabraSeleccionada[i]) {
                box.innerText = letra[i]; // Muestra la letra si es correcta
                colores[i] = 'green'; // El color para el historial, pero no para los cuadros de arriba
                letrasContadas[letra[i]]--; // Reducimos la cuenta de letras
                aciertos[i] = true; // Marcamos la posición como acertada
            } else if (!aciertos[i]) {
                box.innerText = '?'; // Mantiene el "?" si no es correcta y no se ha acertado antes
            }
        }

        // Luego verificamos las letras que están en la palabra pero en posición incorrecta
        for (let i = 0; i < longitudPalabra; i++) {
            if (colores[i] !== 'green' && palabraSeleccionada.includes(letra[i]) && letrasContadas[letra[i]] > 0) {
                colores[i] = 'orange'; // Solo aplicamos el color naranja en el historial
                letrasContadas[letra[i]]--; // Reducimos la cuenta de letras
            }
        }

        mostrarIntento(letra, colores); // Muestra el intento con los colores solo en el historial
    }
});