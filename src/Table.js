import React from "react";
import "./Table.css";

const Table = ({ clients, onDelete, onEdit }) => {
  return (
    <div className="table-container">
      <h2>Список клиентов автомойки</h2>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Автомобиль</th>
            <th>Телефон</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <tr key={index}>
              <td>{client.name}</td>
              <td>{client.car}</td>
              <td>{client.phone}</td>
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
