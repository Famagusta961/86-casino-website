"use client";
import { useState } from "react";
export function ContactForm() {
  const [sent, setSent] = useState(false),
    [error, setError] = useState(""),
    [pending, setPending] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError("");
    setPending(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error();
      setSent(true);
    } catch {
      setError(
        "Your message could not be sent. Please try again or email info@86-casino.com.",
      );
    } finally {
      setPending(false);
    }
  }
  if (sent)
    return (
      <p className="form-status" role="status">
        Thank you. Your message has been received and our team will be in touch.
      </p>
    );
  return (
    <form className="contact-form" onSubmit={submit} aria-busy={pending}>
      <label>
        Name
        <input required name="name" autoComplete="name" maxLength={100} />
      </label>
      <label>
        Email address
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          maxLength={200}
        />
      </label>
      <label>
        Phone number <span>(optional)</span>
        <input type="tel" name="phone" autoComplete="tel" maxLength={50} />
      </label>
      <label>
        Subject <span>(optional)</span>
        <input name="subject" maxLength={200} />
      </label>
      <label>
        How can we help?
        <textarea required name="message" maxLength={5000} />
      </label>
      <button disabled={pending} className="button button-red" type="submit">
        {pending ? "Sending…" : "Send message ↗"}
      </button>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
