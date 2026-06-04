import { seed } from "@repo/db/seed";
import { expect, test, type Page } from "./fixtures";

const postPath = "/post/boost-your-conversion-rate";

async function registerCommenter(
  page: Page,
  username: string,
  displayName: string,
) {
  await page.goto(`/login?next=${encodeURIComponent(postPath)}`);
  await page.getByRole("button", { name: "Register" }).click();
  await page.getByLabel("Username").fill(username);
  await page.getByLabel("Display name").fill(displayName);
  await page.getByLabel("Password").fill("123456");
  await page.getByRole("button", { name: "Create Account" }).click();

  await expect(page).toHaveURL(postPath);
  await expect(page.getByText(displayName).first()).toBeVisible();
}

function commentsSection(page: Page) {
  return page.locator("section[aria-labelledby='comments-heading']");
}

test.describe("COMMENT SCREEN", () => {
  test.beforeEach(async () => {
    await seed();
  });

  test(
    "Shows login prompt to signed out visitors",
    {
      tag: "@b3",
    },
    async ({ page }) => {
      await page.goto(postPath);

      const comments = commentsSection(page);
      await expect(
        comments.getByRole("heading", { name: "Comments" }),
      ).toBeVisible();
      await expect(comments.getByText("0 comments")).toBeVisible();
      await expect(comments.getByText("Login required")).toBeVisible();
      await expect(
        comments.getByText(
          "Sign in or create an account to comment on this post.",
        ),
      ).toBeVisible();
      await expect(comments.getByText("No comments yet.")).toBeVisible();
      await expect(
        comments.getByRole("link", { name: "Login" }),
      ).toHaveAttribute("href", `/login?next=${encodeURIComponent(postPath)}`);
    },
  );

  test(
    "Registered user can post a comment",
    {
      tag: "@b3",
    },
    async ({ page }) => {
      const displayName = "B3 Commenter";
      const commentText = "This is a b3 end to end comment.";

      await registerCommenter(page, "b3_commenter", displayName);

      const comments = commentsSection(page);
      await expect(comments.getByText("0 comments")).toBeVisible();
      await comments.getByLabel("Add a comment").fill(commentText);
      await comments.getByRole("button", { name: "Post comment" }).click();

      await expect(comments.getByText("1 comments")).toBeVisible();
      await expect(comments.getByText(displayName).first()).toBeVisible();
      await expect(comments.getByText(commentText)).toBeVisible();

      await page.reload();
      await expect(comments.getByText(commentText)).toBeVisible();
    },
  );

  test(
    "Registered user can reply to a comment",
    {
      tag: "@b3",
    },
    async ({ page }) => {
      const displayName = "B3 Replier";
      const parentComment = "This is the parent b3 comment.";
      const replyComment = "This is the nested b3 reply.";

      await registerCommenter(page, "b3_replier", displayName);

      const comments = commentsSection(page);
      await comments.getByLabel("Add a comment").fill(parentComment);
      await comments.getByRole("button", { name: "Post comment" }).click();
      await expect(comments.getByText(parentComment)).toBeVisible();

      const parent = comments
        .locator("article")
        .filter({ hasText: parentComment })
        .first();
      await parent.getByRole("button", { name: "Reply" }).click();
      await parent.locator("textarea").fill(replyComment);
      await parent.getByRole("button", { name: "Post reply" }).click();

      await expect(comments.getByText("2 comments")).toBeVisible();
      await expect(parent.getByText(replyComment)).toBeVisible();

      await page.reload();
      await expect(
        comments
          .locator("article")
          .filter({ hasText: parentComment })
          .first()
          .getByText(replyComment),
      ).toBeVisible();
    },
  );
});
