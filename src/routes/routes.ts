import { Router } from "express";
import sendProjectInfo from "../controllers/controller.js";

const router = Router();

router.get("/", sendProjectInfo);

export default router;
