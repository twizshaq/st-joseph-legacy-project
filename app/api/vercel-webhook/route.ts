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
    const branch = body?.payload?.deployment?.meta?.githubCommitRef ?? "";
    const deploymentUrl = body?.payload?.url
      ? `https://${body.payload.url}`
      : "N/A";
    const commitMessage =
      body?.payload?.deployment?.meta?.githubCommitMessage ?? "No commit message";

    console.log("Webhook received:", event);
    console.log("Project:", projectName);
    console.log("Branch:", branch);
    console.log("Payload:", JSON.stringify(body, null, 2));

    const isCorrectProject = projectName === "st-joseph-legacy-project";
    const isTrackedBranch = branch === "main" || branch === "develop";

    if (!isCorrectProject || !isTrackedBranch) {
      return Response.json({
        ok: true,
        ignored: true,
        reason: "Not a tracked branch for st-joseph-legacy-project",
      });
    }

    const branchLabel = branch === "main" ? "Main" : "Develop";

    let subject = "";
    let heading = "";

    if (event === "deployment.succeeded") {
      subject = `✅ Deployed on ${branchLabel}`;
      heading = `Deployment Succeeded on ${branchLabel}`;
    } else if (event === "deployment.error") {
      subject = `❌ Deployment Error on ${branchLabel}`;
      heading = `Deployment Error on ${branchLabel}`;
    } else if (event === "deployment.rollback") {
      subject = `↩️ Deployment Rollback on ${branchLabel}`;
      heading = `Deployment Rollback on ${branchLabel}`;
    } else if (event === "firewall.attack") {
      subject = `🚨 Firewall Attack on ${branchLabel}`;
      heading = `Firewall Attack on ${branchLabel}`;
    } else {
      return Response.json({ ok: true, ignored: true, event });
    }

    const result = await resend.emails.send({
      from: "Deployments <deploy@bajanstories.com>",
      to: [
        "shaquxn@gmail.com",
        "stjosephdeoprojects@gmail.com",
        "coxlamar4@gmail.com",
      ],
      subject,
      html: `
        <h2>${heading}</h2>
        <p><strong>Project:</strong> ${projectName}</p>
        <p><strong>Branch:</strong> ${branch}</p>
        <p><strong>Event:</strong> ${event}</p>
        <p><strong>Commit:</strong> ${commitMessage}</p>
        <p><strong>URL:</strong> ${deploymentUrl}</p>
      `,
    });

    console.log("Resend result:", JSON.stringify(result, null, 2));

    return Response.json({ ok: true, event, result });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ ok: false, error: String(error) }, { status: 500 });
  }
}