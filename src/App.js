import logo from './logo.svg';
import './App.css';
import EmployeeAPI from "./api/service";
import Table from "./Table";
import { useState } from "react";

function App() {
  const [employees, setEmployees] = useState(EmployeeAPI.all());

  const handleDelete = (indexToRemove) => {
    setEmployees((prevEmployees) =>
      prevEmployees.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="App">
      <Table employees={employees} onDelete={handleDelete} />
    </div>
  );
}

export default App;
