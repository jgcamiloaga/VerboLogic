let palabraSecreta = ''; //Palabra para el juego
let maxLetras = 0;
let turnoActual = 0;
const jugadores = ['Jugador 1', 'Jugador 2'];

// Inicializa el tablero
function inicializarTablero() {
    // Limpiar el historial de intentos de ambos jugadores
    document.getElementById('player1-history').innerHTML = '<h3>Jugador 1</h3>';
    document.getElementById('player2-history').innerHTML = '<h3>Jugador 2</h3>';
}

// Cambia el turno al siguiente jugador
function cambiarTurno() {
    turnoActual = (turnoActual + 1) % jugadores.length;
    document.getElementById('current-player').textContent = jugadores[turnoActual];
}

// Verifica la palabra ingresada por el jugador y acumula el intento en su historial
function verificarPalabra(guess) {
    const guessResult = document.createElement('div');
    guessResult.classList.add('guess-result');

    for (let i = 0; i < maxLetras; i++) {
        const letterBox = document.createElement('div');
        letterBox.classList.add('letter-box');
        const letra = guess[i].toUpperCase();
        
        // Verificar si la letra está en la posición correcta (verde)
        if (palabraSecreta[i] === letra) {
            letterBox.textContent = letra;
            letterBox.style.backgroundColor = 'green'; // Letra y posición correcta
        } 
        // Verificar si la letra está en la palabra pero en otra posición (anaranjado)
        else if (palabraSecreta.includes(letra)) {
            letterBox.textContent = letra;
            letterBox.style.backgroundColor = 'orange'; // Letra correcta pero posición incorrecta
        } 
        // Si la letra no está en la palabra (gris)
        else {
            letterBox.textContent = letra;
            letterBox.style.backgroundColor = 'gray'; // Letra incorrecta
        }

        guessResult.appendChild(letterBox);
    }

    // Acumular el intento en el historial del jugador actual
    const playerHistory = document.getElementById(turnoActual === 0 ? 'player1-history' : 'player2-history');
    playerHistory.appendChild(guessResult);
}

// Inicializa el juego cuando el host elige una palabra
document.getElementById('host-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    palabraSecreta = document.getElementById('host-word').value.toUpperCase();
    maxLetras = palabraSecreta.length;
    
    if (maxLetras === 0) {
        alert('Por favor, introduce una palabra válida.');
        return;
    }
    
    inicializarTablero();

    // Cambiar la vista del host a la vista de juego
    document.getElementById('host-section').style.display = 'none';
    document.getElementById('waiting-section').style.display = 'none';
    document.getElementById('game-section').style.display = 'block';
    document.getElementById('player-guess').disabled = false;

    document.getElementById('current-player').textContent = jugadores[turnoActual];
});

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