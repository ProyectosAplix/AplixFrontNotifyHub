import React, { useState, useEffect } from 'react';
import '../../css/Dialogs.css';

function InputComponent({ id, label, type, placeholder, getValue }) {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    getValue.current[id] = { value };
  }, [value, id, getValue]);

  return (
    <div className="col-md-4 col-sm-4">
      <label htmlFor={id} className="form-label">{label}</label>
      <input
        className="form-control"
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

export default InputComponent;
