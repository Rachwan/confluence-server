import express from "express";
import { subscribersController } from "../controllers/subscribersControllers.js";
import { verifyToken, checkRole } from "../middleware/authentication.js";

const subscriberRoutes = express.Router();

subscriberRoutes.post("/create", subscribersController.createSubscriber);
subscriberRoutes.get("/all", subscribersController.getAllSubscribers);
subscriberRoutes.get("/:id", subscribersController.getSubscriberById);
subscriberRoutes.delete("/:id", subscribersController.deleteSubscriber);

export default subscriberRoutes;
