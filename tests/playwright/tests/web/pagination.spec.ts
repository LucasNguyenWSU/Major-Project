import { expect, test, type Page } from "./fixtures";
import { seedPagination } from "../paginationSeed";

test.beforeAll(async () => {
  await seedPagination();
});

test.describe("WEB PAGINATION", () => {
  async function expectVisiblePosts(page: Page, titles: string[]) {
    const articles = page.locator("article");
    await expect(articles).toHaveCount(titles.length);

    for (let index = 0; index < titles.length; index++) {
      await expect(articles.nth(index)).toContainText(titles[index]);
    }
  }

  test(
    "Web home pagination navigates to next page in post order",
    {
      tag: "@b1",
    },
    async ({ page }) => {
      await page.goto("/");

      await expectVisiblePosts(page, [
        "Pagination Post 12",
        "Pagination Post 11",
        "Pagination Post 10",
        "Pagination Post 9",
        "Pagination Post 8",
      ]);
      await expect(page.getByTestId("web-page-indicator")).toHaveText(
        "Page 1 of 3",
      );
      await expect(page.getByText("Pagination Post 7")).not.toBeVisible();

      await page.getByRole("link", { name: "Next" }).click();

      await expect(page).toHaveURL("/?page=2");
      await expectVisiblePosts(page, [
        "Pagination Post 7",
        "Pagination Post 6",
        "Pagination Post 5",
        "Pagination Post 4",
        "Pagination Post 3",
      ]);
      await expect(page.getByTestId("web-page-indicator")).toHaveText(
        "Page 2 of 3",
      );
      await expect(page.getByText("Pagination Post 12")).not.toBeVisible();
    },
  );

  test(
    "Web home pagination navigates to previous page in post order",
    {
      tag: "@b1",
    },
    async ({ page }) => {
      await page.goto("/?page=2");

      await expectVisiblePosts(page, [
        "Pagination Post 7",
        "Pagination Post 6",
        "Pagination Post 5",
        "Pagination Post 4",
        "Pagination Post 3",
      ]);
      await expect(page.getByTestId("web-page-indicator")).toHaveText(
        "Page 2 of 3",
      );
      await expect(page.getByText("Pagination Post 12")).not.toBeVisible();

      await page.getByRole("link", { name: "Previous" }).click();

      await expect(page).toHaveURL("/?page=1");
      await expectVisiblePosts(page, [
        "Pagination Post 12",
        "Pagination Post 11",
        "Pagination Post 10",
        "Pagination Post 9",
        "Pagination Post 8",
      ]);
      await expect(page.getByTestId("web-page-indicator")).toHaveText(
        "Page 1 of 3",
      );
      await expect(page.getByText("Pagination Post 7")).not.toBeVisible();
    },
  );
});
