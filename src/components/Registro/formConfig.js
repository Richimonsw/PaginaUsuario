export const formConfig = [
  {
    name: 'nombre',
    label: 'Nombre',
    type: 'text',
    options: {
      required: { value: true, message: "El nombre es obligatorio" },
      minLength: { value: 2, message: "Nombre debe ser mayor a 2 caracteres" },
      pattern: { value: /^[a-zA-Z\s]+$/, message: "El nombre no debe contener números" },
    },
  },
  {
    name: 'apellido',
    label: 'Apellido',
    type: 'text',
    options: {
      required: { value: true, message: "El apellido es obligatorio" },
      minLength: { value: 2, message: "Apellido debe ser mayor a 2 caracteres" },
      pattern: { value: /^[a-zA-Z\s]+$/, message: "El apellido no debe contener números" },
    },
  },
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
    type: 'text',
    options: {
      required: { value: true, message: "Seleccione una enfermedad o alergia" },
      minLength: { value: 2, message: "Enfermedad o alergia debe ser mayor a 2 caracteres" }
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
  // {
  //   name: 'medicamentos',
  //   label: 'Medicamento',
  //   type: 'select',
  //   options: {
  //     required: { value: true, message: "Seleccione un medicamento" },
  //     choices: [
  //       { value: "Medicamento1", label: "Medicamento 1" },
  //       { value: "Medicamento2", label: "Medicamento 2" },
  //     ],
  //   },
  // },
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