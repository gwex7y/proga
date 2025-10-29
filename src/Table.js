import React from "react";
import "./Table.css";

const Table = ({ employees, onDelete, onEdit }) => {
  return (
    <div className="table-container">
      <h2>Список сотрудников</h2>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Должность</th>
            <th>Телефон</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index}>
              <td>{employee.name}</td>
              <td>{employee.job}</td>
              <td>{employee.phone}</td>
              <td>
                <button className="primary-button" onClick={() => onEdit(index)}>
                  Редактировать
                </button>
                <button className="delete-button" onClick={() => onDelete(index)}>
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
