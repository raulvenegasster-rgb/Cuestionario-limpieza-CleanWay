import { useEffect, useMemo, useState } from "react";

/* ---------- Tipos ---------- */
type Pregunta = { id: number; texto: string };

type Rango = {
  badge: "Muy pobre" | "Regular" | "Sólido";
  tono: string;   // clases de color de texto
  bg: string;     // clases de fondo del panel
  heading: string;
  detail: string;
};

/* ---------- Preguntas ---------- */
const preguntas: Pregunta[] = [
  { id: 1, texto: "¿Recibes reportes de puntualidad por ruta y unidad con indicadores claros?" },
  { id: 2, texto: "¿Tu proveedor garantiza al menos un 95% de cumplimiento en horarios?" },
  { id: 3, texto: "¿Tus empleados viajan en unidades recientes, con clima y mantenimiento preventivo al día?" },
  { id: 4, texto: "¿Los choferes cuentan con capacitación en manejo defensivo y protocolos de seguridad?" },
  { id: 5, texto: "¿Las unidades ofrecen comodidad suficiente para llegadas con buen ánimo y energía?" },
  { id: 6, texto: "¿El proveedor entiende que el transporte influye en la rotación y el compromiso del personal?" },
  { id: 7, texto: "Si falla una unidad, ¿recibes reposición inmediata?" },
  { id: 8, texto: "¿Existen protocolos probados para incidentes en ruta o bloqueos?" },
  { id: 9, texto: "¿Puedes contactar a más de una persona responsable en caso de incidencia?" },
  { id: 10, texto: "¿Hay tres niveles de escalación (operador, coordinador, dirección) para resolver rápido?" },
  { id: 11, texto: "¿Cuentas con acceso a monitoreo en tiempo real de tus unidades?" },
  { id: 12, texto: "¿Puedes saber quién subió y quién no al inicio del turno?" },
];

/* ---------- Textos y estilos por rango ---------- */
const textos: Record<"bajo" | "medio" | "alto", Rango> = {
  bajo: {
    badge: "Muy pobre",
    tono: "text-red-700",
    bg: "bg-red-50",
    heading: "❌ Necesitas revisar tu servicio de transporte.",
    detail:
      "Definitivamente hay incumplimientos recurrentes en puntualidad por ruta/unidad, cobertura de turnos, protocolos de contingencia y control operativo. " +
      "Persistir con este nivel de servicio impacta el estado de ánimo desde el abordaje, reduce el desempeño en turno, eleva costos (horas extra, reprocesos) " +
      "y expone a la empresa a riesgos de seguridad y reputacionales. Se requiere un plan inmediato de estabilización con responsables, métricas y fechas de cierre.",
  },
  medio: {
    badge: "Regular",
    tono: "text-amber-700",
    bg: "bg-amber-50",
    heading: "⚠️ Hay cosas que mejorar.",
    detail:
      "Hay evidentes brechas en confiabilidad operativa y control del servicio: puntualidad por ruta/unidad variable, cobertura incompleta y protocolos " +
      "de contingencia poco robustos. Mantener estas brechas incrementa tardanzas y ausentismo, afecta el estado de ánimo desde el abordaje, reduce desempeño y eleva costos. " +
      "Corregir de inmediato estabiliza el servicio y mejora la experiencia laboral desde el primer contacto del día.",
  },
  alto: {
    badge: "Sólido",
    tono: "text-emerald-700",
    bg: "bg-emerald-50",
    heading: "🚍 Tienes un transporte de personal sólido.",
    detail:
      "¡Felicidades! Tienes un nivel alto de cumplimiento en puntualidad por ruta, cobertura de turnos, protocolos de contingencia, " +
      "mantenimiento y seguridad de unidades, además de esquemas claros de escalación y atención ejecutiva. La operación cuenta con trazabilidad y reportes " +
      "suficientes para asegurar continuidad y mejora continua.",
  },
} as const;

/* ---------- Reglas de rango ---------- */
function rango(total: number): Rango {
  if (total <= 11) return textos.bajo;
  if (total <= 18) return textos.medio;
  return textos.alto;
}

/* ---------- App ---------- */
export default function App() {
  const [respuestas, setRespuestas] = useState<Record<number, number | null>>({});
  const [showModal, setShowModal] = useState(false);

  const total = useMemo(
    () => preguntas.reduce((acc, p) => acc + (respuestas[p.id] ?? 0), 0),
    [respuestas]
  );

  const faltantes = useMemo(
    () => preguntas.filter((p) => respuestas[p.id] === undefined || respuestas[p.id] === null).length,
    [respuestas]
  );

  const data = rango(total);
  const completo = faltantes === 0 && Object.keys(respuestas).length === preguntas.length;

  const setValor = (id: number, val: number) => {
    setRespuestas((prev) => ({ ...prev, [id]: val }));
  };

  const reiniciar = () => {
    setRespuestas({});
    setShowModal(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const imprimir = () => window.print();

  const exportarCSV = () => {
    const encabezados = ["Pregunta", "Respuesta (2=Sí,1=Parcial,0=No)"];
    const filas = preguntas.map((p) => [
      p.texto.replace(/;/g, ","),
      String(respuestas[p.id] ?? 0),
    ]);
    filas.push(["TOTAL", String(total)]);
    const csv = [encabezados, ...filas].map((arr) => arr.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cuestionario_transporte.csv";
    a.click();
    URL.r
