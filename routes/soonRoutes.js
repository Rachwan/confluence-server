import express from "express";
import { soonController } from "../controllers/soonControllers.js";
import { verifyToken, checkRole } from "../middleware/authentication.js";

const soonRoutes = express.Router();

soonRoutes.post("/create", soonController.createSoon);
soonRoutes.get("/all", soonController.getAllSoon);
soonRoutes.get("/:id", soonController.getSoonById);
soonRoutes.delete("/:id", soonController.deleteSoon);

export default soonRoutes;
