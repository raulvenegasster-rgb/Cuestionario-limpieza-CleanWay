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

/* ---------- Preguntas (Clean Way) ---------- */
const preguntas: Pregunta[] = [
  { id: 1, texto: "¿Cuentas con un programa de limpieza certificado (p. ej. ISO 9001)?" },
  { id: 2, texto: "¿Tu proveedor garantiza la asistencia para que la operación nunca se detenga?" },
  { id: 3, texto: "¿Existen rutas y checklists documentados por tipo de área (oficina, industria, retail, salud, educación)?" },
  { id: 4, texto: "¿Se ejecutan auditorías internas con evidencia (bitácoras/fotos) y acciones correctivas?" },
  { id: 5, texto: "¿Tienes abastecimiento continuo de insumos con opciones biodegradables?" },
  { id: 6, texto: "¿Cuentas con planes de contingencia para ausencias e incidencias críticas?" },
  { id: 7, texto: "¿Monitoreas indicadores por zona/turno (cumplimiento, retrabajos, quejas)?" },
  { id: 8, texto: "¿La supervisión realiza rondines digitales con evidencia fotográfica?" },
  { id: 9, texto: "¿El personal tiene capacitación vigente (químicos, EPP, seguridad e higiene)?" },
  { id: 10, texto: "¿Existen protocolos para áreas sensibles (salud, laboratorios, alimentos) y control de accesos?" },
  { id: 11, texto: "¿Tienes trazabilidad de incidencias y tiempos de respuesta (SLA/SLT)?" },
  { id: 12, texto: "¿Cuentas con escalamiento 24/7 y atención ejecutiva para resolver desviaciones?" },
];

/* ---------- Textos y estilos por rango ---------- */
const textos: Record<"bajo" | "medio" | "alto", Rango> = {
  bajo: {
    badge: "Muy pobre",
    tono: "text-red-700",
    bg: "bg-red-50",
    heading: "❌ Necesitas estabilizar tu servicio de limpieza.",
    detail:
      "La evaluación evidencia incumplimientos en certificación, cobertura de asistencia, control operativo y protocolos para áreas críticas. " +
      "Continuar así incrementa hallazgos en auditorías, retrabajos, quejas internas y riesgos de higiene/seguridad. " +
      "Se requiere un plan inmediato de estabilización con responsables, métricas y fechas de cierre.",
  },
  medio: {
    badge: "Regular",
    tono: "text-amber-700",
    bg: "bg-amber-50",
    heading: "⚠️ Hay brechas que atender.",
    detail:
      "Existen avances, pero se observan brechas en estandarización por tipo de área, evidencia de cumplimiento, indicadores, " +
      "y respuesta a incidencias. Corregirlas reduce retrabajos y quejas, y evita hallazgos en auditorías. " +
      "Implementa rutas, checklists, rondines con evidencia y escalamiento claro.",
  },
  alto: {
    badge: "Sólido",
    tono: "text-emerald-700",
    bg: "bg-emerald-50",
    heading: "🚿 Tienes un servicio de limpieza sólido.",
    detail:
      "¡Muy bien! Tienes certificación y/o programa formal, cobertura de asistencia garantizada, rutas y checklists por tipo de área, " +
      "auditorías internas con evidencia, abastecimiento con opciones biodegradables, indicadores por zona y escalamiento 24/7. " +
      "Esto asegura continuidad operativa, higiene y cumplimiento ante auditorías.",
  },
} as const;

/* ---------- Reglas de rango ---------- */
function rango(total: number): Rango {
  if (total <= 11) return textos.bajo;
  if (total <= 18) return textos.medio;
  return textos.alto;
}

