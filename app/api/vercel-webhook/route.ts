import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_WEBHOOK_KEY);

export async function GET() {
  return new Response("Webhook route is live", { status: 200 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event = body.type;

    console.log("Webhook received:", event);
    console.log("Payload:", JSON.stringify(body, null, 2));

    if (event === "deployment.succeeded") {
      await resend.emails.send({
        from: "Deployments <deploy@bajanstories.com>",
        to: [
        "shaquxn@gmail.com",
        "stjosephdeoprojects@gmail.com",
        "coxlamar4@gmail.com",
    ],
        subject: "✅ Deployment Succeeded",
        html: `
          <h2>Deployment Succeeded</h2>
          <p><strong>Event:</strong> ${event}</p>
          <p><strong>Project:</strong> ${body.payload?.project?.name ?? "Unknown"}</p>
          <p><strong>URL:</strong> ${body.payload?.url ?? "N/A"}</p>
        `,
      });
    }

    if (event === "deployment.error") {
      await resend.emails.send({
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
    }

    if (event === "deployment.rollback") {
      await resend.emails.send({
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
    }

    if (event === "firewall.attack") {
      await resend.emails.send({
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
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ ok: false }, { status: 500 });
  }
}