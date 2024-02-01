import express from "express";
import { updateCompany, getCompany } from "../controllers/companyController.js";
import requireAuth from "../middleware/requireAuth.js";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const router = express.Router();

router.get("/", requireAuth, getCompany);
router.put("/update", requireAuth, updateCompany);
export default router;
