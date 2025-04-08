# **VERBO LOGIC**

### Un juego interactivo para desafiar tus habilidades de adivinanza.

## **Descripción**

Es un juego interactivo en el que el jugador debe adivinar una palabra oculta. El juego proporciona una serie de cuadros que representan las letras de la palabra seleccionada. El jugador debe ingresar la palabra completa y el sistema verificará si la palabra es correcta, brindando retroalimentación visual sobre el progreso. ¡Sigue intentando hasta descubrir la palabra y celebra tu victoria!

## **Características**

- Jugabilidad simple y dinámica.
- Interfaz visual que muestra el progreso del jugador.
- Retroalimentación en tiempo real sobre los intentos del jugador.
- Modal de felicitaciones cuando se adivina la palabra correctamente.
- Soporte para palabras con y sin acentos (normalización de texto).
- Reinicio rápido para volver a jugar.

## **Tecnologías Utilizadas**

- **HTML5**: Estructura y contenido de la página.
- **CSS3**: Diseño visual y estilos del juego.
- **JavaScript**: Lógica del juego, verificación de las palabras y manejo de eventos.
- **Font Awesome**: Iconos utilizados en el modal final.

## **Captura del Juego**

![Logo](https://raw.githubusercontent.com/jgcamiloaga/VerboLogic/refs/heads/main/img/foto_github.png)

## **Cómo Jugar**

1. Ingresa una palabra en el campo de texto.
2. Haz clic en el botón "Verificar" para comprobar si la palabra es correcta.
3. Observa el progreso en los cuadros de letras y el historial de intentos.
4. Si adivinas la palabra correctamente, aparecerá un mensaje de felicitación.
5. Puedes reiniciar el juego o volver al inicio desde el modal de victoria.

## **Instalación y Configuración**

Sigue estos pasos para clonar y ejecutar el proyecto localmente:

1. Clona este repositorio:
    ```bash
    git clone https://github.com/jgcamiloaga/VerboLogic.git
    ```
2. Navega al directorio del proyecto:
    ```bash
    cd VerboLogic
    ```
3. Abre el archivo `index.html` en tu navegador web favorito para comenzar a jugar.

## **Estructura del Proyecto**

```plaintext
├── img/                   # Carpeta de imágenes (iconos y otros recursos visuales)
├── script/
│   └── script.js          # Lógica principal del juego
├── styles/
│   └── style.css          # Estilos del juego
├── palabras.json          # Archivo con el listado de palabras
├── index.html             # Página de inicio del juego
├── PlayGame.html          # Página donde se desarrolla el juego
├── README.md              # Este archivo
