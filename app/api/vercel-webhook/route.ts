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
    const isDevelopBranch = branch === "develop";

    if (!isCorrectProject || !isDevelopBranch) {
      return Response.json({
        ok: true,
        ignored: true,
        reason: "Not the develop branch for st-joseph-legacy-project",
        projectName,
        branch,
        target,
      });
    }

    const result = await resend.emails.send({
      from: "Deployments <deploy@bajanstories.com>",
      to: [
        "shaquxn@gmail.com",
        "stjosephdeoprojects@gmail.com",
        "coxlamar4@gmail.com",
      ],
      subject: `Webhook: ${event} on develop`,
      html: `
        <h2>Webhook Event on Develop</h2>
        <p><strong>Project:</strong> ${projectName}</p>
        <p><strong>Branch:</strong> ${branch}</p>
        <p><strong>Target:</strong> ${target || "N/A"}</p>
        <p><strong>Event:</strong> ${event}</p>
        <p><strong>URL:</strong> ${deploymentUrl}</p>
        <pre>${JSON.stringify(body, null, 2)}</pre>
      `,
    });

    console.log("Resend result:", JSON.stringify(result, null, 2));

    return Response.json({ ok: true, event, result });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ ok: false, error: String(error) }, { status: 500 });
  }
}