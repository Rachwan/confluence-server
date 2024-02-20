import Collaboration from "../models/Collaboration.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const collaborationController = {
  createCollaboration: async (req, res) => {
    try {
      const { title, platforms, description, singleTitle, additional, userId } =
        req.body;
      const backgroundImagePath = req.files?.background?.[0]?.path;

      const firstImagePath = req.files?.firstImage?.[0]?.path;
      const secondImagePath = req.files?.secondImage?.[0]?.path;
      const thirdImagePath = req.files?.thirdImage?.[0]?.path;
      const fourthImagePath = req.files?.fourthImage?.[0]?.path;

      const newCollaboration = new Collaboration({
        title,
        background: backgroundImagePath,
        platforms,
        // images: allImages,
        firstImage: firstImagePath,
        secondImage: secondImagePath,
        thirdImage: thirdImagePath,
        fourthImage: fourthImagePath,
        description,
        singleTitle,
        additional,
        userId,
      });

      const savedCollaboration = await newCollaboration.save();
      res.json(savedCollaboration);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  editCollaboration: async (req, res) => {
    try {
      const { title, platforms, description, singleTitle, additional } =
        req.body;
      const backgroundImagePath = req.files?.background?.[0]?.path;

      const firstImagePath = req.files?.firstImage?.[0]?.path;
      const secondImagePath = req.files?.secondImage?.[0]?.path;
      const thirdImagePath = req.files?.thirdImage?.[0]?.path;
      const fourthImagePath = req.files?.fourthImage?.[0]?.path;

      // const allImages = req.files?.images?.map((file) => file.path);

      const collaborationId = req.params.id;

      const updatedCollaboration = await Collaboration.findByIdAndUpdate(
        collaborationId,
        {
          title,
          background: backgroundImagePath,
          platforms,
          firstImage: firstImagePath,
          secondImage: secondImagePath,
          thirdImage: thirdImagePath,
          fourthImage: fourthImagePath,
          description,
          singleTitle,
          additional,
        },
        { new: true }
      );

      if (!updatedCollaboration) {
        return res.status(404).json({ error: "Collaboration not found" });
      }
      return res.status(200).json(updatedCollaboration);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getAllCollaborations: async (req, res) => {
    try {
      const collaborations = await Collaboration.find()
        .sort({ createdAt: -1 })
        .populate({
          path: "userId",
          populate: [
            { path: "categoryId" },
            { path: "cityId" },
            { path: "platforms.platformId" },
          ],
        });
      res.json(collaborations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getCollaborationById: async (req, res) => {
    try {
      const collaborationId = req.params.id;
      const collaboration = await Collaboration.findById(
        collaborationId
      ).populate({
        path: "userId",
        populate: [
          { path: "categoryId" },
          { path: "cityId" },
          { path: "platforms.platformId" },
        ],
      });
      if (!collaboration) {
        return res.status(404).json({ message: "Collaboration not found" });
      }

      return res.status(200).json(collaboration);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deleteCollaboration: async (req, res) => {
    try {
      const collaborationId = req.params.id;
      const deletedCollaboration = await Collaboration.findByIdAndDelete(
        collaborationId
      );

      if (!deletedCollaboration) {
        return res.status(404).json({ message: "Collaboration not found" });
      }

      return res.status(200).json({ status: "Collaboration Deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getCollaborationsForUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const collaborations = await Collaboration.find({ userId })
        .sort({ createdAt: -1 })
        .populate({
          path: "userId",
          populate: [
            { path: "categoryId" },
            { path: "cityId" },
            { path: "platforms.platformId" },
          ],
        });
      res.status(200).json(collaborations);
    } catch (error) {
      console.error("Error fetching collaborations:", error);
    }
  },

  getRelated: async (req, res) => {
    try {
      const { userId } = req.query;

      const user = await User.findById(userId);
      const userCategory = user.categoryId._id;

      if (!userCategory) {
        return res.status(404).json({ error: "User category not found" });
      }

      const collaborations = await Collaboration.aggregate([
        {
          $match: {
            userId: { $ne: new mongoose.Types.ObjectId(userId) },
          },
        },
        {
          $lookup: {
            from: "users",
            let: { userId: "$userId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$userId"] },
                  categoryId: new mongoose.Types.ObjectId(userCategory),
                },
              },
            ],
            as: "userId",
          },
        },
        {
          $unwind: "$userId",
        },
        {
          $limit: 5,
        },
      ]);
      res.status(200).json(collaborations);
    } catch (error) {
      console.error("Error fetching collaborations:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getNewestCollaborations: async (req, res) => {
    try {
      const newestCollaborations = await Collaboration.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .populate({
          path: "userId",
          populate: [
            { path: "categoryId" },
            { path: "cityId" },
            { path: "platforms.platformId" },
          ],
        });

      res.json(newestCollaborations);
    } catch (error) {
      console.error("Error fetching newest collaborations:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
