import { client } from "./client.js";
import { posts } from "./data.js";

export async function resetPostIdSequence() {
  await client.db.$queryRaw`
    SELECT setval(
      pg_get_serial_sequence('"Post"', 'id'),
      COALESCE((SELECT MAX("id") FROM "Post"), 1),
      (SELECT COUNT(*) FROM "Post") > 0
    )
  `;
}

export async function seed() {
  console.log("🌱 Seeding data");
  await client.db.comment.deleteMany();
  await client.db.user.deleteMany();
  await client.db.like.deleteMany();
  await client.db.post.deleteMany();
  for (const post of posts) {
    await client.db.post.create({
      data: {
        title: post.title,
        content: post.content,
        category: post.category,
        description: post.description,
        imageUrl: post.imageUrl,
        tags: post.tags
          .split(",")
          .map((p: string) => p.trim())
          .join(","),
        urlId: post.urlId,
        active: post.active,
        date: post.date,
        id: post.id,
        views: post.views,
      },
    });
    for (let i = 0; i < post.likes; i++) {
      await client.db.like.create({
        data: {
          postId: post.id,
          userIP: `192.168.100.${i}`,
        },
      });
    }
  }
  await resetPostIdSequence();
  return 1;
}
