// Auth layout - centered layout for authentication pages (login, register)
// Provides consistent background and centering for auth forms

import { Toaster } from "sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted">
      {children}
    </div>
  );
}
