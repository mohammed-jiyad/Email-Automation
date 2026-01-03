import express from "express";
import { ingestEmail } from "./ingestion.controller.js";

const router = express.Router();

router.post("/webhook/email", ingestEmail);

export default router;
