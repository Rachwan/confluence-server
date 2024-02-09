import { Router } from "express";
import { collaborationController } from "../controllers/collaborationControllers.js";
import uploadImage from "../middleware/multer.js";

const collaborationRoutes = Router();

// Create a new collaboration
collaborationRoutes.post(
  "/create",
  uploadImage.fields([
    { name: "background", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  collaborationController.createCollaboration
);

collaborationRoutes.get("/all", collaborationController.getAllCollaborations);

collaborationRoutes.put(
  "/:id",
  uploadImage.fields([
    { name: "background", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  collaborationController.editCollaboration
);

collaborationRoutes.get("/:id", collaborationController.getCollaborationById);

collaborationRoutes.delete("/:id", collaborationController.deleteCollaboration);

export default collaborationRoutes;
