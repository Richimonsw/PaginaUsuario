
import { useEffect } from 'react';
import { Nota } from '../components/Inicio/Nota';
import { FormRegistro } from '../components/Registro/Formulario';
export function Formulario() {

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
    } else {
      console.log("No hay token");
    }
  }, []);

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start h-full p-6 lg:space-x-6 space-y-6 lg:space-y-0">
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full lg:w-1/3">
        <Nota />
      </div>
      <FormRegistro />
    </div>
  );
}
