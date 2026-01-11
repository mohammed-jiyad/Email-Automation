import express from "express";
import ingestionRoutes from "./modules/ingestion/ingestion.routes.js";
import emailRoutes from "./modules/emails/email.routes.js";
import statsRoutes from "./modules/stats/stats.routes.js";
const router = express.Router();

router.use("/ingest", ingestionRoutes);
router.use("/emails", emailRoutes);
router.use("/stats", statsRoutes);

export default router;
