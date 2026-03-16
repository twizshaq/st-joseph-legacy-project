export async function GET() {
  return new Response("Webhook route is live", { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json();
  console.log("Webhook received:", body);

  return new Response("ok", { status: 200 });
}