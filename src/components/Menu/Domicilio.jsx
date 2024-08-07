import React, { useState, useEffect } from 'react';
import { FaPlus, FaMapMarkerAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { Card } from '../Card';
import { FormModal } from '../FormModal';
import { GenericInput } from '../GenericInput';
import { SearchBar } from '../SearchBar';
import Loading from '../Loading';
import axios from 'axios';

export const Domicilio = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [domicilios, setDomicilios] = useState([]);
  const [filteredDomicilios, setFilteredDomicilios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDomicilio, setNewDomicilio] = useState({
    nombre: '',
    zonaDeRiesgo: '',
  });
  const [editingDomicilio, setEditingDomicilio] = useState({
    nombre: '',
    zonaDeRiesgo: '',
    id: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const validations = {
    nombre: (value) => {
      if (value.length < 3) return "El nombre debe tener al menos 3 caracteres";
      if (value.length > 50) return "El nombre no debe exceder los 50 caracteres";
      if (!/^[a-zA-Z0-9\s]+$/.test(value)) return "El nombre solo puede contener letras, números y espacios";
      return null;
    },
    zonaDeRiesgo: (value) => {
      if (!value) return "Debe seleccionar una opción";
      return null;
    }
  };

  useEffect(() => {
    fetchDomicilios();
  }, []);

  useEffect(() => {
    const filtered = domicilios.filter(domicilio =>
      domicilio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDomicilios(filtered);
  }, [searchTerm, domicilios]);

  const fetchDomicilios = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}domicilios`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDomicilios(response.data);
    } catch (error) {
      setError('Error al cargar los domicilios');
      console.error('Error al cargar los domicilios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleEdit = (domicilio) => {
    const { nombre, zonaDeRiesgo } = domicilio;
    setEditingDomicilio({
      nombre,
      zonaDeRiesgo: zonaDeRiesgo ? "TRUE" : "FALSE", // Convertimos el booleano a string
      id: domicilio._id
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}domicilios/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDomicilios(domicilios.filter(domicilio => domicilio._id !== id));
    } catch (error) {
      console.error('Error al eliminar domicilio:', error);
    }
  };

  const handleAddNew = () => {
    setEditingDomicilio(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDomicilio(null);
    setNewDomicilio({ nombre: '', zonaDeRiesgo: '' });
  };

  const handleInputChange = (name, value) => {
    const newData = editingDomicilio ? { ...editingDomicilio, [name]: value } : { ...newDomicilio, [name]: value };

    if (editingDomicilio) {
      setEditingDomicilio(newData);
    } else {
      setNewDomicilio(newData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = editingDomicilio || newDomicilio;
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
      if (editingDomicilio) {
        const { id, ...updateData } = editingDomicilio;
        response = await axios.put(`${import.meta.env.VITE_BASE_URL}domicilios/${id}`, updateData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setDomicilios(domicilios.map(a => a._id === id ? { ...a, ...response.data.domicilio } : a));
      } else {
        response = await axios.post(`${import.meta.env.VITE_BASE_URL}domicilios/register`, newDomicilio, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setDomicilios([...domicilios, response.data.domicilio]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar domicilio:', error);
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
        <h1 className="text-2xl font-bold">Zonas de Riesgo</h1>
        <button
          onClick={handleAddNew}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center"
        >
          <FaPlus className="mr-2" /> Agregar Zona de Riesgo
        </button>
      </div>

      <div className="mb-4">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          placeholder="Buscar domicilios..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDomicilios.map(domicilio => (
          <Card
            key={domicilio._id}
            title={domicilio.nombre}
            items={[
              {
                icon: FaMapMarkerAlt,
                text: `Zona de riesgo: ${domicilio.zonaDeRiesgo ? 'Sí' : 'No'}`,
                color: "red"
              },
            ]}
            actions={[
              { icon: FaEdit, onClick: () => handleEdit(domicilio), color: "blue" },
              { icon: FaTrash, onClick: () => handleDelete(domicilio._id), color: "red" },
            ]}
          />
        ))}
      </div>

      {filteredDomicilios.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No se encontraron zonas de riesgo.</p>
      )}


      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingDomicilio ? "Editar Zona de Riesgo" : "Agregar Nueva Zona de Riesgo"}
        onSubmit={handleSubmit}
      >
        <GenericInput
          type="text"
          name="nombre"
          value={editingDomicilio ? editingDomicilio.nombre : newDomicilio.nombre}
          onChange={handleInputChange}
          placeholder="Nombre del albergue"
          required
          validate={validations.nombre}
          label="Nombre del albergue"
        />
        <GenericInput
          type="select"
          name="zonaDeRiesgo"
          value={editingDomicilio ? editingDomicilio.zonaDeRiesgo : newDomicilio.zonaDeRiesgo}
          onChange={handleInputChange}
          placeholder="Seleccionar zona de riesgo"
          required
          validate={validations.zonaDeRiesgo}
          label="Zona de riesgo"
        >
          <option value="">Seleccione una opción</option>
          <option value="TRUE">Sí</option>
          <option value="False">No</option>

        </GenericInput>
      </FormModal>
    </div>
  );
};