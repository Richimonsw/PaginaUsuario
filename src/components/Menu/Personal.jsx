import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Personal = () => {
  const [administradores, setAdministradores] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [albergues, setAlbergues] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', cedula: '', password: '',
    telefono: '', rol: '', albergue: ''
  });
  const [filters, setFilters] = useState({ nombre: '', cedula: '', rol: '', albergue: '' });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdministradores();
    fetchAlbergues();
  }, []);

  useEffect(() => {
    filterAdministradores();
  }, [administradores, filters]);

  const fetchAdministradores = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/usuario', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAdministradores(response.data);
    } catch (error) {
      console.error('Error al obtener administradores:', error);
      showAlert('Error al cargar administradores', 'error');
    }
  };

  const fetchAlbergues = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/albergue', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAlbergues(response.data);
    } catch (error) {
      console.error('Error al obtener albergues:', error);
      showAlert('Error al cargar albergues', 'error');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filterAdministradores = () => {
    const { nombre, cedula, rol, albergue } = filters;
    const filtered = administradores.filter(admin =>
      (!nombre || admin.nombre.toLowerCase().includes(nombre.toLowerCase())) &&
      (!cedula || admin.cedula.includes(cedula)) &&
      (!rol || admin.rol === rol) &&
      (!albergue || admin.albergue?._id === albergue)
    );
    setFilteredAdmins(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = { ...formData };
    ['_id', 'createdAt', 'updatedAt', '__v'].forEach(field => delete dataToSend[field]);
    try {
      const token = localStorage.getItem('token');
      if (editingId) {
        await axios.put(`http://localhost:5000/api/usuario/${editingId}`, dataToSend, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        showAlert('Administrador actualizado con éxito', 'success');
      } else {
        await axios.post('http://localhost:5000/api/usuario/register', formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        showAlert('Administrador creado con éxito', 'success');
      }
      fetchAdministradores();
      setFormData({
        nombre: '', apellido: '', email: '', cedula: '', password: '',
        telefono: '', rol: '', albergue: ''
      });
      setEditingId(null);
      setIsModalOpen(false);
    } catch (error) {
      setError(error.response.data.error);s
      showAlert('Error al guardar administrador', 'error');
    }
  };

  const handleEdit = (administrador) => {
    setFormData(administrador);
    setEditingId(administrador._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este administrador?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/usuario/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchAdministradores();
        showAlert('Administrador eliminado con éxito', 'success');
      } catch (error) {
        console.error('Error al eliminar administrador:', error);
        showAlert('Error al eliminar administrador', 'error');
      }
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Administración de Personal</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Agregar Administrador
      </button>

      {alert.show && (
        <div className={`p-4 mb-4 rounded-md ${alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {alert.message}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          name="nombre"
          value={filters.nombre}
          onChange={handleFilterChange}
          placeholder="Buscar por nombre"
          className="px-3 py-2 border rounded-md"
        />
        <input
          type="text"
          name="cedula"
          value={filters.cedula}
          onChange={handleFilterChange}
          placeholder="Buscar por cédula"
          className="px-3 py-2 border rounded-md"
        />
        <select
          name="rol"
          value={filters.rol}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">Filtrar por rol</option>
          <option value="admin_zonal">Admin Zonal</option>
          <option value="admin_farmaceutico">Admin Farmacéutico</option>
        </select>
        <select
          name="albergue"
          value={filters.albergue}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">Filtrar por albergue</option>
          {albergues.map(albergue => (
            <option key={albergue._id} value={albergue._id}>
              {albergue.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAdmins.map(admin => (
          <div key={admin._id} className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-xl font-bold mb-2">{admin.nombre} {admin.apellido}</h2>
            <p><strong>Email:</strong> {admin.email}</p>
            <p><strong>Cédula:</strong> {admin.cedula}</p>
            <p><strong>Teléfono:</strong> {admin.telefono}</p>
            <p><strong>Rol:</strong> {admin.rol}</p>
            <p><strong>Albergue:</strong> {admin.albergue ? admin.albergue.nombre : 'No asignado'}</p>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleEdit(admin)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(admin._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">{editingId ? 'Editar' : 'Agregar'} Administrador</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Nombre"
                required
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                placeholder="Apellido"
                required
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleInputChange}
                placeholder="Cédula"
                required
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Contraseña"
                required={!editingId}
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="Teléfono"
                required
                className="w-full px-3 py-2 border rounded-md"
              />
              <select
                name="rol"
                value={formData.rol}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Seleccione un rol</option>
                <option value="admin_zonal">Admin Zonal</option>
                <option value="admin_farmaceutico">Admin Farmacéutico</option>
              </select>
              <select
                name="albergue"
                value={formData.albergue}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Seleccione un albergue</option>
                {albergues.map(albergue => (
                  <option key={albergue._id} value={albergue._id}>
                    {albergue.nombre}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>
              </div>
              {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
