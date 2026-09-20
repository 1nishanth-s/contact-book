import ContactItem from "./ContactItem";

function ContactList({
  contacts,
  onEdit,
  onDelete,
  onToggleFavorite,
  onViewDetails,
  favoriteIds = [],
  view = "all",
  sortOrder = "name",
}) {
  const sortContacts = (contactGroup) => [...contactGroup].sort((firstContact, secondContact) => {
    if (sortOrder === "recent") {
      return new Date(secondContact.createdAt || 0) - new Date(firstContact.createdAt || 0);
    }

    return (firstContact.name || "").localeCompare(secondContact.name || "", undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  const visibleContacts = view === "favorites"
    ? contacts.filter((contact) => favoriteIds.includes(contact._id))
    : contacts;

  if (visibleContacts.length === 0) {
    return <p className="empty-state">{view === "favorites" ? "No favorite contacts found." : "No contacts found."}</p>;
  }

  const favoriteContacts = sortContacts(
    visibleContacts.filter((contact) => favoriteIds.includes(contact._id))
  );
  const otherContacts = sortContacts(
    visibleContacts.filter((contact) => !favoriteIds.includes(contact._id))
  );

  const renderContacts = (contactGroup) => (
    <div className="contact-list">
      {contactGroup.map((contact) => (
        <ContactItem
          key={contact._id}
          contact={contact}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
          onViewDetails={onViewDetails}
          isFavorite={favoriteIds.includes(contact._id)}
        />
      ))}
    </div>
  );

  return (
    <div className="contact-sections">
      {favoriteContacts.length > 0 && (
        <section className="contact-section">
          <div className="section-heading">
            <h2>Favorites</h2>
            <span>{favoriteContacts.length}</span>
          </div>
          {renderContacts(favoriteContacts)}
        </section>
      )}

      {otherContacts.length > 0 && (
        <section className="contact-section">
          <div className="section-heading">
            <h2>All Contacts</h2>
            <span>{otherContacts.length}</span>
          </div>
          {renderContacts(otherContacts)}
        </section>
      )}
    </div>
  );
}

export default ContactList;