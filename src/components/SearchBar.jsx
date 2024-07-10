import React from 'react';
import { FaSearch } from 'react-icons/fa';

export const SearchBar = ({ searchTerm, onSearchChange, placeholder }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder || "Buscar..."}
        className="w-full p-2 pl-10 pr-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
};