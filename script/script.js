document.addEventListener("DOMContentLoaded", async () => {
  // Siempre aplicar modo oscuro
  document.body.classList.add("dark-mode");

  // Configuración del juego
  const config = {
    maxIntentos: 6,
    dificultad: localStorage.getItem("verboLogicDifficulty") || "normal",
    longitudPalabra: Number.parseInt(
      localStorage.getItem("verboLogicWordLength") || "5"
    ),
    sonidosActivados: localStorage.getItem("verboLogicSound") !== "off",
  };

  // Estado del juego
  const gameState = {
    palabraSeleccionada: "",
    intentosRealizados: 0,
    juegoTerminado: false,
    filaActual: 0,
    columnaActual: 0,
    letrasUsadas: {},
    tiempoInicio: Date.now(),
    tiempoTranscurrido: 0,
  };

  // Elementos del DOM
  const elements = {
    gameBoard: document.getElementById("game-board"),
    keyboard: document.getElementById("keyboard"),
    inputLetra: document.getElementById("input-letra"),
    btnVerificar: document.getElementById("verificar"),
    timer: document.getElementById("timer"),
    difficulty: document.getElementById("difficulty"),
    modalVictoria: document.getElementById("modal-victoria"),
    modalDerrota: document.getElementById("modal-derrota"),
    modalAyuda: document.getElementById("modal-ayuda"),
    palabraCorrectaVictoria: document.getElementById("palabra-correcta"),
    palabraCorrectaDerrota: document.getElementById("palabra-correcta-derrota"),
    intentosUsados: document.getElementById("intentos-usados"),
    tiempoUsado: document.getElementById("tiempo-usado"),
    btnCompartir: document.getElementById("btn-compartir"),
    btnHome: document.getElementById("btn-home"),
    btnStats: document.getElementById("btn-stats"),
    btnHelp: document.getElementById("btn-help"),
    btnSettings: document.getElementById("btn-settings"),
    btnInicio: document.getElementById("btn-inicio"),
    btnReiniciar: document.getElementById("btn-reiniciar"),
    btnInicioDerrota: document.getElementById("btn-inicio-derrota"),
    btnReiniciarDerrota: document.getElementById("btn-reiniciar-derrota"),
    cerrarModalVictoria: document.getElementById("cerrar-modal"),
    cerrarModalDerrota: document.getElementById("cerrar-modal-derrota"),
    cerrarModalAyuda: document.getElementById("cerrar-modal-ayuda"),
  };

  // Inicializar juego
  await initGame();

  // Función para inicializar el juego
  async function initGame() {
    // Cargar palabras
    const palabras = await obtenerPalabras();

    // Filtrar palabras por longitud
    const palabrasFiltradas = palabras.filter(
      (palabra) => normalizarPalabra(palabra).length === config.longitudPalabra
    );

    if (palabrasFiltradas.length === 0) {
      console.error("No hay palabras disponibles con la longitud seleccionada");
      return;
    }

    // Seleccionar palabra aleatoria
    gameState.palabraSeleccionada = normalizarPalabra(
      palabrasFiltradas[Math.floor(Math.random() * palabrasFiltradas.length)]
    ).toUpperCase();

    console.log("Palabra seleccionada:", gameState.palabraSeleccionada); // Para depuración

    // Mostrar dificultad
    elements.difficulty.textContent =
      config.dificultad === "normal" ? "Normal" : "Difícil";

    // Crear tablero de juego
    crearTableroJuego();

    // Crear teclado virtual
    crearTecladoVirtual();

    // Iniciar temporizador
    iniciarTemporizador();

    // Configurar eventos
    setupEventListeners();

    // Actualizar la información de ajustes en el modal
    updateSettingsDisplay();
  }

  // Actualizar la visualización de ajustes en el modal
  function updateSettingsDisplay() {
    // Mostrar la dificultad actual
    const currentDifficulty = document.getElementById("current-difficulty");
    if (currentDifficulty) {
      currentDifficulty.textContent =
        config.dificultad === "normal" ? "Normal" : "Difícil";
    }

    // Mostrar la longitud de palabras actual
    const currentLength = document.getElementById("current-length");
    if (currentLength) {
      currentLength.textContent = config.longitudPalabra.toString();
    }

    // Mostrar el estado de los sonidos
    const currentSound = document.getElementById("current-sound");
    if (currentSound) {
      currentSound.textContent = config.sonidosActivados
        ? "Activados"
        : "Desactivados";
    }
  }

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
    return palabra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Crear tablero de juego
  function crearTableroJuego() {
    elements.gameBoard.innerHTML = "";

    for (let i = 0; i < config.maxIntentos; i++) {
      const row = document.createElement("div");
      row.classList.add("letter-row");

      for (let j = 0; j < config.longitudPalabra; j++) {
        const box = document.createElement("div");
        box.classList.add("letter-box");
        box.dataset.row = i;
        box.dataset.col = j;
        row.appendChild(box);
      }

      elements.gameBoard.appendChild(row);
    }
  }

  // Crear teclado virtual
  function crearTecladoVirtual() {
    const layout = [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
      ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BORRAR"],
    ];

    elements.keyboard.innerHTML = "";

    layout.forEach((row) => {
      const keyboardRow = document.createElement("div");
      keyboardRow.classList.add("keyboard-row");

      row.forEach((key) => {
        const keyButton = document.createElement("div");
        keyButton.classList.add("key");

        if (key === "ENTER" || key === "BORRAR") {
          keyButton.classList.add("wide");
        }

        keyButton.textContent = key;
        keyButton.setAttribute("data-key", key);
        keyButton.addEventListener("click", () => handleKeyPress(key));

        keyboardRow.appendChild(keyButton);
      });

      elements.keyboard.appendChild(keyboardRow);
    });
  }

  // Iniciar temporizador
  function iniciarTemporizador() {
    gameState.tiempoInicio = Date.now();

    const updateTimer = () => {
      if (gameState.juegoTerminado) return;

      const ahora = Date.now();
      const tiempoTranscurrido = Math.floor(
        (ahora - gameState.tiempoInicio) / 1000
      );
      gameState.tiempoTranscurrido = tiempoTranscurrido;

      const minutos = Math.floor(tiempoTranscurrido / 60)
        .toString()
        .padStart(2, "0");
      const segundos = (tiempoTranscurrido % 60).toString().padStart(2, "0");

      elements.timer.textContent = `${minutos}:${segundos}`;

      requestAnimationFrame(updateTimer);
    };

    updateTimer();
  }

  // Configurar eventos
  function setupEventListeners() {
    // Evento para verificar palabra
    elements.btnVerificar.addEventListener("click", verificarPalabra);

    // Evento para input de texto
    elements.inputLetra.addEventListener("input", (e) => {
      const valor = e.target.value.toUpperCase();
      const valorFiltrado = valor.replace(/[^A-ZÑ]/g, "");

      if (valor !== valorFiltrado) {
        e.target.value = valorFiltrado;
      }

      // Actualizar tablero con letras ingresadas
      actualizarFilaActual(valorFiltrado);
    });

    // Evento para tecla Enter
    elements.inputLetra.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        verificarPalabra();
      }
    });

    // Eventos para botones de navegación
    elements.btnHome.addEventListener(
      "click",
      () => (window.location.href = "index.html")
    );
    elements.btnStats.addEventListener("click", mostrarEstadisticas);
    elements.btnHelp.addEventListener("click", () =>
      mostrarModal(elements.modalAyuda)
    );
    elements.btnSettings.addEventListener("click", () =>
      mostrarModal(document.getElementById("modal-ajustes"))
    );

    // Eventos para modales
    elements.btnInicio.addEventListener(
      "click",
      () => (window.location.href = "index.html")
    );
    elements.btnReiniciar.addEventListener("click", reiniciarJuego);
    elements.btnInicioDerrota.addEventListener(
      "click",
      () => (window.location.href = "index.html")
    );
    elements.btnReiniciarDerrota.addEventListener("click", reiniciarJuego);
    elements.cerrarModalVictoria.addEventListener("click", () =>
      ocultarModal(elements.modalVictoria)
    );
    elements.cerrarModalDerrota.addEventListener("click", () =>
      ocultarModal(elements.modalDerrota)
    );
    elements.cerrarModalAyuda.addEventListener("click", () =>
      ocultarModal(elements.modalAyuda)
    );

    // Eventos para modales de estadísticas y ajustes
    document
      .getElementById("cerrar-modal-estadisticas")
      .addEventListener("click", () =>
        ocultarModal(document.getElementById("modal-estadisticas"))
      );
    document
      .getElementById("btn-cerrar-estadisticas")
      .addEventListener("click", () =>
        ocultarModal(document.getElementById("modal-estadisticas"))
      );
    document
      .getElementById("cerrar-modal-ajustes")
      .addEventListener("click", () =>
        ocultarModal(document.getElementById("modal-ajustes"))
      );
    document
      .getElementById("btn-cerrar-ajustes")
      .addEventListener("click", () =>
        ocultarModal(document.getElementById("modal-ajustes"))
      );

    // Evento para compartir resultado
    elements.btnCompartir.addEventListener("click", compartirResultado);
  }

  // Manejar pulsación de tecla virtual
  function handleKeyPress(key) {
    if (gameState.juegoTerminado) return;

    if (key === "ENTER") {
      verificarPalabra();
    } else if (key === "BORRAR") {
      const valorActual = elements.inputLetra.value;
      elements.inputLetra.value = valorActual.slice(0, -1);
      actualizarFilaActual(elements.inputLetra.value);
      // Reproducir sonido de borrar
      if (config.sonidosActivados) {
        reproducirSonidoTecla("borrar");
      }
    } else {
      if (elements.inputLetra.value.length < config.longitudPalabra) {
        elements.inputLetra.value += key;
        actualizarFilaActual(elements.inputLetra.value);
        // Reproducir sonido de tecla
        if (config.sonidosActivados) {
          reproducirSonidoTecla("tecla");
        }
      }
    }
  }

  // Actualizar fila actual con letras ingresadas
  function actualizarFilaActual(texto) {
    const fila = document.querySelectorAll(
      `.letter-box[data-row="${gameState.filaActual}"]`
    );

    // Limpiar fila
    fila.forEach((box) => {
      box.textContent = "";
      box.classList.remove("filled", "pop");
    });

    // Llenar con letras nuevas
    for (let i = 0; i < texto.length && i < config.longitudPalabra; i++) {
      const box = fila[i];
      box.textContent = texto[i];
      box.classList.add("filled");

      // Animación de pop
      setTimeout(() => {
        box.classList.add("pop");
        setTimeout(() => box.classList.remove("pop"), 100);
      }, i * 50);
    }
  }

  // Verificar palabra ingresada
  function verificarPalabra() {
    if (gameState.juegoTerminado) return;

    const palabraIngresada = elements.inputLetra.value.toUpperCase();

    // Verificar longitud
    if (palabraIngresada.length !== config.longitudPalabra) {
      mostrarError(
        "La palabra debe tener " + config.longitudPalabra + " letras"
      );
      return;
    }

    // Verificar palabra
    const resultado = evaluarPalabra(palabraIngresada);
    mostrarResultado(resultado);

    // Actualizar teclado
    actualizarTeclado(palabraIngresada, resultado);

    // Incrementar intentos
    gameState.intentosRealizados++;
    gameState.filaActual++;

    // Verificar victoria o derrota
    if (resultado.every((r) => r === "correct")) {
      finalizarJuegoVictoria();
    } else if (gameState.intentosRealizados >= config.maxIntentos) {
      finalizarJuegoDerrota();
    }

    // Limpiar input
    elements.inputLetra.value = "";
  }

  // Evaluar palabra ingresada
  function evaluarPalabra(palabra) {
    const resultado = new Array(config.longitudPalabra).fill("absent");
    const letrasContadas = {};

    // Contar letras en la palabra seleccionada
    for (const letra of gameState.palabraSeleccionada) {
      letrasContadas[letra] = (letrasContadas[letra] || 0) + 1;
    }

    // Primero marcar las letras correctas
    for (let i = 0; i < config.longitudPalabra; i++) {
      if (palabra[i] === gameState.palabraSeleccionada[i]) {
        resultado[i] = "correct";
        letrasContadas[palabra[i]]--;
      }
    }

    // Luego marcar las letras presentes pero en posición incorrecta
    for (let i = 0; i < config.longitudPalabra; i++) {
      if (
        resultado[i] !== "correct" &&
        gameState.palabraSeleccionada.includes(palabra[i]) &&
        letrasContadas[palabra[i]] > 0
      ) {
        resultado[i] = "present";
        letrasContadas[palabra[i]]--;
      }
    }

    return resultado;
  }

  // Mostrar resultado en el tablero
  function mostrarResultado(resultado) {
    const fila = document.querySelectorAll(
      `.letter-box[data-row="${gameState.filaActual}"]`
    );

    // Animar revelación de resultados
    for (let i = 0; i < config.longitudPalabra; i++) {
      const box = fila[i];

      // Retraso para animación secuencial
      setTimeout(() => {
        // Voltear carta
        box.style.transform = "rotateX(90deg)";

        setTimeout(() => {
          // Aplicar clase según resultado
          box.classList.remove("filled");
          box.classList.add(resultado[i]);

          // Completar volteo
          box.style.transform = "rotateX(0deg)";

          // Reproducir sonido si está activado
          if (config.sonidosActivados) {
            reproducirSonido(resultado[i]);
          }
        }, 250);
      }, i * 300);
    }
  }

  // Actualizar teclado virtual con colores
  function actualizarTeclado(palabra, resultado) {
    for (let i = 0; i < config.longitudPalabra; i++) {
      const letra = palabra[i];
      const estado = resultado[i];
      const tecla = document.querySelector(`.key[data-key="${letra}"]`);

      if (tecla) {
        // Solo actualizar si el estado es mejor que el actual
        if (estado === "correct") {
          tecla.className = "key correct";
        } else if (
          estado === "present" &&
          !tecla.classList.contains("correct")
        ) {
          tecla.className = "key present";
        } else if (
          estado === "absent" &&
          !tecla.classList.contains("correct") &&
          !tecla.classList.contains("present")
        ) {
          tecla.className = "key absent";
        }
      }
    }
  }

  // Mostrar error
  function mostrarError(mensaje) {
    elements.inputLetra.classList.add("error");

    // Animar fila actual
    const fila = document.querySelectorAll(
      `.letter-box[data-row="${gameState.filaActual}"]`
    );
    fila.forEach((box) => box.classList.add("shake"));

    // Reproducir sonido de error
    if (config.sonidosActivados) {
      reproducirSonido("error");
    }

    // Quitar clases después de la animación
    setTimeout(() => {
      elements.inputLetra.classList.remove("error");
      fila.forEach((box) => box.classList.remove("shake"));
    }, 500);
  }

  // Finalizar juego con victoria
  function finalizarJuegoVictoria() {
    gameState.juegoTerminado = true;

    // Actualizar estadísticas
    actualizarEstadisticas(true);

    // Reproducir sonido de victoria
    if (config.sonidosActivados) {
      setTimeout(() => {
        reproducirSonido("victoria");
      }, config.longitudPalabra * 300 + 200);
    }

    // Mostrar modal después de un retraso para las animaciones
    setTimeout(() => {
      // Mostrar palabra correcta
      mostrarPalabraCorrecta(elements.palabraCorrectaVictoria);

      // Mostrar estadísticas
      elements.intentosUsados.textContent = gameState.intentosRealizados;
      elements.tiempoUsado.textContent = formatearTiempo(
        gameState.tiempoTranscurrido
      );

      // Mostrar modal
      mostrarModal(elements.modalVictoria);

      // Crear confeti
      crearConfeti();
    }, config.longitudPalabra * 300 + 500);
  }

  // Finalizar juego con derrota
  function finalizarJuegoDerrota() {
    gameState.juegoTerminado = true;

    // Actualizar estadísticas
    actualizarEstadisticas(false);

    // Reproducir sonido de derrota
    if (config.sonidosActivados) {
      setTimeout(() => {
        reproducirSonido("derrota");
      }, config.longitudPalabra * 300 + 200);
    }

    // Mostrar modal después de un retraso para las animaciones
    setTimeout(() => {
      // Mostrar palabra correcta
      mostrarPalabraCorrecta(elements.palabraCorrectaDerrota);

      // Mostrar modal
      mostrarModal(elements.modalDerrota);
    }, config.longitudPalabra * 300 + 500);
  }

  // Mostrar palabra correcta en el modal
  function mostrarPalabraCorrecta(container) {
    container.innerHTML = "";

    for (const letra of gameState.palabraSeleccionada) {
      const letterElement = document.createElement("div");
      letterElement.classList.add("letter");
      letterElement.textContent = letra;
      container.appendChild(letterElement);
    }
  }

  // Actualizar estadísticas
  function actualizarEstadisticas(victoria) {
    const stats = getStats();

    stats.totalJugados++;

    if (victoria) {
      stats.totalGanados++;
      stats.rachaActual++;
      stats.distribucion[gameState.intentosRealizados] =
        (stats.distribucion[gameState.intentosRealizados] || 0) + 1;

      if (stats.rachaActual > stats.mejorRacha) {
        stats.mejorRacha = stats.rachaActual;
      }
    } else {
      stats.rachaActual = 0;
    }

    localStorage.setItem("verboLogicStats", JSON.stringify(stats));
  }

  // Obtener estadísticas del localStorage
  function getStats() {
    const defaultStats = {
      totalJugados: 0,
      totalGanados: 0,
      rachaActual: 0,
      mejorRacha: 0,
      distribucion: {},
    };

    const savedStats = localStorage.getItem("verboLogicStats");
    return savedStats ? JSON.parse(savedStats) : defaultStats;
  }

  // Mostrar estadísticas
  function mostrarEstadisticas() {
    // Actualizar estadísticas en el modal
    const stats = getStats();

    document.getElementById("total-jugados").textContent = stats.totalJugados;
    document.getElementById("total-ganados").textContent = stats.totalGanados;
    document.getElementById("racha-actual").textContent = stats.rachaActual;
    document.getElementById("mejor-racha").textContent = stats.mejorRacha;

    // Generar gráfico de distribución
    const distributionBars = document.getElementById("distribution-bars");
    distributionBars.innerHTML = "";

    // Encontrar el valor máximo para escalar las barras
    const values = Object.values(stats.distribucion);
    const maxValue = values.length > 0 ? Math.max(...values) : 1;

    for (let i = 1; i <= 6; i++) {
      const count = stats.distribucion[i] || 0;
      const percentage = maxValue > 0 ? (count / maxValue) * 100 : 0;

      const barHtml = `
        <div class="distribution-bar">
          <div class="bar-label">${i}</div>
          <div class="bar-container">
            <div class="bar-fill" style="width: ${percentage}%">
              ${count > 0 ? `<span class="bar-value">${count}</span>` : ""}
            </div>
          </div>
        </div>
      `;

      distributionBars.innerHTML += barHtml;
    }

    // Mostrar modal
    mostrarModal(document.getElementById("modal-estadisticas"));
  }

  // Compartir resultado
  function compartirResultado() {
    const emojis = {
      correct: "🟩",
      present: "🟧",
      absent: "⬛",
    };

    let resultado = `Verbo Logic ${gameState.intentosRealizados}/${config.maxIntentos}\n`;

    // Obtener resultados de cada fila
    for (let i = 0; i < gameState.intentosRealizados; i++) {
      const fila = document.querySelectorAll(`.letter-box[data-row="${i}"]`);
      let filaEmojis = "";

      fila.forEach((box) => {
        if (box.classList.contains("correct")) {
          filaEmojis += emojis.correct;
        } else if (box.classList.contains("present")) {
          filaEmojis += emojis.present;
        } else if (box.classList.contains("absent")) {
          filaEmojis += emojis.absent;
        }
      });

      resultado += filaEmojis + "\n";
    }

    // Copiar al portapapeles
    navigator.clipboard
      .writeText(resultado)
      .then(() => {
        elements.btnCompartir.textContent = "¡Copiado!";
        setTimeout(() => {
          elements.btnCompartir.textContent = "Compartir resultado";
        }, 2000);
      })
      .catch((err) => {
        console.error("Error al copiar: ", err);
      });
  }

  // Reiniciar juego
  function reiniciarJuego() {
    // Ocultar modales
    ocultarModal(elements.modalVictoria);
    ocultarModal(elements.modalDerrota);

    // Recargar página
    location.reload();
  }

  // Mostrar modal
  function mostrarModal(modal) {
    modal.classList.add("show");
    // Reproducir sonido de apertura de modal
    if (config.sonidosActivados) {
      reproducirSonidoModal("abrir");
    }
  }

  // Ocultar modal
  function ocultarModal(modal) {
    modal.classList.remove("show");
    // Reproducir sonido de cierre de modal
    if (config.sonidosActivados) {
      reproducirSonidoModal("cerrar");
    }
  }

  // Crear confeti
  function crearConfeti() {
    const container = document.getElementById("confetti-container");
    const colors = [
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
    ];

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");

      // Propiedades aleatorias
      const left = Math.random() * 100;
      const width = Math.random() * 10 + 5;
      const height = Math.random() * 10 + 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const delay = Math.random() * 3;
      const duration = Math.random() * 3 + 2;

      // Aplicar estilos
      confetti.style.left = `${left}%`;
      confetti.style.width = `${width}px`;
      confetti.style.height = `${height}px`;
      confetti.style.backgroundColor = color;
      confetti.style.animationDelay = `${delay}s`;
      confetti.style.animationDuration = `${duration}s`;

      container.appendChild(confetti);
    }
  }

  // Reproducir sonido
  function reproducirSonido(tipo) {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (tipo) {
      case "correct":
        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.frequency.linearRampToValueAtTime(
          800,
          audioContext.currentTime + 0.1
        );
        setTimeout(() => oscillator.stop(), 200);
        break;
      case "present":
        oscillator.frequency.value = 500;
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.frequency.linearRampToValueAtTime(
          600,
          audioContext.currentTime + 0.1
        );
        setTimeout(() => oscillator.stop(), 150);
        break;
      case "absent":
        oscillator.frequency.value = 350;
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.frequency.linearRampToValueAtTime(
          300,
          audioContext.currentTime + 0.1
        );
        setTimeout(() => oscillator.stop(), 100);
        break;
      case "error":
        oscillator.frequency.value = 250;
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.frequency.linearRampToValueAtTime(
          200,
          audioContext.currentTime + 0.1
        );
        setTimeout(() => oscillator.stop(), 300);
        break;
      case "victoria":
        // Secuencia de sonidos para victoria
        oscillator.frequency.value = 500;
        gainNode.gain.value = 0.1;
        oscillator.start();

        oscillator.frequency.linearRampToValueAtTime(
          600,
          audioContext.currentTime + 0.1
        );
        oscillator.frequency.linearRampToValueAtTime(
          700,
          audioContext.currentTime + 0.2
        );
        oscillator.frequency.linearRampToValueAtTime(
          800,
          audioContext.currentTime + 0.3
        );
        oscillator.frequency.linearRampToValueAtTime(
          900,
          audioContext.currentTime + 0.4
        );

        setTimeout(() => oscillator.stop(), 500);
        break;
      case "derrota":
        // Secuencia de sonidos para derrota
        oscillator.frequency.value = 500;
        gainNode.gain.value = 0.1;
        oscillator.start();

        oscillator.frequency.linearRampToValueAtTime(
          400,
          audioContext.currentTime + 0.1
        );
        oscillator.frequency.linearRampToValueAtTime(
          300,
          audioContext.currentTime + 0.2
        );
        oscillator.frequency.linearRampToValueAtTime(
          200,
          audioContext.currentTime + 0.3
        );

        setTimeout(() => oscillator.stop(), 400);
        break;
    }
  }

  // Añadir función para reproducir sonido de tecla
  function reproducirSonidoTecla(tipo) {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (tipo === "tecla") {
      oscillator.frequency.value = 700;
      gainNode.gain.value = 0.05;
      oscillator.start();
      setTimeout(() => oscillator.stop(), 50);
    } else if (tipo === "borrar") {
      oscillator.frequency.value = 500;
      gainNode.gain.value = 0.05;
      oscillator.start();
      setTimeout(() => oscillator.stop(), 70);
    }
  }

  // Añadir función para reproducir sonido de modal
  function reproducirSonidoModal(accion) {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (accion === "abrir") {
      oscillator.frequency.value = 400;
      gainNode.gain.value = 0.1;
      oscillator.start();
      oscillator.frequency.linearRampToValueAtTime(
        600,
        audioContext.currentTime + 0.2
      );
      setTimeout(() => oscillator.stop(), 200);
    } else if (accion === "cerrar") {
      oscillator.frequency.value = 600;
      gainNode.gain.value = 0.1;
      oscillator.start();
      oscillator.frequency.linearRampToValueAtTime(
        400,
        audioContext.currentTime + 0.2
      );
      setTimeout(() => oscillator.stop(), 200);
    }
  }

  // Formatear tiempo
  function formatearTiempo(segundos) {
    const minutos = Math.floor(segundos / 60)
      .toString()
      .padStart(2, "0");
    const segs = (segundos % 60).toString().padStart(2, "0");
    return `${minutos}:${segs}`;
  }
});
