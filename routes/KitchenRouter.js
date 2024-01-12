import express from "express";
import {
    updateKitchen,
 
} from "../controllers/KitchenController.js";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

router.put("/:id", requireAuth, updateKitchen);


export default router;
