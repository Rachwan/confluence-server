import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";

export const userController = {
  // Register for all users
  register: async (req, res) => {
    const { name, email, password, number, role } = req.body;
    const profileImagePath = req.files?.profile?.[0]?.path;
    const backgroundImagePath = req.files?.background?.[0]?.path;
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
        number,
        profile: profileImagePath,
        background: backgroundImagePath,
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

  // Admin add an influencer
  adminAddInfluencer: async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        age,
        number,
        platforms,
        cityId,
        categoryId,
      } = req.body;
      const profileImagePath = req.files?.profile?.[0]?.path;
      const backgroundImagePath = req.files?.background?.[0]?.path;
      console.log(profileImagePath, backgroundImagePath);

      console.log("platforms", platforms);

      // Password + Check if the user alerady there
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

      const platformsData = platforms
        ? platforms.map((platform) => ({
            platformId: platform.platformId,
            followers: platform.followers,
          }))
        : undefined;

      const newUser = new User({
        name,
        email,
        age,
        number,
        platforms: platformsData,
        profile: profileImagePath,
        background: backgroundImagePath,
        password: hashedPassword,
        cityId,
        categoryId,
        role: "influencer",
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

  // Update the user
  updateUserById: async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        age,
        number,
        platforms,
        cityId,
        categoryId,
        oldPasswordInput,
        role,
      } = req.body;

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

      const profileImagePath = req.files?.profile?.[0]?.path;
      const backgroundImagePath = req.files?.background?.[0]?.path;

      // Update platforms
      const platformsData = platforms
        ? (user.platforms = platforms.map((platform) => ({
            platformId: platform.platformId,
            followers: platform.followers,
          })))
        : undefined;

      // Delete old images
      if (
        profileImagePath &&
        user.profile &&
        user.profile !== profileImagePath
      ) {
        fs.unlinkSync(user.profile);
      }

      if (
        backgroundImagePath &&
        user.background &&
        user.profile !== backgroundImagePath
      ) {
        fs.unlinkSync(user.background);
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          name,
          email,
          age,
          number,
          platforms: platformsData,
          background: backgroundImagePath,
          profile: profileImagePath,
          cityId,
          categoryId,
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

  // Get one user
  getOneUser: async (req, res) => {
    const userId = req.user._id;
    try {
      const user = await User.findById(userId).populate([
        "cityId",
        "categoryId",
        "platforms.platformId",
      ]);
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

  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const allUsers = await User.find().populate([
        "cityId",
        "categoryId",
        "platforms.platformId",
      ]);
      return res.status(200).json(allUsers);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Get User by role
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate([
        "cityId",
        "categoryId",
        "platforms.platformId",
      ]);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "key one" + error.message });
    }
  },

  // Get Users by role

  getUsersByRole: async (req, res) => {
    try {
      const { role } = req.params;

      if (!["admin", "influencer", "business"].includes(role)) {
        return res.status(400).json({ error: "Invalid role provided" });
      }

      const users = await User.find({ role }).populate([
        "cityId",
        "categoryId",
        "platforms.platformId",
      ]);

      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
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

  // Get Related users
  getRelated: async (req, res) => {
    const { categoryId, userId } = req.query;

    try {
      const users = await User.find({
        categoryId: categoryId,
        role: "influencer",
        _id: { $ne: userId },
      })
        .limit(5)
        .populate(["categoryId", "cityId", "platforms.platformId"]);

      return res.status(200).json(users);
    } catch (error) {
      return res.status(404).json({ status: 400, error: error.message });
    }
  },

  getByCategory: async (req, res) => {
    let categoryId = req.params;
    try {
      const users = await User.find({ categoryId: categoryId });
      return res.status(200).json(users);
    } catch (error) {
      return res.status(404).json({ status: 404, error: error });
    }
  },

  getByFilter: async (req, res) => {
    try {
      const { categories, platformId, platformRange, cities, totalRange } =
        req.body;
      const conditions = [];
      if (categories && categories.length > 0) {
        conditions.push({ categoryId: { $in: categories } }); // categories (platforms,cities) categoryId $in categories
      }
      if (cities && cities.length > 0) {
        conditions.push({ categoryId: { $in: cities } }); // categories (platforms,cities) categoryId $in categories
      }

      if (platformId && platformRange) {
        conditions.push({
          platforms: {
            $elemMatch: {
              platformId: platformId,
              followers: {
                $gte: Number(platformRange[0]),
                $lte: Number(platformRange[1]),
              },
            },
          },
        });
      }

      if (totalRange && totalRange.length > 0) {
        const totalConditions = [];
        totalRange.forEach((range) => {
          if (Number(range) === 1) {
            totalConditions.push({ total: { $gt: 0, $lte: 15 } });
          }
          if (Number(range) === 2) {
            totalConditions.push({ total: { $gt: 15, $lte: 30 } });
          }

          if (Number(range) === 3) {
            totalConditions.push({ total: { $gt: 30, $lte: 45 } });
          }
          if (Number(range) === 4) {
            totalConditions.push({ total: { $gt: 45 } });
          }
        });
        conditions.push({ $or: totalConditions });
      }
      const users = await User.find({
        $and: conditions,
      });

      res.status(200).json(users);
    } catch (error) {
      res.status(404).json({ status: 404, error: error.message });
    }
  },
};

export default userController;
