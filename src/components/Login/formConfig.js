export const formConfig = [
    {
      name: 'cedula',
      label: 'Cédula',
      type: 'text',
      options: {
        required: { value: true, message: "La cédula es obligatoria" },
        pattern: { value: /^\d+$/, message: "La cédula solo debe contener números" },
  
      },
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      options: {
        required: { value: true, message: "La contraseña es obligatoria" },
        minLength: { value: 4, message: "La contraseña debe ser mayor a 4 caracteres" },
  
      },
    },

  
  ];