/* ---------- Panel de resultado ---------- */
function ResultadoPanel({ data, total }: { data: Rango; total: number }) {
  return (
    <section className={`rounded-2xl p-5 ${data.bg}`}>
      <div className="flex items-center gap-2 text-xs text-neutral-600">
        <p className="font-semibold text-neutral-800">RESULTADO:</p>
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 font-semibold ${data.tono}`}
        >
          {data.badge}
        </span>
        <span className="ml-auto">| Total: {total} / 24</span>
      </div>

      <p className={`mt-3 font-bold ${data.tono}`}>{data.heading}</p>
      <p className="mt-2">{data.detail}</p>
    </section>
  );
}

/* ---------- Modal simple ---------- */
function Modal({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <div className="mx-auto mt-20 w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [respuestas, setRespuestas] = useState<Record<number, number | null>>({});
  const [openModal, setOpenModal] = useState(false);

  const total = useMemo(
    () => preguntas.reduce((acc, p) => acc + (respuestas[p.id] ?? 0), 0),
    [respuestas]
  );

  const faltantes = useMemo(
    () => preguntas.filter((p) => respuestas[p.id] === undefined || respuestas[p.id] === null).length,
    [respuestas]
  );

  const data = rango(total);

  const setValor = (id: number, val: number) => {
    setRespuestas((prev) => ({ ...prev, [id]: val }));
  };

  const reiniciar = () => {
    setRespuestas({});
    setOpenModal(false);
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
    a.download = "cuestionario_limpieza_cleanway.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Abre el modal automáticamente cuando se completen todas las preguntas
  useEffect(() => {
    if (faltantes === 0 && preguntas.length > 0) {
      setOpenModal(true);
    }
  }, [faltantes]);

  return (
    <>
      {/* Fondo desde /public */}
      <div
        className="fixed inset-0 -z-10 bg-[url('/fondo_clean.png')] bg-cover bg-center bg-no-repeat"
        aria-hidden="true"
      />
      {/* Velo opcional para mejorar legibilidad (ajusta el /40 a tu gusto) */}
      <div className="fixed inset-0 -z-10 bg-white/50" aria-hidden="true" />

      <main className="mx-auto max-w-3xl p-6">
        {/* Header con logo y acciones */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/CLEANWAY_logo.png" alt="Clean Way" className="h-24 sm:h-28" />
            </div>

            <div className="flex gap-2 print:hidden">
              <button
                onClick={reiniciar}
                className="rounded-xl bg-white px-3 py-2 shadow hover:bg-neutral-50"
              >
                Reiniciar
              </button>
              <button
                onClick={exportarCSV}
                className="rounded-xl bg-white px-3 py-2 shadow hover:bg-neutral-50"
              >
                Exportar CSV
              </button>
              <button
                onClick={imprimir}
                className="rounded-xl bg-black px-3 py-2 text-white shadow hover:opacity-90"
              >
                Imprimir / PDF
              </button>
            </div>
          </div>

          <h1 className="mt-4 text-2xl font-bold">
            ¿Qué tan robusto es tu servicio de limpieza?
          </h1>
          <p className="text-sm text-neutral-600">
            Responde este diagnóstico y detecta brechas en certificación, control operativo y continuidad del servicio.
          </p>
        </header>

        {/* Estado superior */}
        <div className="mb-3 text-sm text-neutral-600">
          Total: <span className="font-semibold">{total}</span> / 24 ·{" "}
          Faltantes: <span className="font-semibold">{faltantes}</span>
        </div>

        {/* Lista de preguntas */}
        <div className="space-y-4">
          {preguntas.map((p) => (
            <div key={p.id} className="rounded-xl border bg-white/90 p-4 shadow">
              <p className="font-medium">
                {p.id}. {p.texto}
              </p>
              <div className="mt-2 flex gap-6">
                {[{ label: "Sí", val: 2 }, { label: "Parcial", val: 1 }, { label: "No", val: 0 }].map(
                  (opt) => (
                    <label key={opt.val} className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name={`q_${p.id}`}
                        value={opt.val}
                        checked={respuestas[p.id] === opt.val}
                        onChange={() => setValor(p.id, opt.val)}
                        className="h-4 w-4"
                      />
                      <span>{opt.label}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal de resultado */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Resultado del diagnóstico"
      >
        <ResultadoPanel data={data} total={total} />
        <div className="mt-5 flex justify-end gap-2 print:hidden">
          <button
            onClick={() => setOpenModal(false)}
            className="rounded-xl bg-white px-3 py-2 shadow hover:bg-neutral-50"
          >
            Cerrar
          </button>
          <button
            onClick={imprimir}
            className="rounded-xl bg-black px-3 py-2 text-white shadow hover:opacity-90"
          >
            Imprimir / PDF
          </button>
          <button
            onClick={reiniciar}
            className="rounded-xl bg-neutral-900 px-3 py-2 text-white shadow hover:bg-neutral-800"
          >
            Reiniciar cuestionario
          </button>
        </div>
      </Modal>
    </>
  );
}

