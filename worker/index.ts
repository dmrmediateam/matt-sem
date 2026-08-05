/**
 * Static export means Next.js has no server, so form submissions land here.
 * Everything that is not /api/* falls through to the static assets.
 *
 * Secrets below are RUNTIME secrets on the Worker (wrangler secret put ...),
 * never NEXT_PUBLIC_ build variables.
 */

interface Env {
  ASSETS: Fetcher;
  // Set with: npx wrangler secret put CONTACT_WEBHOOK_URL
  // Point this at an email API (Resend, Postmark), a Zapier catch hook, or a CRM.
  CONTACT_WEBHOOK_URL?: string;
}

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

function bad(message: string, status = 400): Response {
  return Response.json({ ok: false, error: message }, { status });
}

async function handleContact(request: Request, env: Env): Promise<Response> {
  let payload: ContactPayload;

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    payload = (await request.json()) as ContactPayload;
  } else {
    const form = await request.formData();
    payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      message: String(form.get("message") ?? ""),
    };
    // Honeypot: real users leave this empty, bots fill it in.
    if (String(form.get("company") ?? "")) {
      return Response.json({ ok: true });
    }
  }

  if (!payload.name || !payload.email || !payload.message) {
    return bad("Please fill in your name, email, and message.");
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) {
    return bad("That email address doesn't look right.");
  }

  if (!env.CONTACT_WEBHOOK_URL) {
    // Fail loudly rather than telling the visitor it worked. A silently
    // dropped lead is worse than an error message.
    console.error("CONTACT_WEBHOOK_URL is not set — submission dropped");
    return bad("The contact form isn't configured yet.", 500);
  }

  const forwarded = await fetch(env.CONTACT_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      submittedAt: new Date().toISOString(),
      source: new URL(request.url).hostname,
    }),
  });

  if (!forwarded.ok) {
    console.error("Webhook rejected submission", forwarded.status);
    return bad("We couldn't send that just now. Please try again.", 502);
  }

  return Response.json({ ok: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.replace(/\/$/, "") === "/api/contact") {
      if (request.method !== "POST") {
        return bad("Method not allowed", 405);
      }
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
