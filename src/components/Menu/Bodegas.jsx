import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaUsers, FaPlus, FaEdit, FaTrash, FaBox, FaExclamationCircle, FaCheckCircle, FaShapes, FaUsersCog } from 'react-icons/fa';
import { Card } from '../Card';
import { FormModal } from '../FormModal';
import { GenericInput } from '../GenericInput';
import { SearchBar } from '../SearchBar';
import Loading from '../Loading';
import axios from 'axios';

export const Bodegas = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [bodegas, setBodegas] = useState([]);
  const [filteredBodegas, setFilteredBodegas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBodega, setNewBodega] = useState({
    nombre: '',
    categoria: '',
    capacidad: '',
    albergue: ''
  });
  const [editingBodega, setEditingBodega] = useState({
    nombre: '',
    categoria: '',
    capacidad: '',
    albergue: '',
    id: null
  });
  const [albergues, setAlbergues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
      return null;
    },
    descripcion: (value) => {
      if (value.length > 200) return "La descripción no debe exceder los 200 caracteres";
      return null;
    },
    categoria: (value) => {
      if (!value) return "Debe seleccionar una categoria";
      return null;
    },
    capacidad: (value) => {
      if (!value) return "Debe seleccionar una capacidad";
      return null;
    },
    albergue: (value) => {
      if (!value) return "Debe seleccionar un albergue";
      return null;
    }
  };

  useEffect(() => {
    fetchBodegas();
    fetchAlbergues();
  }, []);

  useEffect(() => {
    const filtered = bodegas.filter(bodega =>
      bodega.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBodegas(filtered);
  }, [searchTerm, bodegas]);

  const fetchBodegas = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/bodega', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const bodegasConStockTotal = response.data.map(bodega => ({
        ...bodega,
        stockTotal: bodega.productos.reduce((total, producto) => total + (producto.stockMin || 0), 0)
      }));

      setBodegas(bodegasConStockTotal);
    } catch (error) {
      setError('Error al cargar las bodegas');
      console.error('Error al cargar las bodegas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAlbergues = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/albergue', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAlbergues(response.data);
    } catch (error) {
      console.error('Error al cargar los albergues:', error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleEdit = (bodega) => {
    const { nombre, categoria, capacidad, albergue } = bodega;
    setEditingBodega({
      nombre,
      categoria,
      capacidad,
      albergue: albergue._id, // Guardamos solo el ID del albergue
      id: bodega._id
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/bodega/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setBodegas(bodegas.filter(bodega => bodega._id !== id));
      console.log(bodegas);
    } catch (error) {
      console.error('Error al eliminar la bodega:', error);
    }
  };

  const handleAddNew = () => {
    setEditingBodega(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBodega(null);
    setNewBodega({ nombre: '', categoria: '', capacidad: '', albergue: '' });
  };

  const handleInputChange = (name, value) => {
    const newData = editingBodega ? { ...editingBodega, [name]: value } : { ...newBodega, [name]: value };

    if (editingBodega) {
      setEditingBodega(newData);
    } else {
      setNewBodega(newData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = editingBodega || newBodega;
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
      if (editingBodega) {
        const { id, ...updateData } = editingBodega;
        response = await axios.put(`http://localhost:5000/api/bodega/${id}`, updateData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setBodegas(bodegas.map(a => a._id === id ? { ...a, ...response.data.bodega } : a));
      } else {
        response = await axios.post('http://localhost:5000/api/bodega/register', newBodega, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setBodegas([...bodegas, response.data.bodega]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar la bodega:', error);
    }
  };

  const handleInspect = async (id) => {
    navigate(`/menu/Productos?Bodega_id=${id}`);
  };

  if (isLoading) {

    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const getAlertColor = (alerta) => {
    if (alerta === "Crítico: La bodega está casi llena") return "red";
    if (alerta === "Advertencia: La bodega está llegando a su capacidad máxima") return "yellow";
    return "green";
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Bodegas</h1>
        {rol === 'admin_general' && (
          <button
            onClick={handleAddNew}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center"
          >
            <FaPlus className="mr-2" /> Agregar Bodega
          </button>
        )}
      </div>

      <div className="mb-4">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          placeholder="Buscar bodegas..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBodegas.map(bodega => (
          <Card
            key={bodega._id}
            title={bodega.nombre}
            items={[
              { icon: FaUsers, text: `Albergue: ${bodega.albergue.nombre}`, color: "green" },
              { icon: FaShapes, text: `Categoria: ${bodega.categoria}`, color: "blue" },
              {
                icon: FaUsersCog,
                text: `Ocupación: ${bodega.stockTotal}/${bodega.capacidad}`,
                color: "green"
              },
              { icon: FaBox, text: `Productos: ${bodega.porcentajeOcupacion}%`, color: "blue" },
              { icon: FaBox, text: `Productos: ${bodega.cantidadProductos}`, color: "blue" },
              {
                icon: bodega.alerta ? FaExclamationCircle : FaCheckCircle,
                text: bodega.alerta || "Bodega estable",
                color: getAlertColor(bodega.alerta)
              }
            ]}
            actions={[
              { icon: FaBox, onClick: () => handleInspect(bodega._id), color: "green", type: 'inspect' },
              { icon: FaEdit, onClick: () => handleEdit(bodega), color: "blue", type: 'edit' },
              { icon: FaTrash, onClick: () => handleDelete(bodega._id), color: "red", type: 'delete' },
            ]}
            rol={rol}
          />
        ))}
      </div>

      {filteredBodegas.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No se encontraron bodegas.</p>
      )}



      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBodega ? "Editar Bodega" : "Agregar Nueva Bodega"}
        onSubmit={handleSubmit}
      >
        <GenericInput
          type="text"
          name="nombre"
          value={editingBodega ? editingBodega.nombre : newBodega.nombre}
          onChange={handleInputChange}
          placeholder="Nombre de la bodega"
          required
          validate={validations.nombre}
          label="Nombre de la bodega"
        />
        <GenericInput
          type="text"
          name="categoria"
          value={editingBodega ? editingBodega.categoria : newBodega.categoria}
          onChange={handleInputChange}
          placeholder="Nombre de la categoria"
          required
          validate={validations.categoria}
          label="Nombre de la categoria"
        />
        <GenericInput
          type="number"
          name="capacidad"
          value={editingBodega ? editingBodega.capacidad : newBodega.capacidad}
          onChange={handleInputChange}
          placeholder="Capacidad"
          required
          validate={validations.capacidad}
          label="Capacidad"
        />
        <GenericInput
          type="select"
          name="albergue"
          value={editingBodega ? editingBodega.albergue : newBodega.albergue}
          onChange={handleInputChange}
          placeholder="Seleccionar albergue"
          required
          validate={validations.albergue}
          label="Albergue"
        >
          <option value="">Seleccionar albergue</option>
          {albergues.map(albergue => (
            <option key={albergue._id} value={albergue._id}>{albergue.nombre}</option>
          ))}
        </GenericInput>
      </FormModal>
    </div>
  );
};