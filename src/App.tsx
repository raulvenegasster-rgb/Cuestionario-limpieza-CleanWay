import { useEffect, useMemo, useState } from "react";
import logo from "./assets/CLEANWAY_logo.png";
import fondo from "./assets/fondo_clean.png";

/* ---------- Tipos ---------- */
type Pregunta = { id: number; texto: string };

type Rango = {
  badge: "Muy pobre" | "Regular" | "Sólido";
  tono: string;
  bg: string;
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
  { id: 6, texto: "¿El personal operativo está capacitado y certificado en técnicas y químicos de limpieza?" },
  { id: 7, texto: "¿Cuentan con control de asistencia (biométrico o geolocalizado) para evitar fraudes?" },
  { id: 8, texto: "¿Tienes escalamiento 24/7 (operador, coordinador, dirección) para incidentes y quejas?" },
  { id: 9, texto: "¿Se atienden incidencias en menos de 2 horas con plan de contención?" },
  { id: 10, texto: "¿Se cumple con normativas de seguridad y salud (EPP, MSDS, inducciones)?" },
  { id: 11, texto: "¿Recibes reportes de desempeño y hallazgos con indicadores claros (KPI)?" },
  { id: 12, texto: "¿Hay trazabilidad de reemplazos y rotación para cubrir ausencias sin afectar el servicio?" },
];

/* ---------- Textos por rango ---------- */
const textos: Record<"bajo" | "medio" | "alto", Rango> = {
  bajo: {
    badge: "Muy pobre",
    tono: "text-red-700",
    bg: "bg-red-50",
    heading: "❌ Tu esquema de limpieza requiere intervención inmediata.",
    detail:
      "Se observan brechas en certificación, asistencia garantizada, control operativo y escalamiento. " +
      "Esto incrementa riesgos de incumplimiento, auditorías con hallazgos, incidentes y costos ocultos. " +
      "Implementa un plan de estabilización con responsables, métricas y fechas de cierre; prioriza checklists, control de asistencia y abastecimiento.",
  },
  medio: {
    badge: "Regular",
    tono: "text-amber-700",
    bg: "bg-amber-50",
    heading: "⚠️ Hay oportunidades importantes de mejora.",
    detail:
      "Tu operación muestra cubiertas varias prácticas, pero existen huecos en auditorías, escalamiento 24/7, trazabilidad y controles de desempeño. " +
      "Cerrarlos elevará la calidad, reducirá reclamos y te blindará ante inspecciones. Define planes de acción y supervisión efectiva.",
  },
  alto: {
    badge: "Sólido",
    tono: "text-emerald-700",
    bg: "bg-emerald-50",
    heading: "✅ Tienes un esquema de limpieza sólido.",
    detail:
      "Cuentas con certificación, asistencia garantizada, auditorías, control de asistencia, escalamiento 24/7, " +
      "KPI y trazabilidad de reemplazos. Mantén la mejora continua con revisiones periódicas y retroalimentación del cliente interno.",
  },
} as const;

/* ---------- Reglas de rango ---------- */
function rango(total: number): Rango {
  if (total <= 11) return textos.bajo;
  if (total <= 18) return textos.medio;
  return textos.alto;
}

/* ---------- Modal ---------- */
function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <button
          className="absolute right-3 top-3 rounded px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-100"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

/* ---------- Panel de resultado ---------- */
function ResultadoPanel({ data, total }: { data: Rango; total: number }) {
  return (
    <section className={`rounded-2xl p-5 ${data.bg}`}>
      <p className="text-sm font-semibold tracking-wide">
        RESULTADO:{" "}
        <span
          className={`ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${data.tono}`}
        >
          {data.badge}
        </span>{" "}
        <span className="text-neutral-500">| Total: {total} / 24</span>
      </p>
      <p className={`mt-3 font-bold ${data.tono}`}>{data.heading}</p>
      <p className="mt-2">{data.detail}</p>
    </section>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [respuestas, setRespuestas] = useState<Record<number, number | null>>({});
  const [modalAbierto, setModalAbierto] = useState(false);

  const total = useMemo(
    () => preguntas.reduce((acc, p) => acc + (respuestas[p.id] ?? 0), 0),
    [respuestas]
  );
  const faltantes = useMemo(
    () => preguntas.filter((p) => respuestas[p.id] == null).length,
    [respuestas]
  );
  const data = rango(total);

  const setValor = (id: number, val: number) => setRespuestas((prev) => ({ ...prev, [id]: val }));
  const reiniciar = () => { setRespuestas({}); setModalAbierto(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const imprimir = () => window.print();

  const exportarCSV = () => {
    const encabezados = ["Pregunta", "Respuesta (2=Sí,1=Parcial,0=No)"];
    const filas = preguntas.map((p) => [p.texto.replace(/;/g, ","), String(respuestas[p.id] ?? 0)]);
    filas.push(["TOTAL", String(total)]);
    const csv = [encabezados, ...filas].map((arr) => arr.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cuestionario_cleanway.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => { if (faltantes === 0) setModalAbierto(true); }, [faltantes]);

  return (
    <>
      {/* Fondo usando import */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${fondo})` }}
        aria-hidden="true"
      />
      <div className="fixed inset-0 -z-10 bg-white/55" aria-hidden="true" />

      <main className="mx-auto max-w-3xl p-6">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Clean Way" className="h-10 sm:h-12" />
            </div>

            <div className="flex gap-2 print:hidden">
              <button onClick={reiniciar} className="rounded-xl bg-white px-3 py-2 shadow hover:bg-neutral-50">
                Reiniciar
              </button>
              <button onClick={exportarCSV} className="rounded-xl bg-white px-3 py-2 shadow hover:bg-neutral-50">
                Exportar CSV
              </button>
              <button onClick={imprimir} className="rounded-xl bg-black px-3 py-2 text-white shadow hover:opacity-90">
                Imprimir / PDF
              </button>
            </div>
          </div>

          <h1 className="mt-4 text-2xl font-bold">¿Qué tan robusto es tu servicio de limpieza?</h1>
          <p className="text-sm text-neutral-600">
            Responde este diagnóstico y detecta brechas en certificación, control operativo y continuidad del servicio.
          </p>

          <div className="mt-3 text-sm text-neutral-600">
            Total: <span className="font-semibold">{total}</span> / 24 · Faltantes:{" "}
            <span className="font-semibold">{faltantes}</span>
          </div>
        </header>

        <div className="space-y-4">
          {preguntas.map((p) => (
            <div key={p.id} className="rounded-xl border bg-white/90 p-4 shadow">
              <p className="font-medium">{p.id}. {p.texto}</p>
              <div className="mt-2 flex gap-6">
                {[{ label: "Sí", val: 2 }, { label: "Parcial", val: 1 }, { label: "No", val: 0 }].map((opt) => (
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
                ))}
              </div>
            </div>
          ))}
        </div>

        <Modal open={modalAbierto} onClose={() => setModalAbierto(false)}>
          <ResultadoPanel data={data} total={total} />
          <div className="mt-4 flex justify-end gap-2 print:hidden">
            <button onClick={() => setModalAbierto(false)} className="rounded-xl bg-white px-3 py-2 shadow hover:bg-neutral-50">
              Cerrar
            </button>
            <button onClick={imprimir} className="rounded-xl bg-black px-3 py-2 text-white shadow hover:opacity-90">
              Imprimir / PDF
            </button>
          </div>
        </Modal>
      </main>
    </>
  );
}
