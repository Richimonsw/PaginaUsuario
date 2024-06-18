import { useState } from 'react';
import {Nota} from '../components/Nota';
export function Formulario() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    correo: '',
    edad: '',
    enfermedades: '',
    alergias: '',
    medicamento: '',
    ubicacion: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para manejar el envío del formulario
    console.log(formData);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start h-full p-6 lg:space-x-6 space-y-6 lg:space-y-0">
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full lg:w-1/3">
        <Nota/>
      </div>
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full lg:w-2/3"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Regístrate en nuestro sistema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-gray-700">Nombre:</span>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              pattern="[A-Za-z\s]+"
              title="El nombre no debe contener números"
              required
            />
          </label>
          
          <label className="block">
            <span className="text-gray-700">Apellido:</span>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              pattern="[A-Za-z\s]+"
              title="El apellido no debe contener números"
              required
            />
          </label>
          
          <label className="block">
            <span className="text-gray-700">Cédula:</span>
            <input
              type="text"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              pattern="\d+"
              title="La cédula solo debe contener números"
              required
            />
          </label>
          
          <label className="block">
            <span className="text-gray-700">Correo Electrónico:</span>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </label>
          
          <label className="block">
            <span className="text-gray-700">Edad:</span>
            <input
              type="number"
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              min="1"
              max="100"
              required
            />
          </label>
          
          <label className="block">
            <span className="text-gray-700">Enfermedades o Alergias:</span>
            <select
              name="enfermedades"
              value={formData.enfermedades}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Seleccione una opción</option>
              <option value="Enfermedad1">Enfermedad 1</option>
              <option value="Enfermedad2">Enfermedad 2</option>
              <option value="Alergia1">Alergia 1</option>
              <option value="Alergia2">Alergia 2</option>
            </select>
          </label>
          
          <label className="block">
            <span className="text-gray-700">Medicamento:</span>
            <select
              name="medicamento"
              value={formData.medicamento}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Seleccione un medicamento</option>
              <option value="Medicamento1">Medicamento 1</option>
              <option value="Medicamento2">Medicamento 2</option>
            </select>
          </label>
          
          <label className="block">
            <span className="text-gray-700">Ubicación:</span>
            <select
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Seleccione una ubicación</option>
              <option value="Ubicacion1">Ubicación 1</option>
              <option value="Ubicacion2">Ubicación 2</option>
            </select>
          </label>
        </div>
        
        <button
          type="submit"
          className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
