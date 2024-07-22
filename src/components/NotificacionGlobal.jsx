import React from 'react';
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

export const NotificacionGlobal = ({ bodegas }) => {
  const bodegasCriticas = bodegas.filter(b => b.alerta && b.alerta.startsWith('Crítico'));
  const bodegasAdvertencia = bodegas.filter(b => b.alerta && b.alerta.startsWith('Advertencia'));
  
  if (bodegasCriticas.length > 0) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <div className="flex">
          <div className="py-1"><FaExclamationTriangle className="text-red-500 mr-4" /></div>
          <div>
            <p className="font-bold">Alerta Crítica</p>
            <p>{bodegasCriticas.length} bodega(s) están casi llenas. Se requiere atención inmediata.</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (bodegasAdvertencia.length > 0) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
        <div className="flex">
          <div className="py-1"><FaExclamationTriangle className="text-yellow-500 mr-4" /></div>
          <div>
            <p className="font-bold">Advertencia</p>
            <p>{bodegasAdvertencia.length} bodega(s) están llegando a su capacidad máxima.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
      <div className="flex">
        <div className="py-1"><FaCheckCircle className="text-green-500 mr-4" /></div>
        <div>
          <p className="font-bold">Todo en orden</p>
          <p>Todas las bodegas están en condiciones estables.</p>
        </div>
      </div>
    </div>
  );
};
