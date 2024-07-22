import React from 'react';

export const FormField = ({ label, name, type, register, errors, options, value }) => {
    const inputClass = "peer w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-indigo-600 placeholder-transparent";
    
    return (
      <div className="mb-4">
        <label className="block">
          <span className="text-gray-700">{label}:</span>
          {type === 'select' ? (
            <select
              name={name}
              className={inputClass}
              {...register(name, options)}
              value={value}
            >
              <option value="">Seleccione una opción</option>
              {options.choices.map((choice) => (
                <option key={choice.value} value={choice.value}>{choice.label}</option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={name}
              className={inputClass}
              {...register(name, options)}
              value={value}
            />
          )}
        </label>
        {errors[name] && <span className="text-red-500 text-sm">{errors[name].message}</span>}
        {value && !errors[name] && <span className="text-green-500 text-sm">Campo válido</span>}
      </div>
    );
};