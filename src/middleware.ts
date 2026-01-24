// Middleware for route protection and authentication checks
// Validates Appwrite sessions on every request using direct API calls
// SECURITY: Prevents cookie tampering by verifying session with Appwrite server

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Verifies session validity by calling Appwrite's account endpoint
 * This prevents cookie tampering and ensures the session is active and valid
 *
 * @param request - The incoming request with cookies
 * @returns Promise<boolean> - true if session is valid, false otherwise
 */
async function verifySessionWithAppwrite(
  request: NextRequest,
): Promise<boolean> {
  try {
    // Get all cookies from the request
    const cookies = request.cookies.getAll();

    // Convert cookies to header format for Appwrite
    const cookieHeader = cookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    // If no cookies at all, no need to make API call
    if (!cookieHeader) {
      return false;
    }

    // Call Appwrite's /account endpoint to verify session
    // Appwrite will check if the session token is:
    // - Valid (exists in database)
    // - Not expired
    // - Not tampered with
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/account`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
          Cookie: cookieHeader,
        },
      },
    );

    // If Appwrite returns 200, session is valid
    // If it returns 401, session is invalid/expired/tampered
    return response.ok;
  } catch (error) {
    // Network error or Appwrite is unreachable
    // Fail safely by treating as unauthenticated
    console.error("Session verification failed:", error);
    return false;
  }
}

/**
 * Main middleware function - runs on every request
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define route patterns
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isHomePage = pathname === "/";

  // Home page is public - allow without validation
  if (isHomePage) {
    return NextResponse.next();
  }

  // Validate session with Appwrite for all other routes
  const isAuthenticated = await verifySessionWithAppwrite(request);

  // If user is authenticated and trying to access auth pages (login/register)
  // Redirect them to home page (they're already logged in)
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is NOT authenticated and trying to access protected routes
  // Redirect them to login page
  if (!isAuthenticated && !isAuthPage) {
    const loginUrl = new URL("/login", request.url);
    // Store the original URL to redirect back after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to proceed
  // - Authenticated users can access protected routes
  // - Unauthenticated users can access auth pages
  return NextResponse.next();
}

// Configure which routes middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
