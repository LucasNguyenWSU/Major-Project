import { client } from "@repo/db/client";

const paginationPosts = Array.from({ length: 12 }, (_, index) => {
  const postNumber = index + 1;

  return {
    id: 100 + postNumber,
    title: `Pagination Post ${postNumber}`,
    urlId: `pagination-post-${postNumber}`,
    description: `Pagination test description for post ${postNumber}`,
    content: `# Pagination Post ${postNumber}\n\nPagination test content ${postNumber}`,
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    date: new Date(2025, 0, postNumber),
    category: postNumber % 2 === 0 ? "React" : "Node",
    tags: postNumber % 2 === 0 ? "Front-End,Testing" : "Back-End,Testing",
    views: postNumber * 10,
    likes: postNumber % 3,
    active: true,
  };
});

export async function seedPagination() {
  console.log("🌱 Seeding pagination data");
  await client.db.like.deleteMany();
  await client.db.post.deleteMany();

  for (const post of paginationPosts) {
    await client.db.post.create({
      data: {
        title: post.title,
        content: post.content,
        category: post.category,
        description: post.description,
        imageUrl: post.imageUrl,
        tags: post.tags,
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
          userIP: `192.168.200.${post.id}.${i}`,
        },
      });
    }
  }
}
