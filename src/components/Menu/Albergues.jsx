import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaUsers, FaPlus, FaBox, FaWarehouse, FaUserTie, FaMapMarkerAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { Card } from '../Card';
import { FormModal } from '../FormModal';
import { GenericInput } from '../GenericInput';
import { SearchBar } from '../SearchBar';
import Loading from '../Loading';
import axios from 'axios';

export const Albergues = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [albergues, setAlbergues] = useState([]);
  const [filteredAlbergues, setFilteredAlbergues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAlbergue, setNewAlbergue] = useState({
    nombre: '',
    capacidadCiudadanos: '',
    capacidadBodegas: '',
    capacidadUsuarios: '',
    cordenadas_x: '',
    cordenadas_y: '',
  });
  const [editingAlbergue, setEditingAlbergue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setRol(decodedToken.rol);
    }
  }, []);

  const validations = {
    nombre: (value) => {
      if (value.length < 3) return "El nombre debe tener al menos 3 caracteres";
      if (value.length > 50) return "El nombre no debe exceder los 50 caracteres";
      if (!/^[a-zA-Z0-9\s]+$/.test(value)) return "El nombre solo puede contener letras, números y espacios";
      return null;
    },
    capacidadCiudadanos: (value) => {
      const num = parseFloat(value);
      if (isNaN(num)) return "La capacidad de ciudadanos debe ser un número";
      if (num < 0) return "La capacidad de ciudadanos no puede ser negativa";
      return null;
    },
    capacidadBodegas: (value) => {
      const num = parseFloat(value);
      if (isNaN(num)) return "La capacidad de bodegas debe ser un número";
      if (num < 0) return "La capacidad de bodegas no puede ser negativa";
      return null;
    },
    capacidadUsuarios: (value) => {
      const num = parseFloat(value);
      if (isNaN(num)) return "La capacidad de usuarios debe ser un número";
      if (num < 0) return "La capacidad de usuarios no puede ser negativa";
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
    fetchAlbergues();
  }, []);

  useEffect(() => {
    const filtered = albergues.filter(albergue =>
      albergue.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAlbergues(filtered);
  }, [searchTerm, albergues]);

  const fetchAlbergues = async () => {
    setError(null);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/albergue', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(response.data);
      setAlbergues(response.data);
    } catch (error) {
      setError('Error al cargar los albergues');
      console.error('Error al cargar los albergues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleEdit = (albergue) => {
    const { nombre, capacidadCiudadanos, capacidadBodegas, capacidadUsuarios, cordenadas_x, cordenadas_y } = albergue;
    setEditingAlbergue({ nombre, capacidadCiudadanos, capacidadBodegas, capacidadUsuarios, cordenadas_x, cordenadas_y, id: albergue._id });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/albergue/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAlbergues(albergues.filter(albergue => albergue._id !== id));

      setLoading(false);
    } catch (error) {
      console.error('Error al eliminar albergue:', error);
    }
  };

  const handleAddNew = () => {
    setEditingAlbergue(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAlbergue(null);
    setNewAlbergue({ nombre: '', capacidadCiudadanos: '', capacidadBodegas: '', capacidadUsuarios: '', cordenadas_x: '', cordenadas_y: '' });
  };

  const handleInputChange = (name, value) => {
    const newData = editingAlbergue ? { ...editingAlbergue, [name]: value } : { ...newAlbergue, [name]: value };

    if (editingAlbergue) {
      setEditingAlbergue(newData);
    } else {
      setNewAlbergue(newData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = editingAlbergue || newAlbergue;
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
      if (editingAlbergue) {
        const { id, ...updateData } = editingAlbergue;
        response = await axios.put(`http://localhost:5000/api/albergue/${id}`, updateData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setAlbergues(albergues.map(a => a._id === id ? { ...a, ...response.data.albergue } : a));

        setLoading(false);
      } else {
        response = await axios.post('http://localhost:5000/api/albergue/register', newAlbergue, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setAlbergues([...albergues, response.data.albergue]);

        setLoading(false);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar albergue:', error);
    }
  };

  const handleInspect = async (id) => {
    navigate(`/menu/Contenido?Albergue_id=${id}`);
  };

  if (loading) {
    return <Loading />; // Utiliza el nuevo componente de Loading
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Albergues</h1>
        {rol === 'admin_general' && (
          <button
            onClick={handleAddNew}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center"
          >
            <FaPlus className="mr-2" /> Agregar Albergue
          </button>
        )}
      </div>

      <div className="mb-4">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          placeholder="Buscar albergues..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAlbergues.map(albergue => (
          <Card
            key={albergue._id}
            title={albergue.nombre}
            items={[
              { icon: FaUsers, text: `Población: ${albergue.ciudadanosCount} / ${albergue.capacidadCiudadanos}`, color: "blue" },
              { icon: FaWarehouse, text: `Bodegas: ${albergue.bodegasCount} / ${albergue.capacidadBodegas}`, color: "green" },
              { icon: FaUserTie, text: `Administradores: ${albergue.usuariosCount} / ${albergue.capacidadUsuarios}`, color: "purple" },
              { icon: FaMapMarkerAlt, text: `Ubicación: ${albergue.cordenadas_x}, ${albergue.cordenadas_y}`, color: "red" },
            ]}
            actions={[
              { icon: FaBox, onClick: () => handleInspect(albergue._id), color: "green", type: 'inspect' },
              { icon: FaEdit, onClick: () => handleEdit(albergue), color: "blue", type: 'edit' },
              { icon: FaTrash, onClick: () => handleDelete(albergue._id), color: "red", type: 'delete' },
            ]}
            rol={rol} // pasar el rol como prop
          />
        ))}
      </div>

      {filteredAlbergues.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No se encontraron albergues.</p>
      )}


      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAlbergue ? "Editar Albergue" : "Agregar Nuevo Albergue"}
        onSubmit={handleSubmit}
      >
        <GenericInput
          type="text"
          name="nombre"
          value={editingAlbergue ? editingAlbergue.nombre : newAlbergue.nombre}
          onChange={handleInputChange}
          placeholder="Nombre del albergue"
          required
          validate={validations.nombre}
          label="Nombre del albergue"
        />
        <GenericInput
          type="number"
          name="capacidadCiudadanos"
          value={editingAlbergue ? editingAlbergue.capacidadCiudadanos : newAlbergue.capacidadCiudadanos}
          onChange={handleInputChange}
          placeholder="Capacidad de ciudadanos"
          required
          validate={validations.capacidadCiudadanos}
          label="Capacidad de ciudadanos"
        />
        <GenericInput
          type="number"
          name="capacidadBodegas"
          value={editingAlbergue ? editingAlbergue.capacidadBodegas : newAlbergue.capacidadBodegas}
          onChange={handleInputChange}
          placeholder="Capacidad de bodegas"
          required
          validate={validations.capacidadBodegas}
          label="Capacidad de bodegas"
        />
        <GenericInput
          type="number"
          name="capacidadUsuarios"
          value={editingAlbergue ? editingAlbergue.capacidadUsuarios : newAlbergue.capacidadUsuarios}
          onChange={handleInputChange}
          placeholder="Capacidad de usuarios"
          required
          validate={validations.capacidadUsuarios}
          label="Capacidad de usuarios"
        />
        <GenericInput
          type="number"
          name="cordenadas_x"
          value={editingAlbergue ? editingAlbergue.cordenadas_x : newAlbergue.cordenadas_x}
          onChange={handleInputChange}
          placeholder="Coordenada X"
          required
          validate={validations.cordenadas_x}
          label="Coordenada X"
        />
        <GenericInput
          type="number"
          name="cordenadas_y"
          value={editingAlbergue ? editingAlbergue.cordenadas_y : newAlbergue.cordenadas_y}
          onChange={handleInputChange}
          placeholder="Coordenada Y"
          required
          validate={validations.cordenadas_y}
          label="Coordenada Y"
        />
      </FormModal>
    </div>
  );
};