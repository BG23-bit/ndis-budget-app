"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== "undefined"
          ? window.location.origin
          : undefined,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Sign in
        </h1>

        {sent ? (
          <p className="text-center text-green-400">
            Check your email and click the login link.
            <br />
            You can close this tab after clicking it.
          </p>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded bg-neutral-900 border border-neutral-700 text-white"
            />

            <button
              type="submit"
              className="w-full bg-white text-black font-semibold p-3 rounded"
            >
              Send login link
            </button>

            {error && (
              <p className="text-red-400 text-sm text-center">
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
