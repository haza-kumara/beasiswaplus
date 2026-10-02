export type ValidationResult =
  | { ok: true }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function validateEmail(email: string): ValidationResult {
  if (!email || !email.trim()) return { ok: false, error: "Email is required" };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Invalid email address" };
  return { ok: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) return { ok: false, error: "Password is required" };
  if (password.length < MIN_PASSWORD_LENGTH)
    return { ok: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` };
  return { ok: true };
}

export function validateSignUp(
  email: string,
  password: string,
  confirmPassword: string,
): ValidationResult {
  const emailResult = validateEmail(email);
  if (!emailResult.ok) return emailResult;

  const passwordResult = validatePassword(password);
  if (!passwordResult.ok) return passwordResult;

  if (password !== confirmPassword)
    return { ok: false, error: "Passwords do not match" };

  return { ok: true };
}

export function validateSignIn(
  email: string,
  password: string,
): ValidationResult {
  const emailResult = validateEmail(email);
  if (!emailResult.ok) return emailResult;

  if (!password) return { ok: false, error: "Password is required" };

  return { ok: true };
}
