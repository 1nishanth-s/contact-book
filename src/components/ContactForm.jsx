import { useEffect, useState } from "react";
import { API_URL } from "../config";

function ContactForm({ contact, onContactSaved }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || "",
        phone: contact.phone || "",
        email: contact.email || "",
        address: contact.address || "",
      });
    }
  }, [contact]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      alert("Name and phone are required");
      return;
    }

    try {
      const url = contact ? `${API_URL}/${contact._id}` : API_URL;

      const method = contact ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Operation failed");
      }

      const savedContact = await response.json();
      onContactSaved(savedContact);

      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="form-wrap">
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <span className="form-badge">Contact</span>
          <h2>{contact ? "Edit Profile" : "Add New Contact"}</h2>
        </div>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="form-input"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="form-input"
        />

        <button type="submit" className="primary-btn">
          {contact ? "Update Contact" : "Add Contact"}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;