import { Hono } from "hono";
import { statusTerakhir } from "../db/queries";
import { JENIS_STATUS, type JenisStatus } from "../config";
import { gagalValidasi } from "../lib/errors";
import { auth, type AppEnv } from "../middleware/auth";

export const statusRoutes = new Hono<AppEnv>();

statusRoutes.use("*", auth);

/**
 * UC-10 — C-32 `tampilkanStatusServer(jenis)` / Algo-020, Q-017.
 * Both actors may read it; Admin uses it on the dashboard.
 */
statusRoutes.get("/:jenis", async (c) => {
  const jenis = c.req.param("jenis") as JenisStatus;
  if (!JENIS_STATUS.includes(jenis)) {
    throw gagalValidasi(`jenis harus salah satu dari: ${JENIS_STATUS.join(", ")}`);
  }

  const [baris] = await statusTerakhir(c.get("db"), jenis); // Q-017
  return c.json({
    status: baris
      ? { jenis: baris.jenis, statusUptime: baris.statusUptime, waktuCek: baris.waktuCek }
      : null,
  });
});
