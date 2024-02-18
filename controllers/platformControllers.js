import Platform from "../models/Platform.js";

export const PlatformController = {
  createPlatform: async (req, res) => {
    try {
      const { name, activeColor } = req.body;

      const backgroundImagePath = req.files?.background?.[0]?.path;
      const iconImagePath = req.files?.icon?.[0]?.path;

      const newPlatform = new Platform({
        name,
        activeColor,
        background: backgroundImagePath,
        icon: iconImagePath,
      });

      const savedPlatform = await newPlatform.save();
      res.json(savedPlatform);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getAllPlatforms: async (req, res) => {
    try {
      const platforms = await Platform.find();
      res.json(platforms);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getPlatformById: async (req, res) => {
    try {
      const platform = await Platform.findById(req.params.id);

      if (!platform) {
        return res.status(404).json({ message: "Platform not found" });
      }

      return res.status(200).json(platform);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  updatePlatform: async (req, res) => {
    try {
      const { name, activeColor } = req.body;
      const backgroundImagePath = req.files?.background?.[0]?.path;
      const iconImagePath = req.files?.icon?.[0]?.path;

      const updatedPlatform = await Platform.findByIdAndUpdate(
        req.params.id,
        {
          name,
          activeColor,
          background: backgroundImagePath,
          icon: iconImagePath,
        },
        { new: true }
      );
      if (!updatedPlatform) {
        return res.status(404).json({ error: "Platform not found" });
      }
      return res.status(200).json(updatedPlatform);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deletePlatform: async (req, res) => {
    try {
      const deletedPlatform = await Platform.findByIdAndDelete(req.params.id);

      if (!deletedPlatform) {
        return res.status(404).json({ message: "Platform not found" });
      }

      return res.status(200).json({ status: "Platform Deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getEightPlatforms: async (req, res) => {
    try {
      const platfroms = await Platform.find().limit(8);
      return res.status(200).json(platfroms);
    } catch (error) {
      return res.status(404).json({ status: 400, error: error.message });
    }
  },
};
