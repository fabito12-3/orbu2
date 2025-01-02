let currentMonth = new Date().getUTCMonth();  // Mes actual en UTC (0 = enero, 11 = diciembre)
let currentYear = new Date().getUTCFullYear();  // Año actual en UTC
const timezoneOffset = -5; // Desfase de hora UTC-5 (Colombia)
let selectedDate = null; // Variable para almacenar la fecha seleccionada
let temporadaAlta = [];  // Array para almacenar los intervalos de temporada alta
let reservedDates = [];
const serverUrl = 'http://localhost:3000/';  // Cambia esta URL por la de tu servidor

// Función para ajustar la fecha a UTC-5 (Colombia)
function adjustToColombiaTimezone(date) {
  const localDate = new Date(date);
  localDate.setHours(localDate.getHours() + timezoneOffset); // Ajustamos la hora a UTC-5
  return localDate;
}

// Función para cargar las temporadas altas desde el archivo JSON
function loadTemporadaAlta() {
  fetch('/json/temporada-alta.json')
    .then(response => response.json())
    .then(data => {
      temporadaAlta = data.intervalos;
      // Generar calendario después de cargar los datos de temporada alta
      fetchReservedDates(); // Llamar a la función para cargar las fechas reservadas después de cargar temporada alta
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

async function fetchReservedDates() {
  try {
    const response = await fetch(serverUrl);
    const data = await response.json();

    // Si la respuesta tiene los intervalos, actualizamos la lista
    if (data && data.intervalos) {
      reservedDates = data.intervalos.map(interval => {
        const startDate = new Date(interval.inicio);
        const endDate = new Date(interval.fin);
        return {
          inicio: interval.inicio,
          fin: endDate.toISOString().split('T')[0]  // Convertir a formato 'YYYY-MM-DD'
        };
      });

      console.log("Fechas reservadas recibidas:", reservedDates);
      generateCalendar(currentMonth, currentYear); // Generar calendario después de obtener las fechas reservadas
    } else {
      console.error("No se encontraron intervalos en la respuesta del servidor");
    }
  } catch (error) {
    console.error("Error al obtener los intervalos del servidor:", error);
  }
}

// Función para verificar si una fecha está dentro de los intervalos de temporada alta
function isSeasonHigh(day, month, year) {
  const date = new Date(year, month, day); // Crear la fecha del día actual
  return temporadaAlta.some(interval => {
    const startDate = new Date(interval.inicio);
    const endDate = new Date(interval.fin);
    return date >= startDate && date <= endDate; // Verificar si está dentro del intervalo
  });
}

// Función para generar el calendario
function generateCalendar(month, year) {
  const calendarContainer = document.getElementById("calendar");
  const mesLabel = document.getElementById("mes");

  // Ajustamos la fecha a UTC-5
  const firstDay = adjustToColombiaTimezone(new Date(Date.UTC(year, month, 1))).getDay(); // Día de la semana
  const lastDate = new Date(year, month + 1, 0).getUTCDate(); // Último día del mes en UTC

  // Cambiar el título del mes
  mesLabel.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;

  // Limpiar el calendario
  calendarContainer.innerHTML = `
    <div class="grid-cell grid-cell-days">L</div>
    <div class="grid-cell grid-cell-days">M</div>
    <div class="grid-cell grid-cell-days">M</div>
    <div class="grid-cell grid-cell-days">J</div>
    <div class="grid-cell grid-cell-days">V</div>
    <div class="grid-cell grid-cell-days">S</div>
    <div class="grid-cell grid-cell-days">D</div>
  `;

  // Agregar celdas vacías antes de los días reales
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("grid-cell");
    calendarContainer.appendChild(emptyCell);
  }

  // Agregar los días del mes
  const today = new Date();
  for (let day = 1; day <= lastDate; day++) {
    const dayCell = document.createElement("div");
    dayCell.classList.add("grid-cell");
    dayCell.textContent = day;

    // Verificar si es el día de hoy
    const isToday = today.getUTCDate() === day && today.getUTCMonth() === month && today.getUTCFullYear() === year;
    const isPastDay = new Date(year, month, day) < today;

    if (isToday) {
      dayCell.classList.add("today");  // Agregar clase 'today' si es el día actual
    }

    if (isPastDay) {
      dayCell.classList.add("past"); // Agregar clase 'past' si es un día pasado
      dayCell.onclick = () => {}; // Deshabilitar la selección de días pasados
    } else {
      dayCell.onclick = () => selectDay(day, month, year, dayCell); // Añadir el evento de selección de día
    }

    // Verificar si es temporada alta
    if (isSeasonHigh(day, month, year)) {
      dayCell.classList.add("high-season");  // Agregar clase 'high-season' si es temporada alta
    }

    // Verificar si el día está reservado
    if (isDateReserved(year, month, day)) {
      dayCell.classList.add("reserved"); // Marcar los días reservados
    }

    calendarContainer.appendChild(dayCell);
  }

  // Agregar celdas vacías después del último día para completar la cuadrícula
  const totalCells = firstDay + lastDate;
  const remainingCells = 42 - totalCells; // 42 celdas para llenar la cuadrícula 7x6
  for (let i = 0; i < remainingCells; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("grid-cell");
    calendarContainer.appendChild(emptyCell);
  }
}

// Función para verificar si un día está reservado
function isDateReserved(year, month, day) {
  const targetDate = new Date(year, month, day);

  // Comprobamos si el día está dentro de alguno de los intervalos reservados
  return reservedDates.some(interval => {
    const start = new Date(interval.inicio);
    const end = new Date(interval.fin);

    // Comparar si la fecha está dentro del intervalo (ya con el día adicional agregado)
    return targetDate >= start && targetDate <= end;
  });
}

// Función para manejar la selección de un día
function selectDay(day, month, year, cell) {
  // Si ya hay un día seleccionado, lo deseleccionamos
  if (selectedDate) {
    const previousSelectedCell = document.querySelector(".grid-cell.selected");
    if (previousSelectedCell) {
      previousSelectedCell.classList.remove("selected");
    }
  }

  // Resaltar el nuevo día seleccionado
  cell.classList.add("selected");

  // Almacenar la fecha seleccionada
  selectedDate = new Date(year, month, day);
  console.log("Fecha seleccionada:", selectedDate);
}

// Cambiar de mes
function changeMonth(increment) {
  currentMonth += increment;

  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  } else if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }

  generateCalendar(currentMonth, currentYear);  // Volver a generar el calendario
}

// Iniciar la carga de datos
loadTemporadaAlta();  // Cargar las temporadas altas