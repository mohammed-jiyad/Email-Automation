import express from "express";
import { getEmails, getEmailById,retryEmail } from "./email.controller.js";

const router = express.Router();

router.get("/", getEmails);
router.get("/:id", getEmailById);
router.post("/:id/retry", retryEmail);


export default router;
