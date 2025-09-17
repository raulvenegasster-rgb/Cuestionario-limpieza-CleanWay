import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') return res.status(200).json({ ok: true });
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const { nombre, puesto, empresa, correo, celular, total } = req.body ?? {};

    if (!nombre || !correo) {
      return res.status(400).json({ ok: false, error: 'Faltan campos requeridos (nombre/correo)' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.EMAIL_TO;
    const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    if (!apiKey) return res.status(500).json({ ok: false, error: 'Falta RESEND_API_KEY' });
    if (!to) return res.status(500).json({ ok: false, error: 'Falta EMAIL_TO' });

    const resend = new Resend(apiKey);

    const subject = `Nuevo lead (Total: ${total ?? '-'})`;
    const html = `
      <h2>Nuevo contacto</h2>
      <ul>
        <li><b>Nombre:</b> ${nombre}</li>
        <li><b>Puesto:</b> ${puesto ?? ''}</li>
        <li><b>Empresa:</b> ${empresa ?? ''}</li>
        <li><b>Correo:</b> ${correo}</li>
        <li><b>Celular:</b> ${celular ?? ''}</li>
        <li><b>Total:</b> ${total ?? ''}</li>
      </ul>
    `;

    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      reply_to: correo,
    });

    if (error) return res.status(500).json({ ok: false, error: String(error) });

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || 'Error interno' });
  }
}

