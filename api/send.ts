// api/send.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Health-check opcional
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, msg: 'send endpoint up' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { nombre, puesto, empresa, correo, celular, total } = req.body ?? {};

    // Validación básica
    if (!nombre || !correo) {
      return res.status(400).json({ ok: false, error: 'Faltan campos requeridos (nombre/correo)' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    const to = process.env.EMAIL_TO;

    if (!process.env.RESEND_API_KEY) {
      throw new Error('Falta RESEND_API_KEY');
    }
    if (!to) {
      throw new Error('Falta EMAIL_TO');
    }

    const subject = `Nuevo lead de cuestionario transporte (Total: ${total ?? '-'})`;
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
      reply_to: correo, // útil responder directo al contacto
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ ok: false, error: String(error) });
    }

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error('API /api/send error:', err?.message || err);
    return res.status(500).json({ ok: false, error: err?.message || 'Error interno' });
  }
}
