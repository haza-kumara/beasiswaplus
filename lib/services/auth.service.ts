import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// ─── Typed result ────────────────────────────────────────────────────────────

export type AuthSuccess<T> = { ok: true; data: T };
export type AuthError = { ok: false; error: string };
export type AuthResult<T> = AuthSuccess<T> | AuthError;

function toAuthError(err: unknown): AuthError {
  if (err instanceof Error) {
    // Sanitise: don't leak internal Supabase messages verbatim for known cases
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

// ─── Service functions ────────────────────────────────────────────────────────

/**
 * Register a new user with email/password.
 * emailRedirectTo is the URL Supabase sends the confirmation link to.
 */
export async function signUp(
  email: string,
  password: string,
  emailRedirectTo: string,
): Promise<AuthResult<{ user: User | null; requiresConfirmation: boolean }>> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo },
  });

  if (error) return toAuthError(error);

  return {
    ok: true,
    data: {
      user: data.user,
      // Supabase returns identities=[] when email confirmation is required
      requiresConfirmation: !data.session,
    },
  };
}

/**
 * Sign in with email/password.
 */
export async function signIn(
  email: string,
  password: string,
): Promise<AuthResult<{ user: User; session: Session }>> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return toAuthError(error);
  if (!data.user || !data.session)
    return { ok: false, error: "Sign in failed — no session returned" };

  return { ok: true, data: { user: data.user, session: data.session } };
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<AuthResult<void>> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return toAuthError(error);
  return { ok: true, data: undefined };
}

/**
 * Get the currently authenticated user (server-side, verified).
 * Uses getUser() which hits the Supabase Auth server — slower but authoritative.
 */
export async function getCurrentUser(): Promise<AuthResult<User>> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return toAuthError(error);
  if (!data.user) return { ok: false, error: "No authenticated user" };
  return { ok: true, data: data.user };
}

/**
 * Get the current session from the cookie store.
 * Fast (no network) — use for non-security-critical checks.
 * For security-critical checks, use getCurrentUser() instead.
 */
export async function getSession(): Promise<AuthResult<Session>> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) return toAuthError(error);
  if (!data.session) return { ok: false, error: "No active session" };
  return { ok: true, data: data.session };
}
