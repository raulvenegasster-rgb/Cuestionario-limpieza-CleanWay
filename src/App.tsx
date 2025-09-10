
import React, { useMemo, useState } from 'react'

type Pregunta = { id: number; texto: string }

const preguntas: Pregunta[] = [
  { id: 1, texto: '¿Recibes reportes de puntualidad por ruta y unidad con indicadores claros?' },
  { id: 2, texto: '¿Tu proveedor garantiza al menos un 90% de cumplimiento en horarios?' },
  { id: 3, texto: '¿Tus empleados viajan en unidades recientes, con clima funcionando y mantenimiento preventivo al día?' },
  { id: 4, texto: '¿Te consta que los choferes cuentan con capacitación en manejo defensivo y protocolos de seguridad?' },
  { id: 5, texto: 'Imagina un empleado con una hora de traslado diario; ¿las unidades ofrecen comodidad suficiente para que llegue con buen ánimo y energía?' },
  { id: 6, texto: '¿Tu proveedor entiende que el transporte influye en la rotación y el compromiso del personal?' },
  { id: 7, texto: '¿Tienes certeza de que, si falla una unidad, recibirás reposición inmediata?' },
  { id: 8, texto: '¿Existen protocolos probados para incidentes en ruta o bloqueo?' },
  { id: 9, texto: '¿Puedes contactar a más de una persona responsable en caso de incidencia?' },
  { id: 10, texto: '¿Tu proveedor tiene 3 niveles de escalación (operador, coordinador, dirección) para resolver rápido?' },
  { id: 11, texto: '¿Cuentas con acceso a monitoreo en tiempo real de tus unidades?' },
  { id: 12, texto: '¿Puedes saber quién subió y quién no a cada unidad al inicio del turno?' },
]

function rango(total: number) {
  if (total <= 11) return { etiqueta: '❌ Necesitas revisar tu servicio de transporte, recuerda que es parte fundamental para el buen desempeño de tu plantilla y esto puede influir en la rotación de personal.', tono: 'text-red-600', bg: 'bg-red-50', badge: 'Bajo' }
  if (total <= 18) return { etiqueta: '⚠️ Hay cosas que mejorar.', tono: 'text-yellow-700', bg: 'bg-yellow-50', badge: 'Medio' }
  return { etiqueta: '🚍 Tienes un transporte de personal sólido.', tono: 'text-green-700', bg: 'bg-green-50', badge: 'Alto' }
}

export default function App() {
  const [respuestas, setRespuestas] = useState<Record<number, number | null>>({})

  const total = useMemo(() => preguntas.reduce((acc, p) => acc + (respuestas[p.id] ?? 0), 0), [respuestas])
  const faltantes = useMemo(() => preguntas.filter(p => respuestas[p.id] === undefined || respuestas[p.id] === null).length, [respuestas])
  const r = rango(total)

  function setValor(id: number, val: number) {
    setRespuestas(prev => ({ ...prev, [id]: val }))
  }

  function reiniciar() {
    setRespuestas({})
  }

  function imprimir() {
    window.print()
  }

  function exportarCSV() {
    const encabezados = ['Pregunta', 'Respuesta(2=Sí,1=Parcial,0=No)']
    const filas = preguntas.map(p => [
      p.texto.replace(/;/g, ","),
      String(respuestas[p.id] ?? 0),
    ])
    filas.push(['TOTAL', String(total)])
    const csv = [encabezados, ...filas].map(arr => arr.join(';')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cuestionario_transporte.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className='min-h-screen bg-neutral-50 text-neutral-800'>
      <div className='max-w-4xl mx-auto p-6'>
   <div className="min-h-screen bg-[url('/fondo.png')] bg-cover bg-center text-neutral-800">
  {/* resto del contenido */}
</div>
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      {/* Logo Grupo Quokka */}
      <img src="/quokka-logo.png" alt="Grupo Quokka" className="h-10 sm:h-12" />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">¿Que tan bueno es tu proveedor de transporte?</h1>
        <p className="text-sm text-neutral-500">
         ¡Encuentra las debilidades y fortalezas de tu servicio de transporte con este sencillo test!
        </p>
      </div>
    </div>
    <div className="flex gap-2 print:hidden">
      <button onClick={reiniciar} className="px-3 py-2 rounded-xl bg-white shadow border hover:bg-neutral-50">Reiniciar</button>
      <button onClick={exportarCSV} className="px-3 py-2 rounded-xl bg-white shadow border hover:bg-neutral-50">Exportar CSV</button>
      <button onClick={imprimir} className="px-3 py-2 rounded-xl bg-black text-white shadow">Imprimir / PDF</button>
    </div>
  </div>
</header>


        <div className='grid gap-4'>
          {preguntas.map((p, idx) => (
            <div key={p.id} className='bg-white rounded-2xl shadow p-4 border'>
              <div className='flex items-start justify-between gap-4'>
                <div className='font-medium'>{idx + 1}. {p.texto}</div>
                <div className='shrink-0 text-sm text-neutral-500'>Valor: {(respuestas[p.id] ?? 0)}</div>
              </div>
              <div className='mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='radio'
                    name={`q-${p.id}`}
                    className='h-4 w-4'
                    checked={respuestas[p.id] === 2}
                    onChange={() => setValor(p.id, 2)}
                  />
                  <span>Sí (2)</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='radio'
                    name={`q-${p.id}`}
                    className='h-4 w-4'
                    checked={respuestas[p.id] === 1}
                    onChange={() => setValor(p.id, 1)}
                  />
                  <span>Parcial (1)</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='radio'
                    name={`q-${p.id}`}
                    className='h-4 w-4'
                    checked={respuestas[p.id] === 0}
                    onChange={() => setValor(p.id, 0)}
                  />
                  <span>No (0)</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        <section className='mt-6 grid gap-3'>
          <div className='bg-white rounded-2xl shadow p-4 border flex items-center justify-between'>
            <div className='text-lg font-semibold'>TOTAL</div>
            <div className='text-2xl font-bold tabular-nums'>{total}</div>
          </div>

          <div className={`rounded-2xl p-4 border ${r.bg}`}>
            <div className='flex items-center justify-between'>
              <div className={`text-base font-medium ${r.tono}`}>{r.etiqueta}</div>
              <span className='text-xs px-2 py-1 rounded-full bg-white border shadow-sm'>{r.badge}</span>
            </div>
            {faltantes > 0 && (
              <p className='mt-2 text-xs text-neutral-500'>Faltan {faltantes} pregunta(s) por responder. Las no respondidas cuentan como 0.</p>
            )}
          </div>
        </section>

        <footer className='mt-8 text-center text-xs text-neutral-400 print:hidden'>
          Desarrollado por Raúl Venegas para Grupo Quokka, los expertos en servicios para la Industria.
        </footer>
      </div>

      <style>{`@media print { .print\\:hidden { display: none !important; } body { background: white; } }`}</style>
    </div>
  )
}
