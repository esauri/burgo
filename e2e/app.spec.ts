import { expect, test } from "@playwright/test";

test.describe("Middleware", () => {
  test("if locale cookie, page should match locale", async ({
    baseURL,
    browser,
  }) => {
    const context = await browser.newContext();

    context.addCookies([
      {
        name: "_burgo_locale",
        value: "es",
        url: baseURL,
      },
    ]);

    const page = await context.newPage();

    await page.goto("/");

    await expect(page).toHaveURL("/es");

    await expect(page.locator("h1")).toContainText("Menú de Burgo");

    await context.close();
  });
});

test.describe("Layout", () => {
  test("should navigate to create account page", async ({ page }) => {
    await page.goto("/");
    const navigation = page.getByRole("navigation");
    const link = navigation.getByRole("link", {
      name: /(Get\sStarted)|(Go\sto\sCreate\sAccount)/,
    });
    await link.click();
    await expect(page).toHaveURL("/en/create-account");
    await expect(page.locator("h1")).toContainText("Create Account");
  });

  test("should search products and go to product page", async ({ page }) => {
    await page.goto("/");
    const searchField = page.getByPlaceholder("What are you hungry for?");
    await searchField.fill("Fries");
    await searchField.press("Enter");
    await expect(page).toHaveURL("/en?q=fries");
    const link = page.getByRole("link", { name: "fries" });
    await link.click();
    await expect(page).toHaveURL("/en/products/3/fries");
  });
});

test.describe("Product Page", () => {
  test("should add multiple items to cart", async ({ page }) => {
    await page.goto("/en/products/3/fries");

    const decrementButton = page.getByLabel("Decrement quantity");
    const incrementButton = page.getByLabel("Increment quantity");
    const quantityField = page.getByPlaceholder("How many?");
    const addToCartButton = page.getByRole("button", { name: "Add to Cart" });

    await expect(quantityField).toHaveValue("1");

    await quantityField.fill("50");

    await expect(quantityField).toHaveValue("50");

    await decrementButton.click();

    await expect(quantityField).toHaveValue("49");

    await quantityField.fill("");

    await incrementButton.click();

    await expect(quantityField).toHaveValue("1");

    await addToCartButton.click();

    await page.getByRole("button", { name: "View Cart" }).click();

    await expect(page).toHaveURL("/en/cart");
  });
});
