import express from "express";
import { verifyToken, checkRole } from "../middleware/authentication.js";
import { PlatformController } from "../controllers/platformControllers.js";
import uploadImage from "../middleware/multer.js";

const platformRoutes = express.Router();

platformRoutes.post(
  "/create",
  uploadImage.fields([
    { name: "background", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  PlatformController.createPlatform
);

platformRoutes.get("/all", PlatformController.getAllPlatforms);

platformRoutes.put(
  "/:id",
  uploadImage.fields([
    { name: "background", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  PlatformController.updatePlatform
);

platformRoutes.get("/:id", PlatformController.getPlatformById);

platformRoutes.delete("/:id", PlatformController.deletePlatform);

export default platformRoutes;
