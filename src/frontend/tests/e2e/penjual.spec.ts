import { expect, test } from "@playwright/test";

test("seller can log in and open listing management", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(
    process.env.E2E_SELLER_EMAIL ?? "penjual@test.com",
  );
  await page.getByRole("textbox", { name: "Password" }).fill(
    process.env.E2E_SELLER_PASSWORD ?? "password123",
  );
  await page.getByRole("button", { name: "Log In" }).click();

  await expect(page).toHaveURL(/\/penjual\/listing$/);
  await expect(
    page.getByRole("heading", { name: "Kelola Listing Makanan" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "+ Tambah Listing" }),
  ).toBeVisible();

  await expect(
    page.getByText("Roti Tawar Penyelamatan").or(
      page.getByText("Belum ada listing makanan"),
    ),
  ).toBeVisible();

  await page.getByRole("button", { name: "+ Tambah Listing" }).click();
  await expect(page).toHaveURL(/\/penjual\/listing\/tambah$/);
  await expect(
    page.getByRole("heading", { name: "Add Product" }),
  ).toBeVisible();
  await expect(page.getByText("Product Photo*")).toBeVisible();
  await expect(page.getByLabel("Product Name *")).toBeVisible();
  await expect(page.getByLabel("Price (Rp) *")).toBeVisible();
  await expect(page.getByLabel("Stock *")).toBeVisible();
  await expect(page.getByLabel("Expiry Date *")).toBeVisible();
  await expect(page.getByRole("button", { name: "Show" })).toBeDisabled();
});
