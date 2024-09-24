const palabraSecreta = "COMEDOR"; // Palabra elegida por el host
const maxLetras = palabraSecreta.length;
let turnoActual = 0;
const jugadores = ['Jugador 1', 'Jugador 2']; // Lista de jugadores

// Inicializa el tablero mostrando cuadros vacíos para cada letra
function inicializarTablero() {
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = '';
    for (let i = 0; i < maxLetras; i++) {
        const letterBox = document.createElement('div');
        letterBox.classList.add('letter-box', 'gray');
        wordContainer.appendChild(letterBox);
    }
}

// Cambia el turno al siguiente jugador
function cambiarTurno() {
    turnoActual = (turnoActual + 1) % jugadores.length;
    document.getElementById('current-player').textContent = jugadores[turnoActual];
}

// Verifica la palabra ingresada por el jugador
function verificarPalabra(guess) {
    const wordContainer = document.getElementById('word-container');
    for (let i = 0; i < maxLetras; i++) {
        const letterBox = wordContainer.children[i];
        const letra = guess[i].toUpperCase();
        
        if (palabraSecreta[i] === letra) {
            letterBox.textContent = letra;
            letterBox.classList.remove('gray', 'orange');
            letterBox.classList.add('green'); // Letra y posición correcta
        } else if (palabraSecreta.includes(letra)) {
            letterBox.textContent = letra;
            letterBox.classList.remove('gray', 'green');
            letterBox.classList.add('orange'); // Letra correcta pero posición incorrecta
        } else {
            letterBox.textContent = letra;
            letterBox.classList.remove('green', 'orange');
            letterBox.classList.add('gray'); // Letra incorrecta
        }
    }
}

// Inicializar el tablero y el juego
inicializarTablero();
document.getElementById('current-player').textContent = jugadores[turnoActual];

// Manejador del evento submit cuando el jugador ingresa su palabra
document.getElementById('guess-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const guess = document.getElementById('player-guess').value.toUpperCase();
    
    if (guess.length !== maxLetras) {
        alert(`La palabra debe tener ${maxLetras} letras.`);
        return;
    }
    
    verificarPalabra(guess);
    cambiarTurno();
    document.getElementById('player-guess').value = '';
});