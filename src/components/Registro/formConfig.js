export const formConfig = [
  {
    name: 'nombre',
    label: 'Nombre',
    type: 'text',
    options: {
      required: { value: true, message: "El nombre es obligatorio" },
      minLength: { value: 2, message: "El nombre debe ser mayor a 2 caracteres" },
      pattern: {
        // Se incluye la ñ y las vocales con tilde
        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/,
        message: "El nombre no debe contener números ni espacios al inicio o final"
      },
      validate: (value) => value.trim() === value || "El nombre no debe tener espacios al inicio o final"
    },
  },
  {
    name: 'apellido',
    label: 'Apellido',
    type: 'text',
    options: {
      required: { value: true, message: "El apellido es obligatorio" },
      minLength: { value: 2, message: "El apellido debe ser mayor a 2 caracteres" },
      pattern: {
        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/,
        message: "El apellido no debe contener números ni espacios al inicio o final"
      },
      validate: (value) => value.trim() === value || "El apellido no debe tener espacios al inicio o final"
    },
  },
  {
    name: 'cedula',
    label: 'Cédula',
    type: 'text',
    options: {
      required: { value: true, message: "La cédula es obligatoria" },
      minLength: {
        value: 10,
        message: 'La cédula debe tener al menos 10 caracteres'
      },
      maxLength: {
        value: 10,
        message: 'La cédula no puede tener más de 10 caracteres'
      },
      pattern: { value: /^\d+$/, message: "La cédula solo debe contener números" },

    },
  },
  {
    name: 'email',
    label: 'Correo Electrónico',
    type: 'email',
    options: {
      required: { value: true, message: "El correo es obligatorio" },
      pattern: {
        value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
        message: "Correo no válido",
      },

    },
  },
  {
    name: 'edad',
    label: 'Edad',
    type: 'number',
    options: {
      required: { value: true, message: "La edad es obligatoria" },
      min: { value: 1, message: "La edad debe ser mayor a 1" },
      max: { value: 100, message: "La edad debe ser menor a 100" },
    },
  },
  {
    name: 'enfermedades',
    label: 'Enfermedades o Alergias',
    type: 'select',
    options: {
      choices: [],
    },
  },
  {
    name: 'telefono',
    label: 'Telefono',
    type: 'text',
    options: {
      required: { value: true, message: "El telefono es obligatorio" },
      pattern: { value: /^\d+$/, message: "El telefono solo debe contener números" },
    },
  },
  {
    name: 'medicamentos',
    label: 'Medicamentos',
    type: 'select',
    options: {
      required: {
        value: true,
        message: "Seleccione un medicamento"
      },
      choices: [],
    },
  },
  {
    name: 'domicilio',
    label: 'Ubicación',
    type: 'select',
    options: {
      required: { value: true, message: "Seleccione una ubicación" },
      choices: [],
    },
  },
];