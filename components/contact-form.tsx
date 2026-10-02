"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/lib/site";

/**
 * Posts to the Cloudflare Worker at /api/contact.
 *
 * This is a client component talking to a Worker, not a Next.js Server Action -
 * static export has no server, so Server Actions and API routes are unavailable.
 */
export function ContactForm() {
  const [status, setStatus] = React.useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    // Only the Worker's own JSON is trusted to supply wording. Anything else
    // that comes back - a host error page, an outage, a proxy in the way - used
    // to reach the visitor as the raw parser error ("Unexpected token '<'...
    // is not valid JSON"). The fallbacks name Matt's address because this form
    // is also how signed copies get ordered; a dead end here is a lost sale.
    const fallback = `Something went wrong sending that. Please try again, or email Matt directly at ${site.email}.`;

    let res: Response;
    try {
      res = await fetch("/api/contact", { method: "POST", body: data });
    } catch {
      // The request never got an answer: offline, DNS, blocked.
      setStatus("error");
      setError(
        `Couldn't reach the server. Check your connection and try again, or email Matt directly at ${site.email}.`
      );
      return;
    }

    const json = (await res.json().catch(() => null)) as {
      ok?: boolean;
      error?: string;
    } | null;

    if (res.ok && json?.ok) {
      setStatus("sent");
      form.reset();
      return;
    }

    setStatus("error");
    setError(json?.error ?? fallback);
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border bg-card p-6" role="status">
        <p className="font-medium">Thanks! Your message is on its way.</p>
        <p className="text-muted-foreground mt-1 text-sm">
          Matt will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {/* Honeypot - hidden from people, filled in by bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required autoComplete="name" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" autoComplete="tel" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message">Your message</Label>
        <Textarea id="message" name="message" required rows={5} />
      </div>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
