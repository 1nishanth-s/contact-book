import { useState } from "react";
import { Copy, Eye, Mail, MapPin, Pencil, Phone, Star, Trash2 } from "lucide-react";

function ContactItem({ contact, onEdit, onDelete, onToggleFavorite, onViewDetails, isFavorite }) {
  const [copiedField, setCopiedField] = useState("");

  const handleCopy = async (field, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(""), 1400);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div className="contact-card">
      <div className="card-top">
        <div className="avatar">{contact.name?.charAt(0)?.toUpperCase() || "C"}</div>
        <div className="card-title-wrap">
          <h3>{contact.name}</h3>
          <span className="card-tag">Contact</span>
        </div>
        <button
          type="button"
          className={`favorite-btn ${isFavorite ? "favorite-active" : ""}`}
          onClick={() => onToggleFavorite(contact._id)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star size={19} fill={isFavorite ? "currentColor" : "none"} aria-hidden="true" />
        </button>
      </div>

      <div className="contact-info">
        <p>
          <strong><Phone size={14} aria-hidden="true" /> Phone</strong>
          <span className="contact-value-row">
            {contact.phone}
            <button type="button" className="copy-btn" onClick={() => handleCopy("phone", contact.phone)} title="Copy phone number" aria-label="Copy phone number">
              <Copy size={14} aria-hidden="true" />
            </button>
            {copiedField === "phone" && <em>Copied</em>}
          </span>
        </p>

        {contact.email && (
          <p>
            <strong><Mail size={14} aria-hidden="true" /> Email</strong>
            <span className="contact-value-row">
              {contact.email}
              <button type="button" className="copy-btn" onClick={() => handleCopy("email", contact.email)} title="Copy email address" aria-label="Copy email address">
                <Copy size={14} aria-hidden="true" />
              </button>
              {copiedField === "email" && <em>Copied</em>}
            </span>
          </p>
        )}

        {contact.address && (
          <p>
            <strong><MapPin size={14} aria-hidden="true" /> Address</strong>
            <span>{contact.address}</span>
          </p>
        )}
      </div>

      <div className="card-actions">
        <button className="details-btn" onClick={() => onViewDetails(contact)}>
          <Eye size={15} aria-hidden="true" />
          Details
        </button>
        <button className="edit-btn" onClick={() => onEdit(contact)}>
          <Pencil size={15} aria-hidden="true" />
          Edit
        </button>
        <button className="delete-btn" onClick={() => onDelete(contact._id)}>
          <Trash2 size={15} aria-hidden="true" />
          Delete
        </button>
      </div>
    </div>
  );
}

export default ContactItem;