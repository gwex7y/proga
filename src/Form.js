import React from "react";
import "./Form.css";

const Form = ({
  name,
  job,
  phone,
  setName,
  setJob,
  setPhone,
  handleAdd,
  handleCancelEdit,
  isEditing
}) => {
  return (
    <div className="form-container">
      <h2>{isEditing ? "Редактировать сотрудника" : "Добавить сотрудника"}</h2>
      <input
        type="text"
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Должность"
        value={job}
        onChange={(e) => setJob(e.target.value)}
      />
      <input
        type="text"
        placeholder="Телефон"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button className="primary-button" onClick={handleAdd}>
        {isEditing ? "Сохранить изменения" : "Добавить"}
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
