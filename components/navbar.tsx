// Navbar component - displays site navigation with auth-aware UI
// Shows user menu (avatar, name, email, logout) when logged in
// Shows login/signup buttons when not logged in
// Hidden on auth pages (/login, /register)

"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { LogOut, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/src/stores/auth.store";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  // Hide navbar on auth pages
  const authPages = ["/login", "/register"];
  if (authPages.includes(pathname)) {
    return null;
  }

  const handleLogout = async () => {
    const result = await logout();

    if (result.success) {
      toast.success(result.message || "Logged out successfully");
      router.push("/login");
    } else {
      toast.error(result.message || "Logout failed");
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo & Navigation Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Answer Hub</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/questions"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Questions
            </Link>
            <Link
              href="/tags"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Tags
            </Link>
            <Link
              href="/users"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Users
            </Link>
          </div>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {user ? (
            // Logged in: Show user dropdown
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-accent"
                >
                  <Avatar className="h-8 w-8">
                    {/* <AvatarImage src={user.prefs?.avatar} alt={user.name} /> */}
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden flex-col items-start text-sm md:flex">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Not logged in: Show login/signup buttons
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
