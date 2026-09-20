let contacts = [];
let nextId = 1;

const normalizeContact = (contact) => ({
  ...contact,
  _id: String(contact._id),
});

const listContacts = () => contacts.map((contact) => normalizeContact(contact));

const getContactById = (id) => {
  const contact = contacts.find((item) => String(item._id) === String(id));
  return contact ? normalizeContact(contact) : null;
};

const createContact = (data) => {
  const newContact = {
    _id: String(nextId++),
    name: data.name || "",
    phone: data.phone || "",
    email: data.email || "",
    address: data.address || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  contacts.unshift(newContact);
  return normalizeContact(newContact);
};

const updateContact = (id, data) => {
  const contactIndex = contacts.findIndex((item) => String(item._id) === String(id));

  if (contactIndex === -1) {
    return null;
  }

  const updatedContact = {
    ...contacts[contactIndex],
    ...data,
    _id: String(id),
    updatedAt: new Date().toISOString(),
  };

  contacts[contactIndex] = updatedContact;
  return normalizeContact(updatedContact);
};

const deleteContact = (id) => {
  const contact = contacts.find((item) => String(item._id) === String(id));

  if (!contact) {
    return null;
  }

  contacts = contacts.filter((item) => String(item._id) !== String(id));
  return contact;
};

module.exports = {
  listContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
