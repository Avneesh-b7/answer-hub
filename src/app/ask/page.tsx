// Ask Question page - allows authenticated users to post new questions
// Features: Markdown editor, tag input, character counters, validation
// Redirects to /myquestions on successful submission

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/tag-input";
import { useAuthStore } from "@/src/stores/auth.store";
import { database, ID } from "@/src/models/client/config";
import { db, questionsCollection } from "@/src/models/name";

// Dynamically import markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const TITLE_MIN = 15;
const TITLE_MAX = 255;
const CONTENT_MIN = 30;
const CONTENT_MAX = 10000;

export default function AskQuestionPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation helpers
  const isTitleValid = title.length >= TITLE_MIN && title.length <= TITLE_MAX;
  const isContentValid =
    content.length >= CONTENT_MIN && content.length <= CONTENT_MAX;
  const canSubmit = isTitleValid && isContentValid && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!user) {
      toast.error("You must be logged in to post a question");
      router.push("/login");
      return;
    }

    if (!isTitleValid) {
      toast.error(
        `Title must be between ${TITLE_MIN} and ${TITLE_MAX} characters`,
      );
      return;
    }

    if (!isContentValid) {
      toast.error(
        `Content must be between ${CONTENT_MIN} and ${CONTENT_MAX} characters`,
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO:
      // Create question document in Appwrite
      // await database.createDocument(
      //   db,
      //   questionsCollection,
      //   ID.unique(),
      //   {
      //     title: title.trim(),
      //     content: content.trim(),
      //     authorId: user.$id,
      //     tags: tags.length > 0 ? tags : [],
      //   }
      // );
      // toast.success("Question posted successfully!");
      // // Redirect to my questions page
      // router.push("/myquestions");
    } catch (error: any) {
      console.error("Failed to post question:", error);
      toast.error(
        error?.message || "Failed to post question. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Ask a Question</h1>
        <p className="mt-2 text-muted-foreground">
          Get help from the community by asking a detailed question
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-base font-medium">
            Question Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="e.g., How do I center a div in CSS?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={TITLE_MAX}
            disabled={isSubmitting}
            className="text-base"
          />
          <div className="flex items-center justify-between text-xs">
            <p className="text-muted-foreground">
              Be specific and imagine you're asking a question to another person
            </p>
            <p
              className={
                title.length < TITLE_MIN || title.length > TITLE_MAX
                  ? "text-destructive"
                  : "text-muted-foreground"
              }
            >
              {title.length}/{TITLE_MAX}
            </p>
          </div>
          {title.length > 0 && title.length < TITLE_MIN && (
            <p className="text-xs text-destructive">
              Minimum {TITLE_MIN} characters required
            </p>
          )}
        </div>

        {/* Content Markdown Editor */}
        <div className="space-y-2">
          <Label htmlFor="content" className="text-base font-medium">
            Question Details <span className="text-destructive">*</span>
          </Label>
          <div data-color-mode="light" className="dark:hidden">
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || "")}
              preview="edit"
              height={400}
              enableScroll={true}
              textareaProps={{
                placeholder:
                  "Provide all the details someone would need to answer your question...",
                maxLength: CONTENT_MAX,
                disabled: isSubmitting,
              }}
            />
          </div>
          <div data-color-mode="dark" className="hidden dark:block">
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || "")}
              preview="edit"
              height={400}
              enableScroll={true}
              textareaProps={{
                placeholder:
                  "Provide all the details someone would need to answer your question...",
                maxLength: CONTENT_MAX,
                disabled: isSubmitting,
              }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <p className="text-muted-foreground">
              Include code, error messages, and what you've tried. Supports
              Markdown.
            </p>
            <p
              className={
                content.length < CONTENT_MIN || content.length > CONTENT_MAX
                  ? "text-destructive"
                  : "text-muted-foreground"
              }
            >
              {content.length}/{CONTENT_MAX}
            </p>
          </div>
          {content.length > 0 && content.length < CONTENT_MIN && (
            <p className="text-xs text-destructive">
              Minimum {CONTENT_MIN} characters required
            </p>
          )}
        </div>

        {/* Tags Input */}
        <div className="space-y-2">
          <Label htmlFor="tags" className="text-base font-medium">
            Tags{" "}
            <span className="text-muted-foreground font-normal">
              (Optional)
            </span>
          </Label>
          <TagInput
            tags={tags}
            onTagsChange={setTags}
            placeholder="Add up to 5 tags (e.g., javascript, react, css)"
            maxTags={5}
          />
          <p className="text-xs text-muted-foreground">
            Add tags to help others find your question
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-4 pt-4">
          <Button
            type="submit"
            size="lg"
            disabled={!canSubmit}
            className="min-w-[200px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Question"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
