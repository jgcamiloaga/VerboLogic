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

// Configurar modales
function setupModals() {
  // Modal Reglas
  const btnVerReglas = document.getElementById("btn-ver-reglas");
  const modalReglas = document.getElementById("modal-reglas");
  const cerrarModalReglas = document.getElementById("cerrar-modal-reglas");
  const btnCerrarReglas = document.getElementById("btn-cerrar-reglas");

  btnVerReglas.addEventListener("click", () => {
    modalReglas.classList.add("show");
  });

  cerrarModalReglas.addEventListener("click", () => {
    modalReglas.classList.remove("show");
  });

  btnCerrarReglas.addEventListener("click", () => {
    modalReglas.classList.remove("show");
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
  });

  cerrarModalEstadisticas.addEventListener("click", () => {
    modalEstadisticas.classList.remove("show");
  });

  btnCerrarEstadisticas.addEventListener("click", () => {
    modalEstadisticas.classList.remove("show");
  });

  // Modal Ajustes
  const btnVerAjustes = document.getElementById("btn-ver-ajustes");
  const modalAjustes = document.getElementById("modal-ajustes");
  const cerrarModalAjustes = document.getElementById("cerrar-modal-ajustes");
  const btnCerrarAjustes = document.getElementById("btn-cerrar-ajustes");

  btnVerAjustes.addEventListener("click", () => {
    modalAjustes.classList.add("show");
  });

  cerrarModalAjustes.addEventListener("click", () => {
    modalAjustes.classList.remove("show");
  });

  btnCerrarAjustes.addEventListener("click", () => {
    modalAjustes.classList.remove("show");
  });

  // Cerrar modales al hacer clic fuera del contenido
  window.addEventListener("click", (event) => {
    if (event.target === modalReglas) {
      modalReglas.classList.remove("show");
    }
    if (event.target === modalEstadisticas) {
      modalEstadisticas.classList.remove("show");
    }
    if (event.target === modalAjustes) {
      modalAjustes.classList.remove("show");
    }
  });
}

// Configurar opciones de ajustes
function setupSettingsOptions() {
  // Dificultad
  const difficultyOptions = document.querySelectorAll("[data-difficulty]");
  difficultyOptions.forEach((option) => {
    option.addEventListener("click", () => {
      difficultyOptions.forEach((opt) => opt.classList.remove("active"));
      option.classList.add("active");
      localStorage.setItem("verboLogicDifficulty", option.dataset.difficulty);
    });
  });

  // Longitud de palabras
  const lengthOptions = document.querySelectorAll("[data-length]");
  lengthOptions.forEach((option) => {
    option.addEventListener("click", () => {
      lengthOptions.forEach((opt) => opt.classList.remove("active"));
      option.classList.add("active");
      localStorage.setItem("verboLogicWordLength", option.dataset.length);
    });
  });

  // Sonidos
  const soundToggle = document.getElementById("sound-toggle");
  if (soundToggle) {
    soundToggle.checked = localStorage.getItem("verboLogicSound") !== "off";
    soundToggle.addEventListener("change", () => {
      localStorage.setItem(
        "verboLogicSound",
        soundToggle.checked ? "on" : "off"
      );
    });
  }

  // Cargar configuraciones guardadas
  loadSavedSettings();
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
