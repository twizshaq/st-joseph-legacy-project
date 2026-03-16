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

    const event = body?.type ?? "";
    const projectName = body?.payload?.name ?? "";
    const target = body?.payload?.target ?? "";
    const branch = body?.payload?.deployment?.meta?.githubCommitRef ?? "";
    const deploymentUrl = body?.payload?.url
      ? `https://${body.payload.url}`
      : "N/A";

    console.log("Webhook received:", event);
    console.log("Project:", projectName);
    console.log("Target:", target);
    console.log("Branch:", branch);
    console.log("Payload:", JSON.stringify(body, null, 2));

    const isCorrectProject = projectName === "st-joseph-legacy-project";
    const isDevelopPreview = branch === "develop" && target === "preview";

    if (!isCorrectProject || !isDevelopPreview) {
      return Response.json({
        ok: true,
        ignored: true,
        reason: "Not a develop preview deployment for st-joseph-legacy-project",
      });
    }

    let result = null;

    if (event === "deployment.succeeded") {
      result = await resend.emails.send({
        from: "Deployments <deploy@bajanstories.com>",
        to: [
          "shaquxn@gmail.com",
          "stjosephdeoprojects@gmail.com",
          "coxlamar4@gmail.com",
        ],
        subject: "✅ Develop Preview Deployment Succeeded",
        html: `
          <h2>Develop Preview Deployment Succeeded</h2>
          <p><strong>Project:</strong> ${projectName}</p>
          <p><strong>Branch:</strong> ${branch}</p>
          <p><strong>Target:</strong> ${target}</p>
          <p><strong>Event:</strong> ${event}</p>
          <p><strong>URL:</strong> ${deploymentUrl}</p>
        `,
      });
    } else if (event === "deployment.error") {
      result = await resend.emails.send({
        from: "Deployments <deploy@bajanstories.com>",
        to: [
          "shaquxn@gmail.com",
          "stjosephdeoprojects@gmail.com",
          "coxlamar4@gmail.com",
        ],
        subject: "❌ Develop Preview Deployment Error",
        html: `
          <h2>Develop Preview Deployment Error</h2>
          <p><strong>Project:</strong> ${projectName}</p>
          <p><strong>Branch:</strong> ${branch}</p>
          <p><strong>Target:</strong> ${target}</p>
          <p><strong>Event:</strong> ${event}</p>
        `,
      });
    } else if (event === "deployment.rollback") {
      result = await resend.emails.send({
        from: "Deployments <deploy@bajanstories.com>",
        to: [
          "shaquxn@gmail.com",
          "stjosephdeoprojects@gmail.com",
          "coxlamar4@gmail.com",
        ],
        subject: "↩️ Develop Preview Deployment Rollback",
        html: `
          <h2>Develop Preview Deployment Rollback</h2>
          <p><strong>Project:</strong> ${projectName}</p>
          <p><strong>Branch:</strong> ${branch}</p>
          <p><strong>Target:</strong> ${target}</p>
          <p><strong>Event:</strong> ${event}</p>
        `,
      });
    } else if (event === "firewall.attack") {
      result = await resend.emails.send({
        from: "Security <deploy@bajanstories.com>",
        to: [
          "shaquxn@gmail.com",
          "stjosephdeoprojects@gmail.com",
          "coxlamar4@gmail.com",
        ],
        subject: "🚨 Develop Preview Firewall Attack",
        html: `
          <h2>Develop Preview Firewall Attack</h2>
          <p><strong>Project:</strong> ${projectName}</p>
          <p><strong>Branch:</strong> ${branch}</p>
          <p><strong>Target:</strong> ${target}</p>
          <p><strong>Event:</strong> ${event}</p>
        `,
      });
    } else {
      return Response.json({ ok: true, ignored: true, event });
    }

    console.log("Resend result:", JSON.stringify(result, null, 2));

    return Response.json({ ok: true, event, result });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ ok: false, error: String(error) }, { status: 500 });
  }
}