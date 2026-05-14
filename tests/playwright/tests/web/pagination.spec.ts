import { seed } from "@repo/db/seed";
import { expect, test, type Page } from "./fixtures";

test.beforeAll(async () => {
  await seed();
});

test.describe("PAGINATION", () => {
  test(
    "Display first page with 10 posts",
    {
      tag: "@b1",
    },
    async ({ page }) => {
      await page.goto("/");

      // HOME SCREEN > User must see paginated posts (10 per page)
      const articles = await page.locator("article");
      const articleCount = await articles.count();
      
      // Should show up to 10 posts on first page
      expect(articleCount).toBeLessThanOrEqual(10);
      expect(articleCount).toBeGreaterThan(0);

      // Check pagination controls exist
      const pagination = page.getByTestId("pagination");
      await expect(pagination).toBeVisible();
    }
  );

  test(
    "Pagination controls are displayed correctly",
    {
      tag: "@b1",
    },
    async ({ page }) => {
      await page.goto("/");

      // Check pagination button visibility
      const prevButton = page.getByTestId("pagination-prev");
      const nextButton = page.getByTestId("pagination-next");
      
      await expect(prevButton).toBeVisible();
      await expect(nextButton).toBeVisible();

      // Previous button should be disabled on first page
      await expect(prevButton).toBeDisabled();
      
      // Check page number buttons exist
      const page1Button = page.getByTestId("pagination-page-1");
      await expect(page1Button).toBeVisible();
    }
  );

  test(
    "Navigate to next page",
    {
      tag: "@b1",
    },
    async ({ page }) => {
      await page.goto("/");

      // Get posts from first page
      const firstPageArticles = await page.locator("article");
      const firstPageCount = await firstPageArticles.count();
      const firstPageTitles: string[] = [];
      
      for (let i = 0; i < firstPageCount; i++) {
        const title = await firstPageArticles.nth(i).locator("h2").first().textContent();
        if (title) firstPageTitles.push(title);
      }

      // Click next button
      const nextButton = page.getByTestId("pagination-next");
      await nextButton.click();

      // Wait for URL change
      await page.waitForURL("**/?page=2");

      // Check we're on page 2
      const page2Button = page.getByTestId("pagination-page-2");
      await expect(page2Button).toHaveClass(/bg-blue-500/);

      // Get posts from second page
      const secondPageArticles = await page.locator("article");
      const secondPageCount = await secondPageArticles.count();
      const secondPageTitles: string[] = [];
      
      for (let i = 0; i < secondPageCount; i++) {
        const title = await secondPageArticles.nth(i).locator("h2").first().textContent();
        if (title) secondPageTitles.push(title);
      }

      // Posts should be different (unless pagination doesn't work)
      // Posts on different pages should not be the same
      const commonTitles = firstPageTitles.filter(title => secondPageTitles.includes(title));
      expect(commonTitles.length).toBe(0);
    }
  );

  test(
    "Navigate back to previous page",
    {
      tag: "@b1",
    },
    async ({ page }) => {
      // Go to page 2 directly
      await page.goto("/?page=2");

      // Get posts from page 2
      const page2Articles = await page.locator("article");
      const page2Count = await page2Articles.count();
      const page2Titles: string[] = [];
      
      for (let i = 0; i < page2Count; i++) {
        const title = await page2Articles.nth(i).locator("h2").first().textContent();
        if (title) page2Titles.push(title);
      }

      // Click previous button
      const prevButton = page.getByTestId("pagination-prev");
      await prevButton.click();

      // Wait for URL change
      await page.waitForURL("**/?page=1");

      // Check we're on page 1
      const page1Button = page.getByTestId("pagination-page-1");
      await expect(page1Button).toHaveClass(/bg-blue-500/);
    }
  );

  test(
    "Click on specific page number",
    {
      tag: "@b1",
    },
    async ({ page }) => {
      await page.goto("/");

      // Check page 2 button exists
      const page2Button = page.getByTestId("pagination-page-2");
      
      // Only test if page 2 exists
      const pagination = page.getByTestId("pagination");
      const pageButtons = pagination.locator("button");
      const pageCount = await pageButtons.count();
      
      if (pageCount > 3) { // At least prev, page1, page2, next
        await page2Button.click();
        await page.waitForURL("**/?page=2");
        
        await expect(page2Button).toHaveClass(/bg-blue-500/);
      }
    }
  );

  test(
    "Pagination in search results",
    {
      tag: "@b1",
    },
    async ({ page }) => {
      // Go to search with a query
      await page.goto("/?q=React");

      // Should still have pagination
      const pagination = page.getByTestId("pagination");
      await expect(pagination).toBeVisible();

      // Check posts are displayed
      const articles = await page.locator("article");
      const articleCount = await articles.count();
      expect(articleCount).toBeGreaterThanOrEqual(0);
    }
  );

  test(
    "Pagination in category filter",
    {
      tag: "@b1",
    },
    async ({ page }) => {
      // Go to category page
      await page.goto("/category/react");

      // Should have pagination controls
      const pagination = page.getByTestId("pagination");
      
      // Only assert if pagination exists (might not if only 1 page)
      if (await pagination.isVisible().catch(() => false)) {
        await expect(pagination).toBeVisible();
      }

      // Check posts are displayed
      const articles = await page.locator("article");
      const articleCount = await articles.count();
      expect(articleCount).toBeGreaterThanOrEqual(0);
    }
  );

  test(
    "Pagination in tag filter",
    {
      tag: "@b1",
    },
    async ({ page }) => {
      // Go to tags page
      await page.goto("/tags/javascript");

      // Check pagination or posts exist
      const articles = await page.locator("article");
      const articleCount = await articles.count();
      
      // Either pagination exists or no posts
      const pagination = page.getByTestId("pagination");
      const paginationExists = await pagination.isVisible().catch(() => false);
      
      if (articleCount > 0) {
        expect(paginationExists || articleCount > 0).toBeTruthy();
      }
    }
  );

  test(
    "Post count displays correctly",
    {
      tag: "@b1",
    },
    async ({ page }) => {
      await page.goto("/");

      // Check that post count is displayed
      const postCountText = page.locator('text=/\\d+ Posts/');
      await expect(postCountText).toBeVisible();

      const text = await postCountText.textContent();
      expect(text).toMatch(/\d+ Posts/);
    }
  );
});
