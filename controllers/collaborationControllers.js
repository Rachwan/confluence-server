import Collaboration from "../models/Collaboration.js";

export const collaborationController = {
  createCollaboration: async (req, res) => {
    try {
      const { title, platforms, description, singleTitle, additional, userId } =
        req.body;

      const backgroundImagePath = req.files?.background?.[0]?.path;
      const allImages = req.files.images.map((file) => file.path);

      const newCollaboration = new Collaboration({
        title,
        background: backgroundImagePath,
        platforms,
        images: allImages,
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
      const allImages = req.files?.images.map((file) => file.path);

      const collaborationId = req.params.id;

      const updatedCollaboration = await Collaboration.findByIdAndUpdate(
        collaborationId,
        {
          title,
          background: backgroundImagePath,
          platforms,
          images: allImages,
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
      const collaborations = await Collaboration.find().populate(["userId"]);
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
      ).populate(["userId"]);
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
};
