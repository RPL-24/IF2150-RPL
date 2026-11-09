import { expect, test } from "@playwright/test";

test("buyer can confirm payment by opening the scanned QR URL", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("pembeli@test.com");
  await page.getByRole("textbox", { name: "Password" }).fill("password123");
  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page).toHaveURL(/\/katalog$/);

  const transaksi = await page.evaluate(async () => {
    const katalogResponse = await fetch("/api/katalog");
    if (!katalogResponse.ok) throw new Error("Gagal memuat katalog");
    const katalog = await katalogResponse.json();
    if (!katalog.length) throw new Error("Katalog seed kosong");

    const checkoutResponse = await fetch("/api/pembayaran/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id_listing: katalog[0].id_listing, jumlah: 1 }] }),
    });
    if (!checkoutResponse.ok) throw new Error("Checkout gagal");
    return checkoutResponse.json();
  });

  await page.goto(`/pembayaran/${transaksi.id_transaksi}`);
  await expect(page.getByRole("img", { name: "QRIS dummy" })).toBeVisible();
  const urlScan = await page
    .getByRole("link", { name: "Simulasikan scan QR di perangkat ini" })
    .getAttribute("href");
  expect(urlScan).toBeTruthy();
  const perangkatPemindai = await page.context().newPage();
  await perangkatPemindai.goto(urlScan!);
  await expect(perangkatPemindai.getByRole("heading", { name: "Pembayaran berhasil" })).toBeVisible();
  await expect(perangkatPemindai.getByRole("link", { name: "Kembali ke halaman utama" })).toHaveAttribute("href", "/");
  await expect(page.getByRole("heading", { name: "Pembayaran berhasil" })).toBeVisible();
  await expect(page.getByText("Kode pengambilan")).toBeVisible();
  await perangkatPemindai.close();
});
