import './App.css';
import './Form.css';
import './Table.css';
import Table from "./Table";
import Form from "./Form";
import { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import ClientPage from './components/ClientPage';

function AdminPanel() {
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem("clients");
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");
  const [car, setCar] = useState("");
  const [phone, setPhone] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const { user, logoutUser } = useContext(AuthContext);

  const handleDelete = (indexToRemove) => {
    setClients((prevClients) =>
      prevClients.filter((_, index) => index !== indexToRemove)
    );
    if (editIndex === indexToRemove) {
      handleCancelEdit();
    }
  };

  const handleEdit = (index) => {
    const client = clients[index];
    setName(client.name);
    setCar(client.car);
    setPhone(client.phone);
    setEditIndex(index);
  };

  const handleAdd = () => {
    if (name.trim() === "" || car.trim() === "" || phone.trim() === "") return;

    const newClient = { name, car, phone };

    if (editIndex !== null) {
      const updated = [...clients];
      updated[editIndex] = newClient;
      setClients(updated);
      setEditIndex(null);
    } else {
      setClients((prevClients) => [...prevClients, newClient]);
    }

    setName("");
    setCar("");
    setPhone("");
  };

  const handleSave = () => {
    localStorage.setItem("clients", JSON.stringify(clients));
    alert("Изменения сохранены!");
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setName("");
    setCar("");
    setPhone("");
  };

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="header-title">АВТОМОЙКА — Панель администратора</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: 'white', fontSize: '16px' }}>Админ: {user?.username}</span>
          <button className="primary-button" onClick={logoutUser}>Выйти</button>
        </div>
      </div>
      
      <Form
        name={name}
        car={car}
        phone={phone}
        setName={setName}
        setCar={setCar}
        setPhone={setPhone}
        handleAdd={handleAdd}
        handleCancelEdit={handleCancelEdit}
        isEditing={editIndex !== null}
      />
      <Table
        clients={clients}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
      <div className="save-container">
        <button className="primary-button" onClick={handleSave}>
          💾 Сохранить изменения списка
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <AdminPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/client"
            element={
              <PrivateRoute role="client">
                <ClientPage />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;