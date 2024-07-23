import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaWarehouse, FaShieldAlt, FaUsers, FaHouseUser, FaSearch } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAlbergues: 0,
    totalBodegas: 0,
    totalSitiosSeguro: 0,
    totalCiudadanos: 0,
  });
  const [ciudadanos, setCiudadanos] = useState([]);
  const [filteredCiudadanos, setFilteredCiudadanos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      try {
        const [alberguesRes, bodegasRes, sitiosSeguroRes, ciudadanosTotalRes, ciudadanosDataRes] = await Promise.all([
          axios.get('http://localhost:5000/api/albergue/total', config),
          axios.get('http://localhost:5000/api/bodega/total', config),
          axios.get('http://localhost:5000/api/sitioSeguro/total', config),
          axios.get('http://localhost:5000/api/ciudadano/total', config),
          axios.get('http://localhost:5000/api/ciudadano/ciudadanosDeTodosLosAlbergues', config),
        ]);

        setStats({
          totalAlbergues: alberguesRes.data.totalAlbergues || 0,
          totalBodegas: bodegasRes.data.totalBodegas || 0,
          totalSitiosSeguro: sitiosSeguroRes.data.totalSitiosSeguro || 0,
          totalCiudadanos: ciudadanosTotalRes.data.totalCiudadanos || 0,
        });

        setCiudadanos(ciudadanosDataRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [navigate]);


  useEffect(() => {
    setFilteredCiudadanos(
      ciudadanos.filter(ciudadano =>
        ciudadano.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ciudadano.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ciudadano.cedula.includes(searchTerm) ||
        ciudadano.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, ciudadanos]);

  const chartData = [
    { name: 'Albergues', value: stats.totalAlbergues, color: '#3B82F6' },
    { name: 'Bodegas', value: stats.totalBodegas, color: '#10B981' },
    { name: 'Sitios Seguros', value: stats.totalSitiosSeguro, color: '#F59E0B' },
    { name: 'Ciudadanos', value: stats.totalCiudadanos, color: '#8B5CF6' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Gestión de Emergencias</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<FaHouseUser />} title="Total Albergues" value={stats.totalAlbergues} color="bg-blue-500" />
          <StatCard icon={<FaWarehouse />} title="Total Bodegas" value={stats.totalBodegas} color="bg-green-500" />
          <StatCard icon={<FaShieldAlt />} title="Total Sitios Seguros" value={stats.totalSitiosSeguro} color="bg-yellow-500" />
          <StatCard icon={<FaUsers />} title="Total Ciudadanos" value={stats.totalCiudadanos} color="bg-purple-500" />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Distribución de Recursos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Ciudadanos</h2>
          <div className="mb-4 flex items-center">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Buscar por nombre, cédula o email"
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cedula</th>
                  <th className=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edad</th>
                  <th className=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enfermedades</th>
                  <th className=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicamentos</th>
                  <th className=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefono</th>
                  <th className=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Albergue</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCiudadanos.map((ciudadano, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{ciudadano.nombre}  {ciudadano.apellido}</td>
                    <td className=" py-4 whitespace-nowrap">{ciudadano.cedula}</td>
                    <td className=" py-4 whitespace-nowrap">{ciudadano.edad}</td>
                    <td className=" py-4 whitespace-nowrap">{ciudadano.email}</td>
                    <td className=" py-4 whitespace-nowrap">{ciudadano.enfermedades}</td>
                    <td className=" py-4">
                      <ul className="list-disc list-inside">
                        {ciudadano.medicamentos.slice(0, 3).map((medicamento, index) => (
                          <li key={index} className="text-sm text-gray-700">{medicamento}</li>
                        ))}
                        {ciudadano.medicamentos.length > 3 && (
                          <li className="text-sm text-blue-500 cursor-pointer">
                            +{ciudadano.medicamentos.length - 3} más...
                          </li>
                        )}
                      </ul>
                    </td>
                    <td className=" py-4 whitespace-nowrap">{ciudadano.telefono}</td>
                    <td className=" py-4 whitespace-nowrap">{ciudadano.albergue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className={`${color} rounded-lg shadow-md p-6 text-white`}>
    <div className="flex items-center justify-between">
      <div className="text-3xl">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
    <div className="mt-2 text-sm font-medium">{title}</div>
  </div>
);