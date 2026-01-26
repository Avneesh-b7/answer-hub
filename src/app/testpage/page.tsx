// Test protected route - only accessible when logged in
// Proxy automatically protects this route (not /, /login, or /register)
// Displays user information from auth store

"use client";

import { useAuthStore } from "@/src/stores/auth.store";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck, User, Mail, Calendar } from "lucide-react";

export default function TestPage() {
  const { user, session } = useAuthStore();

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Protected Test Route</h1>
        <p className="text-muted-foreground">
          This page is only accessible when logged in. The proxy middleware
          validates your session.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </CardTitle>
            <CardDescription>
              Data from Zustand auth store (client-side)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-lg font-semibold">{user?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                <Mail className="inline h-4 w-4 mr-1" />
                Email
              </p>
              <p className="text-lg">{user?.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                User ID
              </p>
              <p className="text-sm font-mono text-muted-foreground">
                {user?.$id || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Session Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Session Information
            </CardTitle>
            <CardDescription>
              Active session details from Appwrite
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Session ID
              </p>
              <p className="text-sm font-mono text-muted-foreground break-all">
                {session?.$id || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Provider
              </p>
              <p className="text-lg capitalize">
                {session?.provider || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                <Calendar className="inline h-4 w-4 mr-1" />
                Created At
              </p>
              <p className="text-sm">
                {session?.$createdAt
                  ? new Date(session.$createdAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Expires At
              </p>
              <p className="text-sm">
                {session?.expire
                  ? new Date(session.expire).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How it Works */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How This Route is Protected</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
            <div>
              <p className="font-medium">Proxy Middleware (src/proxy.ts)</p>
              <p className="text-sm text-muted-foreground">
                Intercepts every request and validates session with Appwrite
                server
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
            <div>
              <p className="font-medium">Server-Side Validation</p>
              <p className="text-sm text-muted-foreground">
                Calls Appwrite /account endpoint with cookies to verify session
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
            <div>
              <p className="font-medium">Redirect on Failure</p>
              <p className="text-sm text-muted-foreground">
                If session is invalid, redirects to /login?redirect=/testpage
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="mt-6 flex gap-4">
        <Button asChild>
          <Link href="/">Go to Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/profile">Go to Profile</Link>
        </Button>
      </div>
    </div>
  );
}
