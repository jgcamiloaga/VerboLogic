document.addEventListener("DOMContentLoaded", () => {
  // Inicializar estadísticas desde localStorage
  initStats();

  // Configurar modales
  setupModals();

  // Configurar opciones de ajustes
  setupSettingsOptions();
});

// Inicializar estadísticas
function initStats() {
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
                        ${
                          count > 0
                            ? `<span class="bar-value">${count}</span>`
                            : ""
                        }
                    </div>
                </div>
            </div>
        `;

    distributionBars.innerHTML += barHtml;
  }

  // Animar las barras después de un breve retraso
  setTimeout(() => {
    const bars = document.querySelectorAll(".bar-fill");
    bars.forEach((bar) => {
      const width = bar.style.width;
      bar.style.width = "0%";
      setTimeout(() => {
        bar.style.width = width;
      }, 50);
    });
  }, 100);
}

// Obtener estadísticas del localStorage
function getStats() {
  const defaultStats = {
    totalJugados: 0,
    totalGanados: 0,
    rachaActual: 0,
    mejorRacha: 0,
    distribucion: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    },
  };

  const savedStats = localStorage.getItem("verboLogicStats");
  return savedStats ? JSON.parse(savedStats) : defaultStats;
}

// Actualizar la función setupSettingsOptions para corregir el toggle de sonido
function setupSettingsOptions() {
  // Dificultad
  const difficultyOptions = document.querySelectorAll("[data-difficulty]");
  difficultyOptions.forEach((option) => {
    option.addEventListener("click", () => {
      difficultyOptions.forEach((opt) => opt.classList.remove("active"));
      option.classList.add("active");
      localStorage.setItem("verboLogicDifficulty", option.dataset.difficulty);
      // Reproducir sonido de clic si está activado
      if (localStorage.getItem("verboLogicSound") !== "off") {
        playClickSound();
      }
    });
  });

  // Longitud de palabras
  const lengthOptions = document.querySelectorAll("[data-length]");
  lengthOptions.forEach((option) => {
    option.addEventListener("click", () => {
      lengthOptions.forEach((opt) => opt.classList.remove("active"));
      option.classList.add("active");
      localStorage.setItem("verboLogicWordLength", option.dataset.length);
      // Reproducir sonido de clic si está activado
      if (localStorage.getItem("verboLogicSound") !== "off") {
        playClickSound();
      }
    });
  });

  // Sonidos - Completamente reescrito para solucionar el problema
  const soundToggle = document.getElementById("sound-toggle");
  const soundStatus = document.getElementById("sound-status");
  const toggleContainer = document.querySelector(".toggle-switch");

  if (soundToggle && soundStatus) {
    // Establecer el estado inicial basado en localStorage
    const isSoundOn = localStorage.getItem("verboLogicSound") !== "off";
    soundToggle.checked = isSoundOn;
    soundStatus.textContent = isSoundOn ? "Activados" : "Desactivados";

    // Crear una función para manejar el cambio de estado
    function toggleSound() {
      // Invertir el estado actual
      soundToggle.checked = !soundToggle.checked;

      // Guardar el nuevo estado
      localStorage.setItem(
        "verboLogicSound",
        soundToggle.checked ? "on" : "off"
      );

      // Actualizar el texto de estado
      soundStatus.textContent = soundToggle.checked
        ? "Activados"
        : "Desactivados";

      // Reproducir sonido solo si se activa
      if (soundToggle.checked) {
        playToggleSound();
      }
    }

    // Añadir evento al contenedor del toggle para mejor área de clic
    if (toggleContainer) {
      toggleContainer.addEventListener("click", (e) => {
        e.preventDefault();
        toggleSound();
      });
    }

    // También añadir evento al texto de estado para mejor usabilidad
    soundStatus.addEventListener("click", (e) => {
      e.preventDefault();
      toggleSound();
    });
  }

  // Cargar configuraciones guardadas
  loadSavedSettings();
}

// Añadir función para reproducir sonido de clic
function playClickSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  gainNode.gain.value = 0.1;
  oscillator.start();
  setTimeout(() => oscillator.stop(), 100);
}

// Añadir función para reproducir sonido de toggle
function playToggleSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 600;
  gainNode.gain.value = 0.1;
  oscillator.start();

  // Efecto de barrido para el toggle
  oscillator.frequency.linearRampToValueAtTime(
    900,
    audioContext.currentTime + 0.2
  );

  setTimeout(() => oscillator.stop(), 200);
}

// Modificar setupModals para añadir sonidos
function setupModals() {
  // Modal Reglas
  const btnVerReglas = document.getElementById("btn-ver-reglas");
  const modalReglas = document.getElementById("modal-reglas");
  const cerrarModalReglas = document.getElementById("cerrar-modal-reglas");
  const btnCerrarReglas = document.getElementById("btn-cerrar-reglas");

  btnVerReglas.addEventListener("click", () => {
    modalReglas.classList.add("show");
    if (localStorage.getItem("verboLogicSound") !== "off") {
      playModalOpenSound();
    }
  });

  cerrarModalReglas.addEventListener("click", () => {
    modalReglas.classList.remove("show");
    if (localStorage.getItem("verboLogicSound") !== "off") {
      playModalCloseSound();
    }
  });

  btnCerrarReglas.addEventListener("click", () => {
    modalReglas.classList.remove("show");
    if (localStorage.getItem("verboLogicSound") !== "off") {
      playModalCloseSound();
    }
  });

  // Modal Estadísticas
  const btnVerEstadisticas = document.getElementById("btn-ver-estadisticas");
  const modalEstadisticas = document.getElementById("modal-estadisticas");
  const cerrarModalEstadisticas = document.getElementById(
    "cerrar-modal-estadisticas"
  );
  const btnCerrarEstadisticas = document.getElementById(
    "btn-cerrar-estadisticas"
  );

  btnVerEstadisticas.addEventListener("click", () => {
    modalEstadisticas.classList.add("show");
    if (localStorage.getItem("verboLogicSound") !== "off") {
      playModalOpenSound();
    }
  });

  cerrarModalEstadisticas.addEventListener("click", () => {
    modalEstadisticas.classList.remove("show");
    if (localStorage.getItem("verboLogicSound") !== "off") {
      playModalCloseSound();
    }
  });

  btnCerrarEstadisticas.addEventListener("click", () => {
    modalEstadisticas.classList.remove("show");
    if (localStorage.getItem("verboLogicSound") !== "off") {
      playModalCloseSound();
    }
  });

  // Modal Ajustes
  const btnVerAjustes = document.getElementById("btn-ver-ajustes");
  const modalAjustes = document.getElementById("modal-ajustes");
  const cerrarModalAjustes = document.getElementById("cerrar-modal-ajustes");
  const btnCerrarAjustes = document.getElementById("btn-cerrar-ajustes");

  btnVerAjustes.addEventListener("click", () => {
    modalAjustes.classList.add("show");
    if (localStorage.getItem("verboLogicSound") !== "off") {
      playModalOpenSound();
    }
  });

  cerrarModalAjustes.addEventListener("click", () => {
    modalAjustes.classList.remove("show");
    if (localStorage.getItem("verboLogicSound") !== "off") {
      playModalCloseSound();
    }
  });

  btnCerrarAjustes.addEventListener("click", () => {
    modalAjustes.classList.remove("show");
    if (localStorage.getItem("verboLogicSound") !== "off") {
      playModalCloseSound();
    }
  });

  // Cerrar modales al hacer clic fuera del contenido
  window.addEventListener("click", (event) => {
    if (event.target === modalReglas) {
      modalReglas.classList.remove("show");
      if (localStorage.getItem("verboLogicSound") !== "off") {
        playModalCloseSound();
      }
    }
    if (event.target === modalEstadisticas) {
      modalEstadisticas.classList.remove("show");
      if (localStorage.getItem("verboLogicSound") !== "off") {
        playModalCloseSound();
      }
    }
    if (event.target === modalAjustes) {
      modalAjustes.classList.remove("show");
      if (localStorage.getItem("verboLogicSound") !== "off") {
        playModalCloseSound();
      }
    }
  });
}

// Añadir funciones para sonidos de modal
function playModalOpenSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 400;
  gainNode.gain.value = 0.1;
  oscillator.start();
  oscillator.frequency.linearRampToValueAtTime(
    600,
    audioContext.currentTime + 0.2
  );
  setTimeout(() => oscillator.stop(), 200);
}

function playModalCloseSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 600;
  gainNode.gain.value = 0.1;
  oscillator.start();
  oscillator.frequency.linearRampToValueAtTime(
    400,
    audioContext.currentTime + 0.2
  );
  setTimeout(() => oscillator.stop(), 200);
}

// Cargar configuraciones guardadas
function loadSavedSettings() {
  const savedDifficulty =
    localStorage.getItem("verboLogicDifficulty") || "normal";
  const difficultyOption = document.querySelector(
    `[data-difficulty="${savedDifficulty}"]`
  );
  if (difficultyOption) {
    document
      .querySelectorAll("[data-difficulty]")
      .forEach((opt) => opt.classList.remove("active"));
    difficultyOption.classList.add("active");
  }

  const savedLength = localStorage.getItem("verboLogicWordLength") || "5";
  const lengthOption = document.querySelector(`[data-length="${savedLength}"]`);
  if (lengthOption) {
    document
      .querySelectorAll("[data-length]")
      .forEach((opt) => opt.classList.remove("active"));
    lengthOption.classList.add("active");
  }
}
