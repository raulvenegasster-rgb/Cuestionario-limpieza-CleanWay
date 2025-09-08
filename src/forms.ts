// src/forms.ts
export type Pregunta = { id: number; texto: string };

// ——— Formulario: Transporte (el actual) ———
export const preguntasTransporte: Pregunta[] = [
  { id: 1,  texto: '¿Recibes reportes de puntualidad por ruta y unidad con indicadores claros?' },
  { id: 2,  texto: '¿Tu proveedor garantiza al menos un 90% de cumplimiento en horarios?' },
  { id: 3,  texto: '¿Tus empleados viajan en unidades recientes, con clima funcionando y mantenimiento preventivo al día?' },
  { id: 4,  texto: '¿Te consta que los choferes cuentan con capacitación en manejo defensivo y protocolos de seguridad?' },
  { id: 5,  texto: 'Imagina un empleado con una hora de traslado diario; ¿las unidades ofrecen comodidad suficiente para que llegue con buen ánimo y energía?' },
  { id: 6,  texto: '¿Tu proveedor entiende que el transporte influye en la rotación y el compromiso del personal?' },
  { id: 7,  texto: '¿Tienes certeza de que, si falla una unidad, recibirás reposición inmediata?' },
  { id: 8,  texto: '¿Existen protocolos probados para incidentes en ruta o bloqueo?' },
  { id: 9,  texto: '¿Puedes contactar a más de una persona responsable en caso de incidencia?' },
  { id: 10, texto: '¿Tu proveedor tiene 3 niveles de escalación (operador, coordinador, dirección) para resolver rápido?' },
  { id: 11, texto: '¿Cuentas con acceso a monitoreo en tiempo real de tus unidades?' },
  { id: 12, texto: '¿Puedes saber quién subió y quién no a cada unidad al inicio del turno?' },
];

// ——— Formulario: Clean Way (desde tu brochure) ———
export const preguntasCleanWay: Pregunta[] = [
  { id: 1,  texto: '¿Tu proveedor cuenta con procesos certificados (ISO 9001 o equivalente) y te comparte la evidencia aplicable al servicio?' },
  { id: 2,  texto: '¿Existe un programa de limpieza personalizado por área, con frecuencias, métodos y responsables claramente visibles para ti?' },
  { id: 3,  texto: '¿Tienes cobertura garantizada de asistencia por turno, con reemplazos documentados ante ausencias y plan de contingencia?' },
  { id: 4,  texto: '¿Los servicios especiales o fuera de horario se atienden sin afectar la operación diaria?' },
  { id: 5,  texto: '¿Se realiza supervisión en sitio con checklist y evidencia fotográfica disponible cuando la solicitas?' },
  { id: 6,  texto: '¿Cuentas con una bitácora digital (app/QR) para levantar solicitudes e incidencias con hora de apertura y cierre?' },
  { id: 7,  texto: '¿Recibes indicadores mensuales (cumplimiento del programa, tiempos de cierre, no conformidades) y acciones correctivas?' },
  { id: 8,  texto: '¿El personal opera con inducción de seguridad del sitio, EPP y señalización adecuada, auditables?' },
  { id: 9,  texto: '¿Se administra control de insumos y equipos con reabasto programado y hojas de seguridad/fichas técnicas accesibles?' },
  { id: 10, texto: '¿Tu proveedor ofrece insumos biodegradables y puede evidenciar su uso cuando lo requieres?' },
  { id: 11, texto: '¿Aplican protocolos específicos por sector (industria, salud, HORECA, educativo, post-construcción) y los comunican al personal?' },
  { id: 12, texto: '¿Se realiza una revisión periódica de servicio (comité o QBR) con compromisos y fechas para la mejora continua?' },
];

// ——— Config por formulario ———
export const FORMS = {
  transporte: {
    titulo: 'Cuestionario de Transporte',
    subtitulo: 'Puntaje por pregunta: Sí = 2, Parcial = 1, No = 0. Total máximo 24.',
    logo: '/quokka-logo.png',
    preguntas: preguntasTransporte,
  },
  cleanway: {
    titulo: 'Diagnóstico de Limpieza | Clean Way',
    subtitulo: 'Programa certificado, cobertura garantizada y trazabilidad. Total máximo 24.',
    logo: '/cleanway-logo.png',
    preguntas: preguntasCleanWay,
  },
} as const;

export type FormKey = keyof typeof FORMS;
