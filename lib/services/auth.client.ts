"use client";

import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { AuthResult } from "./auth.service";

function toAuthError(err: unknown): { ok: false; error: string } {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes("user already registered"))
      return { ok: false, error: "An account with this email already exists" };
    if (msg.includes("invalid login credentials"))
      return { ok: false, error: "Incorrect email or password" };
    if (msg.includes("email not confirmed"))
      return { ok: false, error: "Please confirm your email before logging in" };
    return { ok: false, error: err.message };
  }
  return { ok: false, error: "An unexpected error occurred" };
}

export async function signIn(
  email: string,
  password: string,
): Promise<AuthResult<{ user: User; session: Session }>> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return toAuthError(error);
  if (!data.user || !data.session)
    return { ok: false, error: "Sign in failed — no session returned" };
  return { ok: true, data: { user: data.user, session: data.session } };
}

export async function signUp(
  email: string,
  password: string,
  emailRedirectTo: string,
): Promise<AuthResult<{ user: User | null; requiresConfirmation: boolean }>> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo },
  });
  if (error) return toAuthError(error);
  return {
    ok: true,
    data: { user: data.user, requiresConfirmation: !data.session },
  };
}

export async function signOut(): Promise<AuthResult<void>> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return toAuthError(error);
  return { ok: true, data: undefined };
}
