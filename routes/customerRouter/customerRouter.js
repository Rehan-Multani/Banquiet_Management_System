import express from "express";

import {
    addcustomer,
    getsinglecustomer,
    getcustomer,
    deletecustomer,
    updatecustomer
} from "../../controllers/customerController/customerController.js";
import requireAuth from "../../middleware/requireAuth.js";
const router = express.Router();

router.post("/", requireAuth, addcustomer);
router.get("/:id", requireAuth, getsinglecustomer);
router.get("/", requireAuth, getcustomer);
router.delete("/:id", requireAuth, deletecustomer);
router.put("/:id", requireAuth, updatecustomer);

export default router;
