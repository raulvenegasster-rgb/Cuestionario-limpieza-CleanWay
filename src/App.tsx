// src/App.tsx
import { useMemo, useState, useEffect } from "react";

/* ---------- Tipos ---------- */
type Pregunta = { id: number; texto: string };

type Rango = {
  badge: "Muy pobre" | "Regular" | "Sólido";
  tono: string;   // clases de color de texto
  bg: string;     // clases de fondo del panel
  heading: string;
  detail: string;
};

/* ---------- Preguntas (12) ---------- */
const preguntas: Pregunta[] = [
  { id: 1,  texto: "¿Cuentas con un programa de limpieza certificado (p. ej. ISO 9001)?" },
  { id: 2,  texto: "¿Tu proveedor garantiza la asistencia para que la operación nunca se detenga?" },
  { id: 3,  texto: "¿Existen rutas y checklists documentados por tipo de área (oficina, industria, retail, salud, educación)?" },
  { id: 4,  texto: "¿Se ejecutan auditorías internas con evidencia (bitácoras/fotos) y acciones correctivas?" },
  { id: 5,  texto: "¿Tienes abastecimiento continuo de insumos con opciones biodegradables?" },
  { id: 6,  texto: "¿Se controla el orden y la seguridad (EPP, 5S) del personal de limpieza?" },
  { id: 7,  texto: "¿Monitoreas indicadores por zona/turno (cumplimiento, retrabajos, quejas)?" },
  { id: 8,  texto: "¿Se documenta la trazabilidad de incidencias y tiempos de respuesta (SLA/SLT)?" },
  { id: 9,  texto: "¿Recibes reporte operativo diario (avances, hallazgos, horas-hombre, consumo de insumos)?" },
  { id: 10, texto: "¿Recibes propuestas de mejora y seguimiento a la implementación/cierre?" },
  { id: 11, texto: "¿Cumple con requisitos legales/seguridad del cliente y está disponible para auditorías?" },
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
    heading: "⚠️ Hay brechas que resolver.",
    detail:
      "Existen áreas con cumplimiento parcial en checklists, disciplina de turno y trazabilidad de incidencias. " +
      "Cerrar estas brechas reduce quejas, retrabajos y costos de abastecimiento, y mejora la experiencia del usuario final.",
  },
  alto: {
    badge: "Sólido",
    tono: "text-emerald-700",
    bg: "bg-emerald-50",
    heading: "✨ Operación de limpieza sólida.",
    detail:
      "Cuentas con certificación, cobertura estable, indicadores por zona, trazabilidad y propuestas de mejora implementadas. " +
      "Sigue monitoreando KPIs y auditorías para mantener el nivel.",
  },
} as const;

/* ---------- Reglas de rango ---------- */
function rango(total: number): Rango {
  if (total <= 11) return textos.bajo;
  if (total <= 18) return textos.medio;
  return textos.alto;
}

