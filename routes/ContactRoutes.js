import express from "express";
import { contactController } from "../controllers/ContactControllers.js";
import { verifyToken, checkRole } from "../middleware/Authentication.js";

export const contactRoutes = express.Router();

contactRoutes.post("/create", contactController.createContact);

contactRoutes.get("/", contactController.getContacts);

contactRoutes.delete("/:id", contactController.deleteContact);
