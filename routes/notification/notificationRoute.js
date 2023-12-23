import express from "express";

import {
    createnotification
} from "../../controllers/notification/notificationController.js";
const router = express.Router();

router.post("/create", createnotification);

export default router;
