import { test as setup } from "@playwright/test";

////////////////////////////////////////
// Authentication for Assignment 2
// Delete the code block below if you are not using it
////////////////////////////////////////

setup("authenticate assignment 2", { tag: "@a2" }, async ({ playwright }) => {
  const authFile = ".auth/user.json";
  const apiContext = await playwright.request.newContext();

  await apiContext.post("/api/auth", {
    data: JSON.stringify({ password: "123" }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  await apiContext.storageState({ path: authFile });
});

////////////////////////////////////////////////////////
// Authentication for Assignment 3
// Uncomment once you start working on the assignment 3
////////////////////////////////////////////////////////

setup(
  "authenticate assignment 3 and major project",
  { tag: ["@a3", "@b1"] },
  async ({ playwright }) => {
    const authFile = ".auth/user.json";

    const apiContext = await playwright.request.newContext();

    await apiContext.post("/api/auth", {
      data: JSON.stringify({ password: "123" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await apiContext.storageState({ path: authFile });
  },
);
