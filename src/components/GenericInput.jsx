import React, { useState } from 'react';

export const GenericInput = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
  validate,
  label,
  children // Añadimos children para las opciones del select
}) => {
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(name, newValue);
    
    if (validate) {
      const validationResult = validate(newValue);
      setError(validationResult || '');
    }
  };

  const inputClasses = `mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 ${
    error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
  }`;

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={inputClasses}
          rows={3}
        />
      ) : type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={handleChange}
          required={required}
          className={inputClasses}
        >
          {children}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={inputClasses}
        />
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
