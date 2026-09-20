import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import { LogOut, Plus, Users, X } from "lucide-react";

import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import SearchBar from "./components/SearchBar";
import { API_URL } from "./config";
import "./App.css";

const AUTH_KEY = "phonebook_user";
const USERS_KEY = "phonebook_users";

function getFavoritesKey(userId) {
  return `phonebook_favorites_${userId}`;
}

function getStoredUser() {
  try {
    const saved = localStorage.getItem(AUTH_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function Home({ user, onLogout }) {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [contactView, setContactView] = useState("all");
  const [sortOrder, setSortOrder] = useState("name");
  const [selectedContact, setSelectedContact] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const storedFavorites = JSON.parse(
        localStorage.getItem(getFavoritesKey(user.id)) || "[]"
      );

      return Array.isArray(storedFavorites) ? storedFavorites : [];
    } catch {
      return [];
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(getFavoritesKey(user.id), JSON.stringify(favoriteIds));
  }, [favoriteIds, user.id]);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    loadContacts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this contact?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEdit = (contact) => {
    navigate(`/edit/${contact._id}`);
  };

  const handleToggleFavorite = (id) => {
    setFavoriteIds((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id]
    );
  };

  const handleViewDetails = (contact) => {
    setSelectedContact(contact);
  };

  const filteredContacts = contacts.filter((contact) => {
    const searchValue = searchTerm.toLowerCase();

    return (
      contact.name?.toLowerCase().includes(searchValue) ||
      contact.phone?.toLowerCase().includes(searchValue) ||
      contact.email?.toLowerCase().includes(searchValue) ||
      contact.address?.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Directory</p>
          <h1>Contact Book</h1>
        </div>

        <div className="topbar-actions">
          <span className="user-badge">
            <Users size={15} aria-hidden="true" />
            Hi, {user?.name || "User"}
          </span>
          <Link to="/add" className="nav-btn">
            <Plus size={17} aria-hidden="true" />
            Add Contact
          </Link>
          <button type="button" className="logout-btn" onClick={onLogout}>
            <LogOut size={16} aria-hidden="true" />
            Logout
          </button>
        </div>
      </header>

      <section className="content-panel">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        <div className="list-toolbar">
          <div className="view-tabs" aria-label="Contact view">
            <button
              type="button"
              className={contactView === "all" ? "view-tab active" : "view-tab"}
              onClick={() => setContactView("all")}
              aria-pressed={contactView === "all"}
            >
              All contacts
            </button>
            <button
              type="button"
              className={contactView === "favorites" ? "view-tab active" : "view-tab"}
              onClick={() => setContactView("favorites")}
              aria-pressed={contactView === "favorites"}
            >
              Favorites
            </button>
          </div>

          <label className="sort-control">
            <span>Sort by</span>
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
              <option value="name">A-Z</option>
              <option value="recent">Recently added</option>
            </select>
          </label>
        </div>

        <ContactList
          contacts={filteredContacts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          onViewDetails={handleViewDetails}
          favoriteIds={favoriteIds}
          view={contactView}
          sortOrder={sortOrder}
        />
      </section>

      {selectedContact && (
        <ContactDetailsModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
        />
      )}
    </div>
  );
}

function ContactDetailsModal({ contact, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="details-header">
          <div>
            <p className="eyebrow">Contact details</p>
            <h2 id="details-title">{contact.name}</h2>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close details" title="Close details">
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        <div className="details-avatar">{contact.name?.charAt(0)?.toUpperCase() || "C"}</div>
        <dl className="details-list">
          <div><dt>Phone</dt><dd>{contact.phone}</dd></div>
          {contact.email && <div><dt>Email</dt><dd>{contact.email}</dd></div>}
          {contact.address && <div><dt>Address</dt><dd>{contact.address}</dd></div>}
        </dl>
      </section>
    </div>
  );
}

function AddContact({ user }) {
  const navigate = useNavigate();

  const handleSaved = () => {
    navigate("/");
  };

  return (
    <div className="page-shell narrow-shell">
      <header className="topbar simple-header">
        <div>
          <p className="eyebrow">New entry</p>
          <h1>Add Contact</h1>
        </div>
        <Link to="/" className="link-btn">
          Back to Home
        </Link>
      </header>

      <section className="content-panel">
        <ContactForm onContactSaved={handleSaved} />
      </section>
    </div>
  );
}

function AuthPage({ mode, onAuth }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "register" && !formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Email and password are required");
      return;
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

    if (mode === "register") {
      const existingUser = users.find(
        (user) => user.email.toLowerCase() === formData.email.toLowerCase()
      );

      if (existingUser) {
        setError("This email is already registered");
        return;
      }

      const newUser = {
        id: Date.now(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      onAuth({ id: newUser.id, name: newUser.name, email: newUser.email });
      navigate("/");
      return;
    }

    const existingUser = users.find(
      (user) =>
        user.email.toLowerCase() === formData.email.toLowerCase() &&
        user.password === formData.password
    );

    if (!existingUser) {
      setError("Invalid email or password");
      return;
    }

    onAuth({ id: existingUser.id, name: existingUser.name, email: existingUser.email });
    navigate("/");
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-badge">Welcome</span>
          <h2>{mode === "login" ? "Login" : "Register"}</h2>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <input
              type="text"
              name="name"
              className="auth-input"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
            />
          )}

          <input
            type="email"
            name="email"
            className="auth-input"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            className="auth-input"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-button">
            {mode === "login" ? "Login" : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
          <Link to={mode === "login" ? "/register" : "/login"}>
            {mode === "login" ? "Register" : "Login"}
          </Link>
        </p>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => getStoredUser());

  const handleAuth = (userData) => {
    setUser(userData);
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  return (
    <BrowserRouter>
      <div className="app-bg">
        <Routes>
          <Route
            path="/login"
            element={
              user ? <Navigate to="/" replace /> : <AuthPage mode="login" onAuth={handleAuth} />
            }
          />
          <Route
            path="/register"
            element={
              user ? <Navigate to="/" replace /> : <AuthPage mode="register" onAuth={handleAuth} />
            }
          />
          <Route
            path="/"
            element={
              user ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/add"
            element={
              user ? <AddContact user={user} /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/edit/:id"
            element={
              user ? <EditContact /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function EditContact() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then((response) => response.json())
      .then((data) => setContact(data))
      .catch((error) => console.error(error));
  }, [id]);

  const handleSaved = () => {
    navigate("/");
  };

  if (!contact) {
    return <p className="loading-text">Loading contact...</p>;
  }

  return (
    <div className="page-shell narrow-shell">
      <header className="topbar simple-header">
        <div>
          <p className="eyebrow">Update</p>
          <h1>Edit Contact</h1>
        </div>
        <Link to="/" className="link-btn">
          Back to Home
        </Link>
      </header>

      <section className="content-panel">
        <ContactForm contact={contact} onContactSaved={handleSaved} />
      </section>
    </div>
  );
}

export default App;