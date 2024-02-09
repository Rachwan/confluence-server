import Contact from "../models/Contact.js";

export const contactController = {
  createContact: async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    try {
      const contact = await Contact.create({ name, email, phone, subject, message });
      if (contact) {
        return res.status(200).json(contact);
      } else {
        return res
          .status(500)
          .json({ status: 500, error: "Error creating contact" });
      }
    } catch (error) {
      return res.status(404).json({ status: 404, message: error.message });
    }
  },

  getContacts: async (req, res) => {
    try {
      const contacts = await Contact.find();
      if (!contacts) {
        return res.status(400).json("Contacts Not Found");
      }
      return res.status(200).json(contacts);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  },

  deleteContact: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedContact = await Contact.findByIdAndDelete(id);
      if (!deletedContact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      return res.status(200).json({ status: "Contact Deleted" });
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  },
};
