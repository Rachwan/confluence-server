import Soon from '../models/Soon.js';

export const soonController = {
  createSoon: async (req, res) => {
    try {
      const { email } = req.body;
      const newSoon = new Soon({ email });
      const savedSoon = await newSoon.save();
      return res.status(201).json(savedSoon);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAllSoon: async (req, res) => {
    try {
      const soon = await Soon.find();
      if (!soon) {
        return res.status(404).json({ error: "There is no Soon emails yet." });
      }
      return res.status(200).json(soon);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getSoonById: async (req, res) => {
    try {
      const soon = await Soon.findById(req.params.id);
      if (!soon) {
        return res.status(404).json({ error: "Soon email not found" });
      }
      return res.status(200).json(soon);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteSoon: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedSoon = await Soon.findByIdAndDelete(id);
      if (!deletedSoon) {
        return res.status(404).json({ error: "Soon email not found" });
      }
      return res.status(200).json({ status: "Soon email Deleted" });
    } catch (error) {
      return res.status(404).json(error.message);
    }
  },
};
