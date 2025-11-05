import React from "react";
import "./Form.css";

const Form = ({
  name,
  car,
  phone,
  setName,
  setCar,
  setPhone,
  handleAdd,
  handleCancelEdit,
  isEditing
}) => {
  return (
    <div className="form-container">
      <h2>{isEditing ? "Редактировать клиента" : "Добавить клиента"}</h2>
      <input
        type="text"
        placeholder="Имя клиента"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Марка автомобиля"
        value={car}
        onChange={(e) => setCar(e.target.value)}
      />
      <input
        type="text"
        placeholder="Телефон"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button className="primary-button" onClick={handleAdd}>
        {isEditing ? "Сохранить изменения" : "Добавить клиента"}
      </button>
      {isEditing && (
        <button className="cancel-button" onClick={handleCancelEdit}>
          Отменить редактирование
        </button>
      )}
    </div>
  );
};

export default Form;
