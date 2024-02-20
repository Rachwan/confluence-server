import City from "../models/City.js";

export const cityController = {
  createCity: async (req, res) => {
    try {
      const { name } = req.body;
      const newCity = new City({ name });
      const savedCity = await newCity.save();
      return res.status(201).json(savedCity);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAllCities: async (req, res) => {
    try {
      const cities = await City.find().sort({ createdAt: -1 });
      if (!cities) {
        return res.status(404).json({ error: "There is no cities yet." });
      }
      return res.status(200).json(cities);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getCityById: async (req, res) => {
    try {
      const city = await City.findById(req.params.id);
      if (!city) {
        return res.status(404).json({ error: "City not found" });
      }
      return res.status(200).json(city);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateCity: async (req, res) => {
    try {
      const updatedCity = await City.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedCity) {
        return res.status(404).json({ error: "City not found" });
      }
      return res.status(200).json(updatedCity);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteCity: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedCity = await City.findByIdAndDelete(id);
      if (!deletedCity) {
        return res.status(404).json({ error: "City not found" });
      }
      return res.status(200).json({ status: "City Deleted" });
    } catch (error) {
      return res.status(404).json(error.message);
    }
  },
};
