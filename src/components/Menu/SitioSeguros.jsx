import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaPlus, FaMapMarkerAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { Card } from '../Card';
import { FormModal } from '../FormModal';
import { GenericInput } from '../GenericInput';
import { SearchBar } from '../SearchBar';
import Loading from '../Loading';
import axios from 'axios';

export const SitioSeguros = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sitioSeguros, setSitioSeguros] = useState([]);
  const [filteredSitioSeguros, setFilteredSitioSeguros] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSitioSeguro, setNewSitioSeguro] = useState({
    nombre: '',
    cordenadas_x: '',
    cordenadas_y: '',
  });
  const [editingSitioSeguro, setEditingSitioSeguro] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const validations = {
    nombre: (value) => {
      if (value.length < 3) return "El nombre debe tener al menos 3 caracteres";
      if (value.length > 50) return "El nombre no debe exceder los 50 caracteres";
      if (!/^[a-zA-Z0-9\s]+$/.test(value)) return "El nombre solo puede contener letras, números y espacios";
      return null;
    },
    descripcion: (value) => {
      if (value.length > 200) return "La descripción no debe exceder los 200 caracteres";
      return null;
    },
    cordenadas_x: (value) => {
      const num = parseFloat(value);
      if (isNaN(num)) return "La coordenada X debe ser un número";
      return null;
    },
    cordenadas_y: (value) => {
      const num = parseFloat(value);
      if (isNaN(num)) return "La coordenada Y debe ser un número";
      return null;
    }
  };

  useEffect(() => {
    fetchSitioSeguros();
  }, []);

  useEffect(() => {
    const filtered = sitioSeguros.filter(sitioSeguro =>
      sitioSeguro.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSitioSeguros(filtered);
  }, [searchTerm, sitioSeguros]);

  const fetchSitioSeguros = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}sitioSeguro`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSitioSeguros(response.data);
    } catch (error) {
      setError('Error al cargar los sitios seguros');
      console.error('Error al cargar los sitios seguros:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleEdit = (sitioSeguro) => {
    const { nombre, cordenadas_x, cordenadas_y } = sitioSeguro;
    setEditingSitioSeguro({ nombre, cordenadas_x, cordenadas_y, id: sitioSeguro._id });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}sitioSeguro/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSitioSeguros(sitioSeguros.filter(sitioSeguro => sitioSeguro._id !== id));
    } catch (error) {
      console.error('Error al eliminar sitio seguro:', error);
    }
  };

  const handleAddNew = () => {
    setEditingSitioSeguro(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSitioSeguro(null);
    setNewSitioSeguro({ nombre: '', cordenadas_x: '', cordenadas_y: '' });
  };

  const handleInputChange = (name, value) => {
    const newData = editingSitioSeguro ? { ...editingSitioSeguro, [name]: value } : { ...newSitioSeguro, [name]: value };

    if (editingSitioSeguro) {
      setEditingSitioSeguro(newData);
    } else {
      setNewSitioSeguro(newData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = editingSitioSeguro || newSitioSeguro;
    const errors = Object.keys(formData).reduce((acc, key) => {
      const error = validations[key] ? validations[key](formData[key]) : null;
      if (error) acc[key] = error;
      return acc;
    }, {});

    if (Object.keys(errors).length > 0) {
      console.error('Hay errores en el formulario:', errors);
      return;
    }

    const token = localStorage.getItem('token');
    try {
      let response;
      if (editingSitioSeguro) {
        const { id, ...updateData } = editingSitioSeguro;
        response = await axios.put(`${import.meta.env.VITE_BASE_URL}sitioSeguro/${id}`, updateData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setSitioSeguros(sitioSeguros.map(a => a._id === id ? { ...a, ...response.data.sitioSeguro } : a));
      } else {
        response = await axios.post(`${import.meta.env.VITE_BASE_URL}sitioSeguro/register`, newSitioSeguro, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setSitioSeguros([...sitioSeguros, response.data.sitioSeguro]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar sitio seguro:', error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sitios Seguros</h1>
        <button
          onClick={handleAddNew}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center"
        >
          <FaPlus className="mr-2" /> Agregar Sitio Seguro
        </button>
      </div>

      <div className="mb-4">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          placeholder="Buscar sitio seguro..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSitioSeguros.map(sitioSeguro => (
          <Card
            key={sitioSeguro._id}
            title={sitioSeguro.nombre}
            items={[
              { icon: FaMapMarkerAlt, text: `Ubicación: ${sitioSeguro.cordenadas_x}, ${sitioSeguro.cordenadas_y}`, color: "red" },
            ]}
            actions={[
              { icon: FaEdit, onClick: () => handleEdit(sitioSeguro), color: "blue" },
              { icon: FaTrash, onClick: () => handleDelete(sitioSeguro._id), color: "red" },
            ]}
          />
        ))}
      </div>

      {filteredSitioSeguros.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No se encontraron sitios seguros.</p>
      )}


      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSitioSeguro ? "Editar Sitio Seguro" : "Agregar Nuevo Sitio Seguro"}
        onSubmit={handleSubmit}
      >
        <GenericInput
          type="text"
          name="nombre"
          value={editingSitioSeguro ? editingSitioSeguro.nombre : newSitioSeguro.nombre}
          onChange={handleInputChange}
          placeholder="Nombre del sitio seguro"
          required
          validate={validations.nombre}
          label="Nombre del sitio seguro"
        />
        <GenericInput
          type="number"
          name="cordenadas_x"
          value={editingSitioSeguro ? editingSitioSeguro.cordenadas_x : newSitioSeguro.cordenadas_x}
          onChange={handleInputChange}
          placeholder="Coordenada X"
          required
          validate={validations.cordenadas_x}
          label="Coordenada X"
          step="any"
        />
        <GenericInput
          type="number"
          name="cordenadas_y"
          value={editingSitioSeguro ? editingSitioSeguro.cordenadas_y : newSitioSeguro.cordenadas_y}
          onChange={handleInputChange}
          placeholder="Coordenada Y"
          required
          validate={validations.cordenadas_y}
          label="Coordenada Y"
          step="any"
        />
      </FormModal>
    </div>
  );
};