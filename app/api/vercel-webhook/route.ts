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
    const event = body?.type;

    console.log("Webhook received");
    console.log("Event:", event);
    console.log("Payload:", JSON.stringify(body, null, 2));

    let sendResult = null;

    if (event === "deployment.succeeded") {
      sendResult = await resend.emails.send({
        from: "Deployments <deploy@bajanstories.com>",
        to: ["shaquxn@gmail.com"],
        subject: `Webhook Event: ${event ?? "unknown"}`,
        html: `<pre>${JSON.stringify(body, null, 2)}</pre>`,
        });
    } else if (event === "deployment.error") {
      sendResult = await resend.emails.send({
        from: "Deployments <deploy@bajanstories.com>",
        to: [
          "shaquxn@gmail.com",
          "stjosephdeoprojects@gmail.com",
          "coxlamar4@gmail.com",
        ],
        subject: "❌ Deployment Error",
        html: `
          <h2>Deployment Error</h2>
          <p><strong>Event:</strong> ${event}</p>
          <p><strong>Project:</strong> ${body.payload?.project?.name ?? "Unknown"}</p>
        `,
      });
    } else if (event === "deployment.rollback") {
      sendResult = await resend.emails.send({
        from: "Deployments <deploy@bajanstories.com>",
        to: [
          "shaquxn@gmail.com",
          "stjosephdeoprojects@gmail.com",
          "coxlamar4@gmail.com",
        ],
        subject: "↩️ Deployment Rollback",
        html: `
          <h2>Deployment Rolled Back</h2>
          <p><strong>Event:</strong> ${event}</p>
          <p><strong>Project:</strong> ${body.payload?.project?.name ?? "Unknown"}</p>
        `,
      });
    } else if (event === "firewall.attack") {
      sendResult = await resend.emails.send({
        from: "Security <deploy@bajanstories.com>",
        to: [
          "shaquxn@gmail.com",
          "stjosephdeoprojects@gmail.com",
          "coxlamar4@gmail.com",
        ],
        subject: "🚨 Firewall Attack Detected",
        html: `
          <h2>Firewall Attack Detected</h2>
          <p><strong>Event:</strong> ${event}</p>
        `,
      });
    } else {
      console.log("Unhandled event type:", event);
      return Response.json({ ok: true, ignored: true, event });
    }

    console.log("Resend result:", JSON.stringify(sendResult, null, 2));

    return Response.json({ ok: true, event, sendResult });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ ok: false, error: String(error) }, { status: 500 });
  }
}