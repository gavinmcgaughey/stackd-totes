import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false },
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col px-5 py-24">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Admin login
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        Manage bookings and block out dates.
      </p>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
