export const FormField = ({ label, name, type, register, errors, options }) => {
    const inputClass = "peer w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-indigo-600 placeholder-transparent";
    
    return (
      <label className="block">
        <span className="text-gray-700">{label}:</span>
        {type === 'select' ? (
          <select
            name={name}
            className={inputClass}
            {...register(name, options)}
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
          />
        )}
        {errors[name] && <span className="text-red-500">{errors[name].message}</span>}
      </label>
    );
  };