/* ===========================================================
   data.js · Capa de datos compartida (módulo ES)
   =========================================================== */

const STORAGE_KEY          = 'servicedesk_solicitudes';
const STORAGE_KEY_TECNICOS = 'servicedesk_tecnicos';

/* ---------- Datos semilla ---------- */

const solicitudesIniciales = [
  {
    id: 'SD-001',
    titulo: 'Equipo no enciende',
    solicitante: 'Ana Torres',
    categoria: 'hardware',
    prioridad: 'alta',
    responsable: 'Sin asignar',
    equipo: '',
    estado: 'abierta',
    fecha: '2026-08-20',
    historial: [{ fecha: '2026-08-20', texto: 'Solicitud reportada por Ana Torres' }],
    solucion: '',
    fechaCierre: '',
    satisfaccion: ''
  },
  {
    id: 'SD-002',
    titulo: 'Error al abrir aplicación',
    solicitante: 'Luis Peña',
    categoria: 'software',
    prioridad: 'media',
    responsable: 'Camilo Forero',
    equipo: 'Soporte Nivel 1',
    estado: 'en-proceso',
    fecha: '2026-08-21',
    historial: [
      { fecha: '2026-08-18', texto: 'Solicitud reportada por Luis Peña' },
      { fecha: '2026-08-19', texto: 'Asignada a Camilo Forero' },
      { fecha: '2026-08-20', texto: 'Diagnóstico iniciado' }
    ],
    solucion: '',
    fechaCierre: '',
    satisfaccion: ''
  },
  {
    id: 'SD-003',
    titulo: 'Sin conexión a la red',
    solicitante: 'Marta Gil',
    categoria: 'red',
    prioridad: 'alta',
    responsable: 'Juan Esteban Arias',
    equipo: 'Soporte Nivel 1',
    estado: 'cerrada',
    fecha: '2026-08-19',
    historial: [
      { fecha: '2026-08-18', texto: 'Solicitud reportada por Marta Gil' },
      { fecha: '2026-08-19', texto: 'Asignada a Juan Esteban Arias' },
      { fecha: '2026-08-19', texto: 'Solicitud cerrada. Solución: se reinició el switch' }
    ],
    solucion: 'Se reinició el switch del piso',
    fechaCierre: '2026-08-19',
    satisfaccion: 'satisfecho'
  },
  {
    id: 'SD-004',
    titulo: 'Acceso a correo bloqueado',
    solicitante: 'Carlos Rojas',
    categoria: 'cuentas',
    prioridad: 'urgente',
    responsable: 'Sin asignar',
    equipo: '',
    estado: 'abierta',
    fecha: '2026-08-22',
    historial: [{ fecha: '2026-08-22', texto: 'Solicitud reportada por Carlos Rojas' }],
    solucion: '',
    fechaCierre: '',
    satisfaccion: ''
  }
];

const tecnicosIniciales = [
  { id: 'TEC-001', nombre: 'Juan Esteban Arias', area: 'Soporte Nivel 1' },
  { id: 'TEC-002', nombre: 'Camilo Forero',      area: 'Soporte Nivel 1' },
  { id: 'TEC-003', nombre: 'Soporte Nivel 2',    area: 'Soporte Nivel 2' }
];

/* ---------- Normalización ---------- */

function normalizarSolicitud(s) {
  return {
    equipo: '',
    historial: [],
    solucion: '',
    fechaCierre: '',
    satisfaccion: '',
    ...s
  };
}

/* ---------- Persistencia: solicitudes ---------- */

export function cargarSolicitudes() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(solicitudesIniciales));
    return solicitudesIniciales.map(normalizarSolicitud);
  }
  try {
    return JSON.parse(raw).map(normalizarSolicitud);
  } catch (e) {
    console.warn('Datos corruptos, restaurando semilla.');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(solicitudesIniciales));
    return solicitudesIniciales.map(normalizarSolicitud);
  }
}

export function guardarSolicitudes(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

export function agregarSolicitud(datos) {
  const lista = cargarSolicitudes();
  const nuevoId = generarId(lista);
  const nueva = {
    id: nuevoId,
    responsable: 'Sin asignar',
    equipo: '',
    estado: 'abierta',
    historial: [{
      fecha: datos.fecha || new Date().toISOString().split('T')[0],
      texto: `Solicitud reportada por ${datos.solicitante || 'usuario'}`
    }],
    solucion: '',
    fechaCierre: '',
    satisfaccion: '',
    ...datos
  };
  lista.push(nueva);
  guardarSolicitudes(lista);
  return nueva;
}

export function obtenerSolicitudPorId(id) {
  return cargarSolicitudes().find(s => s.id === id) || null;
}

export function actualizarSolicitud(id, cambios) {
  const lista = cargarSolicitudes();
  const idx = lista.findIndex(s => s.id === id);
  if (idx === -1) return null;
  lista[idx] = { ...lista[idx], ...cambios };
  guardarSolicitudes(lista);
  return lista[idx];
}

export function agregarAvance(id, texto, nuevoEstado) {
  const lista = cargarSolicitudes();
  const idx = lista.findIndex(s => s.id === id);
  if (idx === -1) return null;
  const sol = lista[idx];
  if (!sol.historial) sol.historial = [];
  sol.historial.push({
    fecha: new Date().toISOString().split('T')[0],
    texto: texto
  });
  if (nuevoEstado) sol.estado = nuevoEstado;
  lista[idx] = sol;
  guardarSolicitudes(lista);
  return sol;
}

export function generarId(lista) {
  const numeros = lista
    .map(s => parseInt(String(s.id).replace(/\D/g, ''), 10))
    .filter(n => !isNaN(n));
  const max = numeros.length ? Math.max(...numeros) : 0;
  return 'SD-' + String(max + 1).padStart(3, '0');
}

/* ---------- Persistencia: técnicos ---------- */

export function cargarTecnicos() {
  const raw = localStorage.getItem(STORAGE_KEY_TECNICOS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_TECNICOS, JSON.stringify(tecnicosIniciales));
    return [...tecnicosIniciales];
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    localStorage.setItem(STORAGE_KEY_TECNICOS, JSON.stringify(tecnicosIniciales));
    return [...tecnicosIniciales];
  }
}

export function guardarTecnicos(lista) {
  localStorage.setItem(STORAGE_KEY_TECNICOS, JSON.stringify(lista));
}

export function agregarTecnico(datos) {
  const lista = cargarTecnicos();
  const nuevoId = generarIdTecnico(lista);
  const nuevo = { id: nuevoId, ...datos };
  lista.push(nuevo);
  guardarTecnicos(lista);
  return nuevo;
}

export function generarIdTecnico(lista) {
  const numeros = lista
    .map(t => parseInt(String(t.id).replace(/\D/g, ''), 10))
    .filter(n => !isNaN(n));
  const max = numeros.length ? Math.max(...numeros) : 0;
  return 'TEC-' + String(max + 1).padStart(3, '0');
}

/* ---------- Etiquetas legibles ---------- */

export const ETIQUETAS = {
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
  },
  satisfaccion: {
    'satisfecho': 'Satisfecho',
    'neutral': 'Neutral',
    'insatisfecho': 'Insatisfecho'
  }
};

export function etiqueta(tipo, valor) {
  return (ETIQUETAS[tipo] && ETIQUETAS[tipo][valor]) || valor;
}