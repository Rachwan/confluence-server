import { Router } from "express";
import { collaborationController } from "../controllers/collaborationControllers.js";
import uploadImage from "../middleware/multer.js";

const collaborationRoutes = Router();

collaborationRoutes.post(
  "/create",
  uploadImage.fields([
    { name: "background", maxCount: 1 },
    { name: "firstImage", maxCount: 1 },
    { name: "secondImage", maxCount: 1 },
    { name: "thirdImage", maxCount: 1 },
    { name: "fourthImage", maxCount: 1 },
  ]),
  collaborationController.createCollaboration
);

collaborationRoutes.get("/all", collaborationController.getAllCollaborations);

collaborationRoutes.put(
  "/:id",
  uploadImage.fields([
    { name: "background", maxCount: 1 },
    { name: "firstImage", maxCount: 1 },
    { name: "secondImage", maxCount: 1 },
    { name: "thirdImage", maxCount: 1 },
    { name: "fourthImage", maxCount: 1 },
  ]),
  collaborationController.editCollaboration
);

collaborationRoutes.get("/:id", collaborationController.getCollaborationById);

collaborationRoutes.delete("/:id", collaborationController.deleteCollaboration);

collaborationRoutes.get(
  "/usercollaborations/:userId",
  collaborationController.getCollaborationsForUser
);
collaborationRoutes.get(
  "/userfourcollaborations/:userId/:collabId",
  collaborationController.getFourCollaborationsForUser
);

collaborationRoutes.get(
  "/get/newesteight",
  collaborationController.getNewestCollaborations
);

collaborationRoutes.get("/related/five", collaborationController.getRelated);

export default collaborationRoutes;
