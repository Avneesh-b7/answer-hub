// Tag input component - allows users to add/remove tags with chip-based UI
// Press Enter or comma to add a tag, click X to remove
// Used in question posting form

"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
}

export function TagInput({
  tags,
  onTagsChange,
  placeholder = "Add tags...",
  maxTags = 5,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Add tag on Enter or Comma
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }

    // Remove last tag on Backspace if input is empty
    if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim().replace(/,/g, "");

    if (trimmedValue === "") return;
    if (tags.includes(trimmedValue)) {
      setInputValue("");
      return;
    }
    if (tags.length >= maxTags) {
      setInputValue("");
      return;
    }

    onTagsChange([...tags, trimmedValue]);
    setInputValue("");
  };

  const removeTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="pl-2.5 pr-1 py-1 text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
                aria-label={`Remove ${tag} tag`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input Field */}
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={
          tags.length >= maxTags
            ? `Maximum ${maxTags} tags`
            : placeholder
        }
        disabled={tags.length >= maxTags}
        className="w-full"
      />

      <p className="text-xs text-muted-foreground">
        Press Enter or comma to add tags. {tags.length}/{maxTags} tags
      </p>
    </div>
  );
}
