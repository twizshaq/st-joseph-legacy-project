import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_WEBHOOK_KEY);

export async function POST(req: Request) {
  const body = await req.json();

  const event = body.type;

  if (event === "deployment.succeeded") {
    await resend.emails.send({
      from: "Deployments <deploy@bajanstories.com>",
      to: [
        "shaquxn@gmail.com",
        "stjosephdeoprojects@gmail.com",
        "coxlamar4@gmail.com",
    ],
      subject: "✅ Deployment Successful",
      html: `<p>Your deployment succeeded.</p>`
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
      subject: "❌ Deployment Failed",
      html: `<p>A deployment failed.</p>`
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
      subject: "↩️ Deployment Rolled Back",
      html: `<p>A deployment was rolled back.</p>`
    });
  }

  if (event === "firewall.attack") {
    await resend.emails.send({
      from: "Security <security@bajanstories.com>",
      to: [
        "shaquxn@gmail.com",
        "stjosephdeoprojects@gmail.com",
        "coxlamar4@gmail.com",
    ],
      subject: "🚨 Firewall Attack Detected",
      html: `<p>Vercel detected a possible attack.</p>`
    });
  }

  return new Response("ok");
}