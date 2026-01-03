import express from "express";
import ingestionRoutes from "./modules/ingestion/ingestion.routes.js";

const router = express.Router();

router.use("/", ingestionRoutes);
export default router;
