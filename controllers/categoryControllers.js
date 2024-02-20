import Category from "../models/Category.js";

export const CategoryController = {
  createCategory: async (req, res) => {
    try {
      const { name, activeColor } = req.body;

      const backgroundImagePath = req.files?.background?.[0]?.path;
      const iconImagePath = req.files?.icon?.[0]?.path;

      const newCategory = new Category({
        name,
        activeColor,
        background: backgroundImagePath,
        icon: iconImagePath,
      });

      const savedCategory = await newCategory.save();
      res.json(savedCategory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      res.json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.status(200).json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { name, activeColor } = req.body;
      const backgroundImagePath = req.files?.background?.[0]?.path;
      const iconImagePath = req.files?.icon?.[0]?.path;

      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        {
          name,
          activeColor,
          background: backgroundImagePath,
          icon: iconImagePath,
        },
        { new: true }
      );
      if (!updatedCategory) {
        return res.status(404).json({ error: "Category not found" });
      }
      return res.status(200).json(updatedCategory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const deletedCategory = await Category.findByIdAndDelete(req.params.id);

      if (!deletedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.status(200).json({ status: "Category Deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getEightCategories: async (req, res) => {
    try {
      const categories = await Category.find().limit(8);
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(404).json({ status: 400, error: error.message });
    }
  },
};
