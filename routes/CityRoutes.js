import express from "express";
import { cityController } from "../controllers/CityController.js";
import { verifyToken, checkRole } from "../middleware/Authentication.js";

const cityRoutes = express.Router();

cityRoutes.post("/create", cityController.createCity);
cityRoutes.get("/all", cityController.getAllCities);
cityRoutes.get("/:id", cityController.getCityById);
cityRoutes.put("/:id", cityController.updateCity);
cityRoutes.delete("/:id", cityController.deleteCity);

export default cityRoutes;
