"use client";

import { useState } from "react";

export function LikeButton({
  urlId,
  initialLikes,
}: {
  urlId: string;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [saving, setSaving] = useState(false);

  async function handleLike() {
    if (saving) return;
    setSaving(true);
    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urlId }),
      });
      if (!response.ok) return;
      const data = (await response.json()) as { likes: number };
      setLikes(data.likes);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <span>{likes} likes</span>
      <button
        data-test-id="like-button"
        type="button"
        disabled={saving}
        onClick={handleLike}
        className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
      >
        Like
      </button>
    </>
  );
}
