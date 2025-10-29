import './Form.css';
import './Table.css';
import Table from "./Table";
import Form from "./Form";
import { useState } from "react";

function App() {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("employees");
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [phone, setPhone] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const handleDelete = (indexToRemove) => {
    setEmployees((prevEmployees) =>
      prevEmployees.filter((_, index) => index !== indexToRemove)
    );
    if (editIndex === indexToRemove) {
      handleCancelEdit();
    }
  };

  const handleEdit = (index) => {
    const employee = employees[index];
    setName(employee.name);
    setJob(employee.job);
    setPhone(employee.phone);
    setEditIndex(index);
  };

  const handleAdd = () => {
    if (name.trim() === "" || job.trim() === "" || phone.trim() === "") return;

    const newEmployee = { name, job, phone };

    if (editIndex !== null) {
      const updated = [...employees];
      updated[editIndex] = newEmployee;
      setEmployees(updated);
      setEditIndex(null);
    } else {
      setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
    }

    setName("");
    setJob("");
    setPhone("");
  };

  const handleSave = () => {
    localStorage.setItem("employees", JSON.stringify(employees));
    alert("Изменения сохранены!");
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setName("");
    setJob("");
    setPhone("");
  };

  return (
    <div className="App">
      <Form
        name={name}
        job={job}
        phone={phone}
        setName={setName}
        setJob={setJob}
        setPhone={setPhone}
        handleAdd={handleAdd}
        handleCancelEdit={handleCancelEdit}
        isEditing={editIndex !== null}
      />
      <Table
        employees={employees}
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

export default App;
