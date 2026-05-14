"use client";

import type { Post } from "@repo/db/data";
import { marked } from "marked";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type Props =
  | {
      mode: "create";
      post?: undefined;
    }
  | {
      mode: "edit";
      post: Post;
    };

type Errors = {
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  tags?: string;
};

export function PostEditorForm(props: Props) {
  const router = useRouter();
  const post = props.mode === "edit" ? props.post : undefined;

  const [title, setTitle] = useState(post?.title ?? "");
  const [category, setCategory] = useState(post?.category ?? "");
  const [description, setDescription] = useState(post?.description ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [imageUrl, setImageUrl] = useState(post?.imageUrl ?? "");
  const [tags, setTags] = useState(post?.tags ?? "");
  const [errors, setErrors] = useState<Errors>({});
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const selectionRef = useRef<{ start: number; end: number } | null>(null);

  const previewHtml = useMemo(() => {
    return marked.parse(content || "");
  }, [content]);

  function validate(): Errors {
    const next: Errors = {};
    const normalizedDescription = description.trim();

    if (!title.trim()) {
      next.title = "Title is required";
    }

    if (!normalizedDescription) {
      next.description = "Description is required";
    } else if (normalizedDescription.length > 200) {
      next.description = "Description is too long. Maximum is 200 characters";
    }

    if (!content.trim()) {
      next.content = "Content is required";
    }

    if (!imageUrl.trim()) {
      next.imageUrl = "Image URL is required";
    } else {
      try {
        new URL(imageUrl);
      } catch {
        next.imageUrl = "This is not a valid URL";
      }
    }

    if (!tags.trim()) {
      next.tags = "At least one tag is required";
    }

    return next;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setShowGlobalError(false);
    setMessage(null);

    const validation = validate();
    setErrors(validation);

    const hasError = Object.keys(validation).length > 0;
    if (hasError) {
      setShowGlobalError(true);
      return;
    }

    setSaving(true);
    try {
      const endpoint =
        props.mode === "edit" && post
          ? `/api/posts/${post.urlId}`
          : "/api/posts";
      const method = props.mode === "edit" ? "PUT" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
          description,
          content,
          imageUrl,
          tags,
        }),
      });
      if (!response.ok) {
        setShowGlobalError(true);
        setMessage(null);
        return;
      }
      setSaving(false);
      setMessage("Post updated successfully");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  function togglePreview() {
    if (!previewOpen) {
      const textarea = contentRef.current;
      if (textarea) {
        selectionRef.current = {
          start: textarea.selectionStart,
          end: textarea.selectionEnd,
        };
      }
      setPreviewOpen(true);
    } else {
      setPreviewOpen(false);
    }
  }

  useEffect(() => {
    if (!previewOpen && selectionRef.current && contentRef.current) {
      const { start, end } = selectionRef.current;
      const textarea = contentRef.current;
      textarea.focus();
      textarea.setSelectionRange(start, end);
    }
  }, [previewOpen]);

  return (
    <div className="mx-auto w-full max-w-3xl p-4">
      <Link href="/" className="mb-3 inline-flex items-center text-sm text-primary">
        ← Back
      </Link>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-xl font-semibold">
          {props.mode === "edit" ? "Update Post" : "Create Post"}
        </h1>

        {showGlobalError && (
          <p className="text-sm text-red-600">Please fix the errors before saving</p>
        )}
        {message && <p className="text-sm text-green-700">{message}</p>}

        <div>
          <label htmlFor="title" className="mb-1 block text-sm">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="category" className="mb-1 block text-sm">
            Category
          </label>
          <input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-24 w-full rounded border px-3 py-2 text-sm"
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="content" className="text-sm">
              Content
            </label>
            <button
              type="button"
              onClick={togglePreview}
              className="rounded border px-2 py-1 text-xs"
            >
              {previewOpen ? "Close Preview" : "Preview"}
            </button>
          </div>
          {!previewOpen && (
            <textarea
              id="content"
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-40 w-full rounded border px-3 py-2 font-mono text-sm"
            />
          )}
          {previewOpen && (
            <div
              data-test-id="content-preview"
              className="rounded border p-3 text-sm"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          )}
          {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
        </div>

        <div>
          <label htmlFor="imageUrl" className="mb-1 block text-sm">
            Image URL
          </label>
          <input
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          {errors.imageUrl && (
            <p className="text-sm text-red-600">{errors.imageUrl}</p>
          )}
          <img
            data-test-id="image-preview"
            src={imageUrl}
            alt=""
            className="mt-2 h-72 w-full rounded border bg-gray-100 object-contain p-2"
          />
        </div>

        <div>
          <label htmlFor="tags" className="mb-1 block text-sm">
            Tags
          </label>
          <input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
          {errors.tags && <p className="text-sm text-red-600">{errors.tags}</p>}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          Save
        </button>
      </form>
    </div>
  );
}

