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

type Contacto = {
  nombre: string;
  puesto: string;
  empresa: string;
  email: string;
  celular: string;
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
  const [showResultado, setShowResultado] = useState(false);
  const [showContacto, setShowContacto] = useState(false);
  const [contacto, setContacto] = useState<Contacto>({
    nombre: "",
    puesto: "",
    empresa: "",
    email: "",
    celular: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

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
    setContacto({ nombre: "", puesto: "", empresa: "", email: "", celular: "" });
    setShowResultado(false);
    setShowContacto(false);
    setEnviado(false);
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
    URL.revokeObjectURL(url);
  };

  // Al completar, abre el modal de contacto (si aún no se envió)
  useEffect(() => {
    if (completo && !enviado) setShowContacto(true);
  }, [completo, enviado]);

  const abrirResultado = () => {
    if (!completo) return;
    if (enviado) setShowResultado(true);
    else setShowContacto(true);
  };

  const enviarContacto = async () => {
    if (!contacto.nombre.trim() || !contacto.email.trim()) {
      alert("Nombre y correo son obligatorios.");
      return;
    }
    setEnviando(true);
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: contacto,
          total,
          rango: data,
          respuestas,
          preguntas,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setEnviado(true);
      setShowContacto(false);
      setShowResultado(true);
    } catch (e) {
      alert("No se pudo enviar. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      {/* Fondo e imagen (usa /public/Fondo.png) */}
      <div
        className="fixed inset-0 -z-10 bg-[url('/Fondo.png')] bg-cover bg-center bg-no-repeat"
        aria-hidden="true"
      />
      {/* Velo para legibilidad */}
      <div className="fixed inset-0 -z-10 bg-white/40" aria-hidden="true" />

      <main className="mx-auto max-w-3xl p-6">
        {/* Header con logo y acciones */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/quokka-logo.png" alt="Grupo Quokka" className="h-10 sm:h-12" />
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
              <button
                onClick={abrirResultado}
                disabled={!completo}
                title={!completo ? "Responde todas las preguntas para ver el resultado" : ""}
                className={`rounded-xl px-3 py-2 shadow ${
                  completo ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-neutral-200 text-neutral-500"
                }`}
              >
                Ver resultado
              </button>
            </div>
          </div>

          <h1 className="mt-4 text-2xl font-bold">¿Qué tan bueno es tu proveedor de transporte?</h1>
          <p className="text-sm text-neutral-600">
            ¡Encuentra las debilidades y fortalezas de tu servicio de transporte con este sencillo test!
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
                {[
                  { label: "Sí", val: 2 },
                  { label: "Parcial", val: 1 },
                  { label: "No", val: 0 },
                ].map((opt) => (
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
      </main>

      {/* Modal de CONTACTO */}
      {showContacto && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-lg font-semibold">Déjanos tus datos de contacto</h2>
                <button
                  aria-label="Cerrar"
                  className="rounded p-1 text-neutral-500 hover:bg-neutral-100"
                  onClick={() => setShowContacto(false)}
                >
                  ✕
                </button>
              </div>

              <div className="p-4 space-y-3">
                {[
                  { key: "nombre", label: "Nombre*", type: "text", required: true },
                  { key: "puesto", label: "Puesto", type: "text" },
                  { key: "empresa", label: "Empresa", type: "text" },
                  { key: "email", label: "Correo*", type: "email", required: true },
                  { key: "celular", label: "Celular", type: "tel" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{f.label}</label>
                    <input
                      type={f.type as any}
                      required={Boolean(f.required)}
                      value={(contacto as any)[f.key] ?? ""}
                      onChange={(e) => setContacto((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 border-t p-4">
                <button
                  onClick={() => setShowContacto(false)}
                  className="rounded-xl bg-neutral-200 px-3 py-2 shadow hover:bg-neutral-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={enviarContacto}
                  disabled={enviando}
                  className="rounded-xl bg-emerald-600 px-3 py-2 text-white shadow hover:bg-emerald-700 disabled:opacity-60"
                >
                  {enviando ? "Enviando…" : "Enviar y ver resultado"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal de RESULTADO */}
      {showResultado && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowResultado(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-lg font-semibold">Resultado del diagnóstico</h2>
                <button
                  aria-label="Cerrar"
                  className="rounded p-1 text-neutral-500 hover:bg-neutral-100"
                  onClick={() => setShowResultado(false)}
                >
                  ✕
                </button>
              </div>

              <div className="p-4">
                <div className={`rounded-2xl p-4 ${data.bg}`}>
                  <p className="text-sm font-semibold">RESULTADO:</p>
                  <div className="mt-1 flex items-center gap-3 text-xs font-semibold">
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 ${data.tono}`}>
                      {data.badge}
                    </span>
                    <span className="text-neutral-600">| Total: {total} / 24</span>
                  </div>

                  <p className={`mt-3 font-bold ${data.tono}`}>{data.heading}</p>
                  <p className="mt-2">{data.detail}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t p-4">
                <button
                  onClick={reiniciar}
                  className="rounded-xl bg-white px-3 py-2 shadow hover:bg-neutral-50"
                >
                  Reiniciar cuestionario
                </button>
                <button
                  onClick={imprimir}
                  className="rounded-xl bg-black px-3 py-2 text-white shadow hover:opacity-90"
                >
                  Imprimir / PDF
                </button>
                <button
                  onClick={() => setShowResultado(false)}
                  className="rounded-xl bg-neutral-200 px-3 py-2 shadow hover:bg-neutral-300"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
