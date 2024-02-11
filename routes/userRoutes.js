import express from "express";
import userController from "../controllers/userControllers.js";
import { verifyToken, checkRole } from '../middleware/authentication.js';
import uploadImage from "../middleware/multer.js";

export const userRoutes = express.Router();

userRoutes.post('/register',
uploadImage.fields([
  { name: "background", maxCount: 1 },
  { name: "profile", maxCount: 1 },
]), userController.register);

userRoutes.get('/all', verifyToken, checkRole(["admin"]), userController.getAllUsers);
userRoutes.get('/:id', verifyToken, userController.getUserById);
userRoutes.put('/:id', verifyToken, userController.updateUserById);
userRoutes.delete('/:id', verifyToken, checkRole(["admin"]), userController.deleteUserById);

userRoutes.get('/read/one', verifyToken, userController.getOneUser);

export default userRoutes;