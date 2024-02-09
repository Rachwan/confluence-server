import express from "express";
import { contactController } from "../controllers/contactControllers.js";
import { verifyToken, checkRole } from "../middleware/authentication.js";

const contactRoutes = express.Router();

contactRoutes.post("/create", contactController.createContact);

contactRoutes.get("/all", contactController.getContacts);

contactRoutes.delete("/:id", contactController.deleteContact);

export default contactRoutes;