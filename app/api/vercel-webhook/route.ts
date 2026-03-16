import { Resend } from "resend";

export async function GET() {
  return new Response("Webhook route is live", { status: 200 });
}

export async function POST(req: Request) {
  try {
    const resendKey = process.env.RESEND_WEBHOOK_KEY;

    if (!resendKey) {
      console.error("Missing RESEND_WEBHOOK_KEY");
      return Response.json(
        { ok: false, error: "Missing RESEND_WEBHOOK_KEY" },
        { status: 500 }
      );
    }

    const resend = new Resend(resendKey);
    const body = await req.json();

    console.log("Webhook POST received");
    console.log(JSON.stringify(body, null, 2));

    const result = await resend.emails.send({
      from: "Deployments <deploy@bajanstories.com>",
      to: ["shaquxn@gmail.com"],
      subject: "Webhook POST received",
      html: `<pre>${JSON.stringify(body, null, 2)}</pre>`,
    });

    console.log("Resend result:", JSON.stringify(result, null, 2));

    return Response.json({ ok: true, result });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ ok: false, error: String(error) }, { status: 500 });
  }
}