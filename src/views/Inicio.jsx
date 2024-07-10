import React from 'react';
import { Semaforo } from '../components/Inicio/Semaforo';
import { FaMountain } from 'react-icons/fa'; 

export const Inicio = () => {
    return (
        <div className="container mx-auto mb-10 p-2 text-white flex flex-col items-center md:flex-row md:items-center md:justify-center max-w-7xl">
            <div className="bg-white bg-opacity-80 p-6 sm:p-8 rounded-lg shadow-xl w-full md:w-2/5 mb-6 md:mb-0">
                <div className="flex items-center mb-4">
                    <FaMountain className="text-red-600 text-3xl mr-2" />
                    <h2 className="text-2xl font-bold text-gray-800">Información </h2>
                </div>
                <p className="text-base sm:text-lg leading-relaxed text-justify text-gray-800">
                    El volcán Cotopaxi ha presentado cinco grandes periodos eruptivos: 
                    <span className="text-yellow-500 font-semibold"> 1532-1534, 1742-1744, 1766-1768, 1853-1854</span> 
                    y 
                    <span className="text-yellow-500 font-semibold"> 1877-1880</span>. 
                    Dentro de cierto rango, todos los episodios han dado lugar a fenómenos volcánicos muy peligrosos, y no hay duda de que episodios similares volverán a repetirse en el plazo de las décadas. Los cuatro últimos periodos han dado lugar a muy importantes pérdidas socio-económicas en el Ecuador.
                </p>
                <p className="text-base sm:text-lg leading-relaxed text-justify text-gray-800 mt-4">
                    El Cotopaxi es uno de los volcanes más activos y peligrosos del mundo, y está localizado a unos 50 km al sur de Quito, la capital de Ecuador. Su última erupción importante fue en 2015, lo que subraya la necesidad constante de estar preparados ante cualquier actividad volcánica.
                </p>
            </div>
            <div className="w-full md:w-3/5 mt-6 md:mt-0 flex justify-center">
                <Semaforo />
            </div>
        </div>
    );
}
