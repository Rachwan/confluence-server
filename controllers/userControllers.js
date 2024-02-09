import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userController = {
  // Register
  register: async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
      if (!password || typeof password !== "string") {
        return res
          .status(400)
          .json({ error: "Invalid password in the request body" });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: role || "influencer",
      });
      await newUser.save();

      const isSecure = process.env.NODE_ENV === "production";
      const token = jwt.sign(
        { _id: newUser._id, role: newUser.role, email, name },
        process.env.SECRET_TOKEN,
        { expiresIn: "24h" }
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: isSecure,
        sameSite: "None",
      });

      return res.status(201).json(newUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // get one user
  getOneUser: async (req, res) => {
    const userId = req.user._id;
    try {
      const user = await User.findById(userId);
      if (user) {
        return res.status(200).json(user);
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: "Internal Server Error" + error.message });
    }
  },

  // Update all users
  getAllUsers: async (req, res) => {
    try {
      const allUsers = await User.find();
      return res.status(200).json(allUsers);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Update the user
  updateUserById: async (req, res) => {
    try {
      const { name, password, oldPasswordInput, role } =
        req.body;

      if (password && (typeof password !== "string" || password.length === 0)) {
        return res
          .status(400)
          .json({ message: "Invalid password in the request body" });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let isOldPasswordValid = true;

      if (password) {
        // If a new password is provided, check the old password
        isOldPasswordValid = await bcrypt.compare(
          oldPasswordInput,
          user.password
        );

        if (!isOldPasswordValid) {
          return res.status(401).json({ message: "Invalid old password" });
        }
      }

      const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : undefined;

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          name,
          ...(hashedPassword && { password: hashedPassword }),
          role,
        },
        {
          new: true,
        }
      );

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
        return;
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "key one" + error.message });
    }
  },

  // Delete a user by ID
  deleteUserById: async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

export default userController;
