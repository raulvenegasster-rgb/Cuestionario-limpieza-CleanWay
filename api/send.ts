// api/send.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Espera un JSON POST con:
 * { nombre, puesto, empresa, correo, celular, total, respuestas }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }

  try {
    const { nombre, puesto, empresa, correo, celular, total, respuestas } = req.body ?? {};

    if (!nombre || !correo) {
      res.status(400).json({ ok: false, error: 'Faltan campos requeridos (nombre, correo).' });
      return;
    }

    const to = process.env.EMAIL_TO;
    const from = process.env.EMAIL_FROM;
    if (!to || !from) {
      res.status(500).json({ ok: false, error: 'Faltan EMAIL_TO o EMAIL_FROM en variables de entorno.' });
      return;
    }

    const html = `
      <h2>Nuevo cuestionario de transporte</h2>
      <p><b>Nombre:</b> ${nombre}</p>
      <p><b>Puesto:</b> ${puesto || '-'}</p>
      <p><b>Empresa:</b> ${empresa || '-'}</p>
      <p><b>Correo:</b> ${correo}</p>
      <p><b>Celular:</b> ${celular || '-'}</p>
      <p><b>Total:</b> ${total ?? '-'}</p>
      <hr/>
      <pre style="white-space:pre-wrap">${JSON.stringify(respuestas ?? {}, null, 2)}</pre>
    `.trim();

    await resend.emails.send({
      from,
      to,
      subject: `Cuestionario transporte – ${nombre} (${empresa || 'Sin empresa'})`,
      html,
      reply_to: correo, // útil si quieres responder directo al contacto
    });

    res.status(200).json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message || 'Error enviando correo' });
  }
}
