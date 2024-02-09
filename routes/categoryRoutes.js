import express from "express";
import { verifyToken, checkRole } from "../middleware/authentication.js";
import { CategoryController } from "../controllers/categoryControllers.js";
import uploadImage from "../middleware/multer.js";

const categoryRoutes = express.Router();

categoryRoutes.post(
  "/create",
  uploadImage.fields([
    { name: "background", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  CategoryController.createCategory
);

categoryRoutes.get("/all", CategoryController.getAllCategories);

categoryRoutes.put(
  "/:id",
  uploadImage.fields([
    { name: "background", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  CategoryController.updateCategory
);

categoryRoutes.get("/:id", CategoryController.getCategoryById);

categoryRoutes.delete("/:id", CategoryController.deleteCategory);

export default categoryRoutes;