/* ---------- Panel de resultado ---------- */
function ResultadoPanel({ data }: { data: Rango }) {
  return (
    <section className={`mt-4 rounded-2xl p-5 ${data.bg}`}>
      <p className="text-sm font-semibold tracking-wide">RESULTADO:</p>
      <p className="mt-1">
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${data.tono}`}
        >
          {data.badge}
        </span>
      </p>
      <p className={`mt-3 font-bold ${data.tono}`}>{data.heading}</p>
      <p className="mt-2">{data.detail}</p>
    </section>
  );
}

/* ---------- App ---------- */
export default function App() {
  // respuestas y cálculo
  const [respuestas, setRespuestas] = useState<Record<number, number | null>>({});

  const total = useMemo(
    () => preguntas.reduce((acc, p) => acc + (respuestas[p.id] ?? 0), 0),
    [respuestas]
  );

  const faltantes = useMemo(
    () => preguntas.filter((p) => respuestas[p.id] === undefined || respuestas[p.id] === null).length,
    [respuestas]
  );

  const data = rango(total);

  // modal de resultado
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (faltantes === 0) setShowModal(true);
  }, [faltantes]);

  // formulario de contacto
  const [nombre, setNombre] = useState("");
  const [puesto, setPuesto] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [correo, setCorreo] = useState("");
  const [celular, setCelular] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar() {
    try {
      setEnviando(true);
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nombre,
          puesto,
          empresa,
          correo,
          celular,
          total,
          respuestas,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "Error al enviar");
      alert("¡Enviado! Te contactaremos pronto.");
    } catch (err: any) {
      alert(`No se pudo enviar. Intenta de nuevo.\n${err?.message || err}`);
    } finally {
      setEnviando(false);
    }
  }

  function reiniciar() {
    setRespuestas({});
    setShowModal(false);
  }

  function exportarCSV() {
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
    a.download = "cuestionario_limpieza.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {/* Fondo e imagen */}
      <div
        className="fixed inset-0 -z-10 bg-[url('/fondo_clean.png')] bg-cover bg-center bg-no-repeat"
        aria-hidden="true"
      />
      <div className="fixed inset-0 -z-10 bg-white/45" aria-hidden="true" />

      <main className="mx-auto max-w-3xl p-6">
        {/* Header */}
        <header className="mb-4">
          <div className="flex items-center justify-between">
            <img src="/CLEANWAY_logo.png" alt="Clean Way" className="h-20 sm:h-24" />
            <div className="flex gap-2 print:hidden">
              <button onClick={reiniciar} className="rounded-xl bg-white px-3 py-2 shadow hover:bg-neutral-50">
                Reiniciar
              </button>
              <button onClick={exportarCSV} className="rounded-xl bg-white px-3 py-2 shadow hover:bg-neutral-50">
                Exportar CSV
              </button>
              <button onClick={() => window.print()} className="rounded-xl bg-black px-3 py-2 text-white shadow hover:opacity-90">
                Imprimir / PDF
              </button>
            </div>
          </div>

          <h1 className="mt-4 text-2xl font-bold">¿Qué tan robusto es tu servicio de limpieza?</h1>
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
                {[{ label: "Sí", val: 2 }, { label: "Parcial", val: 1 }, { label: "No", val: 0 }].map((opt) => (
                  <label key={opt.val} className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name={`q_${p.id}`}
                      value={opt.val}
                      checked={respuestas[p.id] === opt.val}
                      onChange={() => setRespuestas((prev) => ({ ...prev, [p.id]: opt.val }))}
                      className="h-4 w-4"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal de resultado + formulario */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold">Resultado del diagnóstico</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>

              <ResultadoPanel data={data} />

              {/* Formulario de contacto */}
              <div className="mt-5 rounded-xl border bg-white p-4">
                <p className="mb-3 text-sm text-neutral-700">
                  ¿Quieres que te contactemos con una propuesta? Déjanos tus datos:
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre*"
                    className="rounded-lg border px-3 py-2 outline-none"
                  />
                  <input
                    value={puesto}
                    onChange={(e) => setPuesto(e.target.value)}
                    placeholder="Puesto"
                    className="rounded-lg border px-3 py-2 outline-none"
                  />
                  <input
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    placeholder="Empresa"
                    className="rounded-lg border px-3 py-2 outline-none"
                  />
                  <input
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="Correo*"
                    type="email"
                    className="rounded-lg border px-3 py-2 outline-none"
                  />
                  <input
                    value={celular}
                    onChange={(e) => setCelular(e.target.value)}
                    placeholder="Celular"
                    className="rounded-lg border px-3 py-2 outline-none sm:col-span-2"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="rounded-xl bg-white px-3 py-2 shadow hover:bg-neutral-50"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="rounded-xl bg-white px-3 py-2 shadow hover:bg-neutral-50"
                  >
                    Imprimir / PDF
                  </button>
                  <button
                    onClick={reiniciar}
                    className="rounded-xl bg-white px-3 py-2 shadow hover:bg-neutral-50"
                  >
                    Reiniciar cuestionario
                  </button>

                  <button
                    onClick={enviar}
                    disabled={enviando || !correo || !nombre}
                    className="ml-auto rounded-xl bg-black px-4 py-2 text-white shadow hover:opacity-90 disabled:opacity-50"
                  >
                    {enviando ? "Enviando..." : "Enviar datos"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}


