import express from "express";
import { updateCompany, getCompany } from "../controllers/companyController.js";

const router = express.Router();

router.get("/", getCompany);
router.put("/update", updateCompany);
export default router;
