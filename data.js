/* 
   data.js · Capa de datos compartida
   */

const STORAGE_KEY = 'servicedesk_solicitudes';

/* Datos semilla: se cargan la primera vez */
const solicitudesIniciales = [
  {
    id: 'SD-001',
    titulo: 'Equipo no enciende',
    solicitante: 'Ana Torres',
    categoria: 'hardware',
    prioridad: 'alta',
    responsable: 'Sin asignar',
    estado: 'abierta',
    fecha: '2026-08-20'
  },
  {
    id: 'SD-002',
    titulo: 'Error al abrir aplicación',
    solicitante: 'Luis Peña',
    categoria: 'software',
    prioridad: 'media',
    responsable: 'Camilo Forero',
    estado: 'en-proceso',
    fecha: '2026-08-21'
  },
  {
    id: 'SD-003',
    titulo: 'Sin conexión a la red',
    solicitante: 'Marta Gil',
    categoria: 'red',
    prioridad: 'alta',
    responsable: 'Juan Esteban Arias',
    estado: 'cerrada',
    fecha: '2026-08-19'
  },
  {
    id: 'SD-004',
    titulo: 'Acceso a correo bloqueado',
    solicitante: 'Carlos Rojas',
    categoria: 'cuentas',
    prioridad: 'urgente',
    responsable: 'Sin asignar',
    estado: 'abierta',
    fecha: '2026-08-22'
  }
];

/* ---------- Persistencia ---------- */

function cargarSolicitudes() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(solicitudesIniciales));
    return [...solicitudesIniciales];
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Datos corruptos en localStorage, restaurando semilla.');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(solicitudesIniciales));
    return [...solicitudesIniciales];
  }
}

function guardarSolicitudes(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

function agregarSolicitud(datos) {
  const lista = cargarSolicitudes();
  const nuevoId = generarId(lista);
  const nueva = { id: nuevoId, ...datos };
  lista.push(nueva);
  guardarSolicitudes(lista);
  return nueva;
}

function generarId(lista) {
  const numeros = lista
    .map(s => parseInt(String(s.id).replace(/\D/g, ''), 10))
    .filter(n => !isNaN(n));
  const max = numeros.length ? Math.max(...numeros) : 0;
  return 'SD-' + String(max + 1).padStart(3, '0');
}

/* ---------- Etiquetas legibles ---------- */

const ETIQUETAS = {
  estado: {
    'abierta': 'Abierta',
    'en-proceso': 'En proceso',
    'resuelta': 'Resuelta',
    'cerrada': 'Cerrada'
  },
  prioridad: {
    'baja': 'Baja',
    'media': 'Media',
    'alta': 'Alta',
    'urgente': 'Urgente'
  },
  categoria: {
    'hardware': 'Hardware',
    'software': 'Software',
    'red': 'Red',
    'cuentas': 'Cuentas y accesos',
    'otro': 'Otro'
  }
};

function etiqueta(tipo, valor) {
  return (ETIQUETAS[tipo] && ETIQUETAS[tipo][valor]) || valor;
}