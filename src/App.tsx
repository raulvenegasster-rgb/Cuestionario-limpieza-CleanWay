import { useMemo, useState } from "react";

type Pregunta = { id: number; texto: string };

const preguntas: Pregunta[] = [
  { id: 1, texto: "¿Recibes reportes de puntualidad por ruta y unidad con indicadores claros?" },
  { id: 2, texto: "¿Tu proveedor garantiza al menos un 95% de cumplimiento en horarios?" },
  { id: 3, texto: "¿Tus empleados viajan en unidades recientes, con clima y mantenimiento preventivo al día?" },
  { id: 4, texto: "¿Te consta que los choferes cuentan con capacitación en manejo defensivo y protocolos de seguridad?" },
  { id: 5, texto: "¿Las unidades ofrecen comodidad suficiente para llegadas con buen ánimo y energía?" },
  { id: 6, texto: "¿El proveedor entiende que el transporte influye en la rotación y el compromiso del personal?" },
  { id: 7, texto: "Si falla una unidad, ¿recibes reposición inmediata?" },
  { id: 8, texto: "¿Existen protocolos probados para incidentes en ruta o bloqueos?" },
  { id: 9, texto: "¿Puedes contactar a más de una persona responsable en caso de incidencia?" },
  { id: 10, texto: "¿Tu proveedor tiene tres niveles de escalación (operador, coordinador, dirección) para resolver rápido?" },
  { id: 11, texto: "¿Cuentas con acceso a monitoreo en tiempo real de tus unidades?" },
  { id: 12, texto: "¿Puedes saber quién subió y quién no a cada unidad al inicio del turno?" },
];

type Rango = {
  badge: "Muy pobre" | "Regular" | "Sólido";
  tono: string;   // clase tailwind de texto
  bg: string;     // clase tailwind de fondo
  heading: string;
  detail: string;
};

const textos = {
  bajo: {
    badge: "Muy pobre",
    tono: "text-red-700",
    bg: "bg-red-50",
    heading: "❌ Necesitas revisar tu servicio de transporte.",
    detail:
      "La puntuación obtenida indica incumplimientos recurrentes en puntualidad por ruta/unidad, cobertura de turnos, protocolos de contingencia y control operativo. Persistir con este nivel de servicio impacta el estado de ánimo desde el abordaje, reduce el desempeño en turno, eleva costos (horas extra, reprocesos) y expone a la empresa a riesgos de seguridad y reputacionales. Se requiere un plan inmediato de estabilización con responsables, métricas y fechas de cierre.",
  },
  medio: {
    badge: "Mejorable",
    tono: "text-amber-700",
    bg: "bg-amber-50",
    heading: "⚠️ Hay cosas que mejorar.",
    detail:
      "La evaluación evidencia brechas en confiabilidad operativa y control del servicio: puntualidad por ruta/unidad variable, cobertura incompleta y protocolos de contingencia poco robustos. Mantener estas brechas incrementa tardanzas y ausentismo, afecta el estado de ánimo desde el abordaje, reduce desempeño y eleva costos (horas extra, reprocesos), además de riesgos de seguridad y reputacionales. Corregir de inmediato estabiliza el servicio y mejora la experiencia laboral desde el primer abordaje.",
  },
  alto: {
    badge: "Sólido",
    tono: "text-emerald-700",
    bg: "bg-emerald-50",
    heading: "🚍 Tienes un transporte de personal sólido.",
    detail:
      "La puntuación obtenida evidencia un nivel alto de cumplimiento en puntualidad por ruta, cobertura de turnos, protocolos de contingencia, mantenimiento y seguridad de unidades, además de esquemas claros de escalación y atención ejecutiva. La operación cuenta con trazabilidad y reportes suficientes para asegurar continuidad y mejora continua.",
  },
} as const;

function rango(total: number): Rango {
  if (total <= 11) return textos.bajo;
  if (total <= 18) return textos.medio;
  return textos.alto;
}

function ResultadoPanel({ data }: { data: Rango }) {
  return (
    <section className={`mt-6 rounded-2xl p-5 ${data.bg}`}>
      <p className="text-sm font-semibold tracking-wide">RESULTADO:</p>
      <p className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${data.tono}`}>
        {data.badge}
      </p>

      <p className="mt-3 font-bold">{data.heading}</p>
      <p className="mt-2 text-neutral-800">{data.detail}</p>
    </section>
  );
}

export default function App() {
  const [respuestas, setRespuestas] = useState<Record<number, number | null>>({});

  const total = useMemo(
    () => preguntas.reduce((acc, p) => acc + (respuestas[p.id] ?? 0), 0),
    [respuestas]
  );

  const setValor = (id: number, val: number) =>
    setRespuestas((prev) => ({ ...prev, [id]: val }));

  const data = rango(total);

  return (
    <main className="min-h-screen text-neutral-900">
      {/* Fondo y velo de legibilidad */}
      <div
        className="fixed inset-0 -z-10 bg-[url('/Fondo.png')] bg-cover bg-center bg-no-repeat"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 -z-10 bg-white/80 backdrop-blur-[1px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl p-6">
        {/* Header */}
        <header className="mb-6 flex items-start gap-4">
          <img src="/quokka-logo.png" alt="Grupo Quokka" className="h-10 sm:h-12" />
          <div>
            <h1 className="text-3xl font-bold leading-tight">
              ¿Qué tan bueno es tu proveedor de transporte?
            </h1>
            <p className="text-neutral-600">
              ¡Encuentra las debilidades y fortalezas de tu servicio de transporte con este sencillo test!
            </p>
          </div>
        </header>

        {/* Preguntas */}
        <div className="space-y-4">
          {preguntas.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-neutral-200/70 bg-white/75 backdrop-blur-md p-4 shadow-sm"
            >
              <p className="font-medium">
                {p.id}. {p.texto}
              </p>

              <div className="mt-2 flex flex-wrap gap-6">
                {[{ label: "Sí", val: 2 }, { label: "Parcial", val: 1 }, { label: "No", val: 0 }].map(
                  (opt) => (
                    <label key={opt.val} className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name={`p-${p.id}`}
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

        {/* Total y resultado */}
        <div className="mt-6 text-lg font-bold">TOTAL: {total}</div>
        <ResultadoPanel data={data} />
      </div>
    </main>
  );
}
