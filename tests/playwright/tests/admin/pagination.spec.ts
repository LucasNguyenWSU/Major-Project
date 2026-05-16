import { expect, test, type Page } from "./fixtures";
import { seedPagination } from "../paginationSeed";

test.beforeAll(async () => {
  await seedPagination();
});

test.describe("ADMIN PAGINATION", () => {
  async function expectVisiblePosts(page: Page, titles: string[]) {
    const articles = page.locator("article");
    await expect(articles).toHaveCount(titles.length);

    for (let index = 0; index < titles.length; index++) {
      await expect(articles.nth(index)).toContainText(titles[index]);
    }
  }

  test(
    "Admin home pagination navigates to next page in post order",
    {
      tag: "@b1",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      await expectVisiblePosts(userPage, [
        "Pagination Post 12",
        "Pagination Post 11",
        "Pagination Post 10",
        "Pagination Post 9",
        "Pagination Post 8",
      ]);
      await expect(userPage.getByTestId("admin-page-indicator")).toHaveText(
        "Page 1 of 3",
      );
      await expect(userPage.getByText("Pagination Post 7")).not.toBeVisible();

      await userPage.getByRole("button", { name: "Next" }).click();

      await expectVisiblePosts(userPage, [
        "Pagination Post 7",
        "Pagination Post 6",
        "Pagination Post 5",
        "Pagination Post 4",
        "Pagination Post 3",
      ]);
      await expect(userPage.getByTestId("admin-page-indicator")).toHaveText(
        "Page 2 of 3",
      );
      await expect(userPage.getByText("Pagination Post 12")).not.toBeVisible();
    },
  );

  test(
    "Admin home pagination navigates to previous page in post order",
    {
      tag: "@b1",
    },
    async ({ userPage }) => {
      await userPage.goto("/");
      await userPage.getByRole("button", { name: "Next" }).click();

      await expectVisiblePosts(userPage, [
        "Pagination Post 7",
        "Pagination Post 6",
        "Pagination Post 5",
        "Pagination Post 4",
        "Pagination Post 3",
      ]);
      await expect(userPage.getByTestId("admin-page-indicator")).toHaveText(
        "Page 2 of 3",
      );
      await expect(userPage.getByText("Pagination Post 12")).not.toBeVisible();

      await userPage.getByRole("button", { name: "Previous" }).click();

      await expectVisiblePosts(userPage, [
        "Pagination Post 12",
        "Pagination Post 11",
        "Pagination Post 10",
        "Pagination Post 9",
        "Pagination Post 8",
      ]);
      await expect(userPage.getByTestId("admin-page-indicator")).toHaveText(
        "Page 1 of 3",
      );
      await expect(userPage.getByText("Pagination Post 7")).not.toBeVisible();
    },
  );
});
