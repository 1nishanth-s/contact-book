const express = require("express");
const router = express.Router();

const {
  listContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} = require("../data/inMemoryContacts");

router.post("/", (req, res) => {
  try {
    const { name, phone, email, address } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    const savedContact = createContact({ name, phone, email, address });
    res.status(201).json(savedContact);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create contact",
      error: error.message,
    });
  }
});

router.get("/", (req, res) => {
  try {
    res.json(listContacts());
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch contacts",
      error: error.message,
    });
  }
});

router.get("/:id", (req, res) => {
  try {
    const contact = getContactById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch contact",
      error: error.message,
    });
  }
});

router.put("/:id", (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    const updatedContact = updateContact(req.params.id, { name, phone, email, address });

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update contact",
      error: error.message,
    });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const deletedContact = deleteContact(req.params.id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete contact",
      error: error.message,
    });
  }
});

module.exports = router;