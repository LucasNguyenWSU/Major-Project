"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Commenter, CommentNode } from "@/types/commenting";

type Props = {
  urlId: string;
  comments: CommentNode[];
  currentCommenter: Commenter | null;
};

function formatCommentDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function countComments(comments: CommentNode[]): number {
  return comments.reduce(
    (total, comment) => total + 1 + countComments(comment.replies),
    0,
  );
}

export function CommentsSection({ urlId, comments, currentCommenter }: Props) {
  const router = useRouter();
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [commentError, setCommentError] = useState("");
  const [savingComment, setSavingComment] = useState(false);
  const totalComments = countComments(comments);

  async function submitComment(parentId: number | null, content: string) {
    if (savingComment) return;

    setSavingComment(true);
    setCommentError("");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urlId, parentId, content }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        setCommentError(data.error ?? "Could not save comment");
        return;
      }

      setCommentText("");
      setReplyText("");
      setReplyTo(null);
      router.refresh();
    } finally {
      setSavingComment(false);
    }
  }

  async function handleRootSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitComment(null, commentText);
  }

  async function handleReplySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitComment(replyTo, replyText);
  }

  return (
    <section
      aria-labelledby="comments-heading"
      className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="comments-heading" className="text-xl font-semibold">
            Comments
          </h2>
          <p className="text-secondary text-sm">{totalComments} comments</p>
        </div>
        <CommenterStatus currentCommenter={currentCommenter} />
      </div>

      {currentCommenter ? (
        <form onSubmit={handleRootSubmit} className="mb-8 space-y-3">
          <label htmlFor="comment-content" className="text-sm font-medium">
            Add a comment
          </label>
          <textarea
            id="comment-content"
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            maxLength={1000}
            rows={4}
            required
            className="text-primary block w-full rounded-md border border-gray-300 bg-[var(--background)] px-3 py-2 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-400/30 dark:border-gray-600"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            {commentError ? (
              <p className="text-wsu text-sm">{commentError}</p>
            ) : (
              <span className="text-secondary text-sm">
                {commentText.length}/1000
              </span>
            )}
            <button
              type="submit"
              disabled={savingComment || !commentText.trim()}
              className="bg-wsu hover:bg-wsu-light rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Post comment
            </button>
          </div>
        </form>
      ) : (
        <LoginToCommentPanel urlId={urlId} />
      )}

      <div className="space-y-5">
        {comments.length === 0 ? (
          <p className="text-secondary text-sm">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentCommenter={currentCommenter}
              replyTo={replyTo}
              replyText={replyText}
              savingComment={savingComment}
              onReplyTo={setReplyTo}
              onReplyTextChange={setReplyText}
              onReplySubmit={handleReplySubmit}
            />
          ))
        )}
      </div>
    </section>
  );
}

function CommenterStatus({
  currentCommenter,
}: {
  currentCommenter: Commenter | null;
}) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  if (!currentCommenter) return null;

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-secondary">
        {currentCommenter.role === "admin"
          ? "Admin"
          : currentCommenter.displayName}
      </span>
      {currentCommenter.role === "admin" ? (
        <span className="bg-wsu rounded-sm px-2 py-1 text-xs font-semibold text-white">
          Admin
        </span>
      ) : (
        <button
          type="button"
          disabled={signingOut}
          onClick={signOut}
          className="text-secondary hover:text-primary disabled:opacity-50"
        >
          Sign out
        </button>
      )}
    </div>
  );
}

function LoginToCommentPanel({ urlId }: { urlId: string }) {
  return (
    <div className="mb-8 rounded-md border border-gray-200 p-4 dark:border-gray-700">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Login required</p>
          <p className="text-secondary mt-1 text-sm">
            Sign in or create an account to comment on this post.
          </p>
        </div>
        <Link
          href={`/login?next=${encodeURIComponent(`/post/${urlId}`)}`}
          className="bg-wsu hover:bg-wsu-light rounded-md px-4 py-2 text-sm font-medium text-white"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  currentCommenter,
  replyTo,
  replyText,
  savingComment,
  onReplyTo,
  onReplyTextChange,
  onReplySubmit,
}: {
  comment: CommentNode;
  currentCommenter: Commenter | null;
  replyTo: number | null;
  replyText: string;
  savingComment: boolean;
  onReplyTo: (commentId: number | null) => void;
  onReplyTextChange: (value: string) => void;
  onReplySubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const isReplying = replyTo === comment.id;

  return (
    <article className="border-l border-gray-200 pl-4 dark:border-gray-700">
      <header className="mb-2 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-medium">{comment.authorName}</span>
        {comment.authorRole === "admin" ? (
          <span className="bg-wsu rounded-sm px-2 py-0.5 text-xs font-semibold text-white">
            Admin
          </span>
        ) : null}
        <span className="text-secondary">
          {formatCommentDate(comment.createdAt)}
        </span>
      </header>

      <p className="whitespace-pre-wrap text-sm leading-6">{comment.content}</p>

      {currentCommenter ? (
        <button
          type="button"
          onClick={() => {
            onReplyTextChange("");
            onReplyTo(isReplying ? null : comment.id);
          }}
          className="text-wsu mt-2 text-sm hover:underline"
        >
          {isReplying ? "Cancel" : "Reply"}
        </button>
      ) : null}

      {isReplying ? (
        <form onSubmit={onReplySubmit} className="mt-3 space-y-3">
          <textarea
            value={replyText}
            onChange={(event) => onReplyTextChange(event.target.value)}
            maxLength={1000}
            rows={3}
            required
            className="text-primary block w-full rounded-md border border-gray-300 bg-[var(--background)] px-3 py-2 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-400/30 dark:border-gray-600"
          />
          <button
            type="submit"
            disabled={savingComment || !replyText.trim()}
            className="bg-wsu hover:bg-wsu-light rounded-md px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Post reply
          </button>
        </form>
      ) : null}

      {comment.replies.length > 0 ? (
        <div className="mt-5 space-y-5">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentCommenter={currentCommenter}
              replyTo={replyTo}
              replyText={replyText}
              savingComment={savingComment}
              onReplyTo={onReplyTo}
              onReplyTextChange={onReplyTextChange}
              onReplySubmit={onReplySubmit}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}
