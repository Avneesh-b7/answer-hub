// Homepage - main landing page for Answer Hub Q&A platform
// Features hero section, recent questions, stats, and call-to-action
// Stack Overflow-inspired design with modern UI components

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MessageSquare, Users, Trophy, Search, ArrowRight } from "lucide-react";

export default function Home() {
  // Mock data for featured questions (will be replaced with real data later)
  const featuredQuestions = [
    {
      id: 1,
      title: "How to implement authentication in Next.js 14 with Appwrite?",
      author: "john_doe",
      answers: 5,
      votes: 23,
      tags: ["nextjs", "appwrite", "authentication"],
      timeAgo: "2 hours ago",
    },
    {
      id: 2,
      title: "What's the difference between Server and Client Components?",
      author: "jane_smith",
      answers: 12,
      votes: 45,
      tags: ["react", "nextjs", "server-components"],
      timeAgo: "5 hours ago",
    },
    {
      id: 3,
      title: "Best practices for state management with Zustand?",
      author: "dev_master",
      answers: 8,
      votes: 31,
      tags: ["zustand", "state-management", "react"],
      timeAgo: "1 day ago",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold">
              Answer<span className="text-primary">Hub</span>
            </Link>
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

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="border-b bg-linear-to-br from-background to-muted py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight">
            Every developer has a tab open to{" "}
            <span className="text-primary">AnswerHub</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Join our community of developers sharing knowledge, solving
            problems, and building better software together.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mb-8 flex max-w-2xl items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search questions..."
                className="pl-10"
              />
            </div>
            <Button size="lg">Search</Button>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link href="/questions/ask">
              <Button size="lg" className="gap-2">
                Ask a Question <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/questions">
              <Button size="lg" variant="outline">
                Browse Questions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Questions
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">10,482</div>
                <p className="text-xs text-muted-foreground">
                  +201 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,845</div>
                <p className="text-xs text-muted-foreground">
                  +180 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Answers Posted
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45,231</div>
                <p className="text-xs text-muted-foreground">
                  +1,234 from last month
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Questions Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Top Questions</h2>
            <Link href="/questions">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <div className="space-y-4">
            {featuredQuestions.map((question) => (
              <Card
                key={question.id}
                className="transition-shadow hover:shadow-md"
              >
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Stats */}
                    <div className="flex flex-col items-center gap-2 text-sm">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold">{question.votes}</span>
                        <span className="text-muted-foreground">votes</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-semibold">
                          {question.answers}
                        </span>
                        <span className="text-muted-foreground">answers</span>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="flex-1">
                      <Link href={`/questions/${question.id}`}>
                        <h3 className="mb-2 text-lg font-semibold text-primary hover:underline">
                          {question.title}
                        </h3>
                      </Link>

                      <div className="mb-3 flex flex-wrap gap-2">
                        {question.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>asked by</span>
                        <Link
                          href={`/users/${question.author}`}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {question.author}
                        </Link>
                        <span>•</span>
                        <span>{question.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to get your questions answered?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            Join thousands of developers who are already part of our community.
            Ask questions, share knowledge, and grow together.
          </p>
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Join Answer Hub Today <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} AnswerHub. Built with Next.js and
            Appwrite.
          </p>
        </div>
      </footer>
    </div>
  );
}
