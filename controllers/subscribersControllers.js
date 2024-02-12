import Subscribers from "../models/Subscribers.js";

export const subscribersController = {
  createSubscriber: async (req, res) => {
    try {
      const { email } = req.body;
      const newSubscriber = new Subscribers({ email });
      const savednewSubscriber = await newSubscriber.save();
      return res.status(201).json(savednewSubscriber);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAllSubscribers: async (req, res) => {
    try {
      const allSubscribers = await Subscribers.find();
      if (!allSubscribers) {
        return res
          .status(404)
          .json({ error: "There is Subscribers emails yet." });
      }
      return res.status(200).json(allSubscribers);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getSubscriberById: async (req, res) => {
    try {
      const oneSubscriber = await Subscribers.findById(req.params.id);
      if (!oneSubscriber) {
        return res.status(404).json({ error: "Subscriber email not found" });
      }
      return res.status(200).json(oneSubscriber);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteSubscriber: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedSubscriber = await Subscribers.findByIdAndDelete(id);
      if (!deletedSubscriber) {
        return res.status(404).json({ error: "Subscriber email not found" });
      }
      return res.status(200).json({ status: "Subscriber email Deleted" });
    } catch (error) {
      return res.status(404).json(error.message);
    }
  },
};
