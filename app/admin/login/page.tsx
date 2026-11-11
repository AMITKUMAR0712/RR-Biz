import Link from "next/link";
import { loginAdmin } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = error === "limited"
    ? "Too many login attempts. Wait 15 minutes and try again."
    : error === "invalid"
      ? "Email or password is incorrect."
      : "";
  return (
    <main className="admin-login-page">
      <form className="admin-login-card" action={loginAdmin}>
        <Link href="/" className="admin-login-back">← Back to site</Link>
        <span className="admin-kicker">RRBIZTECH</span>
        <h1>Team sign in</h1>
        <p>Sign in to open your authorized RRBizTech workspace.</p>
        {message && <p className="admin-message" role="alert">{message}</p>}
        <label>Email<input name="email" type="email" autoComplete="username" required maxLength={254} /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" required minLength={1} /></label>
        <button className="admin-primary" type="submit">Sign in</button>
      </form>
    </main>
  );
}
