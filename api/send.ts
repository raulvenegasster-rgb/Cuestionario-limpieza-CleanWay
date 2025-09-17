// api/send.ts
import { Resend } from "resend";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = (await req.json()) as {
      nombre: string;
      puesto: string;
      empresa: string;
      correo: string;
      celular: string;
      total: number;
      respuestas: Record<number, number | null>;
    };

    const resend = new Resend(process.env.RESEND_API_KEY);
    const to = process.env.EMAIL_TO!;
    const from = process.env.EMAIL_FROM || "onboarding@resend.dev";

    const filas = Object.entries(body.respuestas)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([id, val]) => `<tr><td>${id}</td><td style="text-align:center">${val ?? 0}</td></tr>`)
      .join("");

    const html = `
      <h2>Nuevo contacto - Clean Way</h2>
      <p><b>Total:</b> ${body.total} / 24</p>
      <ul>
        <li><b>Nombre:</b> ${body.nombre || "-"}</li>
        <li><b>Puesto:</b> ${body.puesto || "-"}</li>
        <li><b>Empresa:</b> ${body.empresa || "-"}</li>
        <li><b>Correo:</b> ${body.correo || "-"}</li>
        <li><b>Celular:</b> ${body.celular || "-"}</li>
      </ul>
      <h3>Respuestas</h3>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse">
        <thead><tr><th>Pregunta</th><th>Valor (2/1/0)</th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
    `;

    const { error } = await resend.emails.send({
      from,
      to,
      subject: `Nuevo lead Clean Way (Total: ${body.total})`,
      html,
      reply_to: body.correo || undefined,
    });

    if (error) {
      return new Response(JSON.stringify({ error: (error as any).message || "Resend error" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Unknown error" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
}

