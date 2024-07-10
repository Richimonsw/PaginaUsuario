import React from 'react';
import { FaTimes } from 'react-icons/fa';

export const FormModal = ({ isOpen, onClose, title, children, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative top-10 mx-4 sm:mx-auto sm:w-2/3 md:w-1/2 lg:w-2/5 p-6 border shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
