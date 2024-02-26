import User from "../models/User.js";
import bcrypt, { compareSync } from "bcrypt";
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

  // Admin add users
  adminAddUsers: async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        age,
        gender,
        number,
        platforms,
        cityId,
        categoryId,
        role,
      } = req.body;
      const profileImagePath = req.files?.profile?.[0]?.path;
      const backgroundImagePath = req.files?.background?.[0]?.path;

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
            link: platform.link,
          }))
        : undefined;

      const totalFollowers = platforms.reduce(
        (sum, platform) => sum + BigInt(platform.followers),
        BigInt(0)
      );
      const totalFollowersNumber = Number(totalFollowers);

      const newUser = new User({
        name,
        email,
        age,
        gender,
        number,
        platforms: platformsData,
        totalFollowers: totalFollowersNumber,
        profile: profileImagePath,
        background: backgroundImagePath,
        password: hashedPassword,
        cityId,
        categoryId,
        role,
      });
      await newUser.save();

      // const isSecure = process.env.NODE_ENV === "production";
      // const token = jwt.sign(
      //   { _id: newUser._id, role: newUser.role, email, name },
      //   process.env.SECRET_TOKEN,
      //   { expiresIn: "24h" }
      // );
      // res.cookie("token", token, {
      //   httpOnly: true,
      //   secure: isSecure,
      //   sameSite: "None",
      // });

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
        gender,
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
            link: platform.link,
          })))
        : undefined;

      const totalFollowers = platforms.reduce(
        (sum, platform) => sum + BigInt(platform.followers),
        BigInt(0)
      );
      const totalFollowersNumber = Number(totalFollowers);

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
          gender,
          number,
          platforms: platformsData,
          totalFollowers: totalFollowersNumber,
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
      const allUsers = await User.find()
        .sort({ createdAt: -1 })
        .populate(["cityId", "categoryId", "platforms.platformId"]);
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

      const users = await User.find({ role })
        .sort({ createdAt: -1 })
        .populate(["cityId", "categoryId", "platforms.platformId"]);

      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Get the lastest 8 influencers
  getNewestInfluencers: async (req, res) => {
    try {
      const role = "influencer";

      const newestInfluencers = await User.find({ role })
        .sort({ createdAt: -1 })
        .limit(8)
        .populate(["cityId", "categoryId", "platforms.platformId"]);

      res.json(newestInfluencers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Get the lastest 5 businesses
  getNewestBusinesses: async (req, res) => {
    try {
      const role = "business";

      const newestBusinesses = await User.find({ role })
        .sort({ createdAt: -1 })
        .limit(5);

      res.json(newestBusinesses);
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
        req.query;

      // Conditions
      const conditionsArray = [];

      // Categories
      if (categories && categories.length > 0) {
        conditionsArray.push({ categoryId: { $in: categories } });
      }

      // Cities
      if (cities && cities.length > 0) {
        conditionsArray.push({ cityId: { $in: cities } });
      }

      // platforms

      if (platformId && platformRange && platformRange.length > 0) {
        const totalRangeForPlatforms = {
          "<10K": { followers: { $lt: 10000 } },
          "10K-100K": { followers: { $gte: 10000, $lt: 100000 } },
          "100K-500K": { followers: { $gte: 100000, $lt: 500000 } },
          "500K-1M": { followers: { $gte: 500000, $lt: 1000000 } },
          "1M+": { followers: { $gte: 1000000 } },
        };
        const platformConditions = {
          $or: platformRange.map((range) => ({
            platforms: {
              $elemMatch: {
                platformId: platformId,
                ...totalRangeForPlatforms[range],
              },
            },
          })),
        };
        conditionsArray.push(platformConditions);
      }

      // Total followers

      const totalRangeConditions = {
        "<10K": { totalFollowers: { $lt: 10000 } },
        "10K-100K": { totalFollowers: { $gte: 10000, $lt: 100000 } },
        "100K-500K": { totalFollowers: { $gte: 100000, $lt: 500000 } },
        "500K-1M": { totalFollowers: { $gte: 500000, $lt: 1000000 } },
        "1M+": { totalFollowers: { $gte: 1000000 } },
      };

      if (totalRange && totalRange.length > 0) {
        console.log("totalRange", totalRange);
        const totalConditions = totalRange.map(
          (range) => totalRangeConditions[range]
        );
        conditionsArray.push({ $or: totalConditions });
      }

      // Final

      const users = await User.find({
        role: "influencer",
        $and: conditionsArray,
      }).populate(["categoryId", "cityId", "platforms.platformId"]);

      res.status(200).json(users);
    } catch (error) {
      res.status(404).json({ status: 404, error: error.message });
    }
  },
};

export default userController;
