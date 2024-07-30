import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '../../Card';
import { FaRegEnvelope, FaAddressCard, FaPhoneAlt, FaUserTie, FaBox, FaExclamationCircle } from 'react-icons/fa';
import Loading from '../../Loading';


export const Administradores = ({ albergueId }) => {
    const [administradores, setAdministradores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAdministradores();
    }, [albergueId]);

    const fetchAdministradores = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/usuario/${albergueId}/albergue`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setAdministradores(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener administradores:', error);
            setError('Error al obtener administradores');
            setLoading(false);
        }
    };

    const handleInspect = (id) => {
        console.log('Inspect', id);
    };

    if (loading) {
        return <Loading />; // Utiliza el nuevo componente de Loading
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Administradores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {administradores.length === 0 ? (
                    <div className="flex flex-col items-center bg-yellow-100 p-4 rounded-lg shadow-md">
                        <FaExclamationCircle className="text-yellow-500 text-4xl mb-2" />
                        <p className="text-yellow-700">No hay ningún administrador asignado al albergue todavía.</p>
                    </div>
                ) : (
                    administradores.map(administrador => (
                        <Card
                            key={administrador._id}
                            title={`${administrador.nombre} ${administrador.apellido}`}
                            items={[
                                { icon: FaRegEnvelope, text: `${administrador.email}`, color: "blue" },
                                { icon: FaAddressCard, text: `${administrador.cedula}`, color: "green" },
                                { icon: FaPhoneAlt, text: `${administrador.telefono}`, color: "green" },
                                { icon: FaUserTie, text: `${administrador.rol}`, color: "purple" },
                            ]}
                            actions={[
                                { icon: FaBox, onClick: () => handleInspect(administrador._id), color: "green" }
                            ]}
                        />
                    ))
                )}
            </div>
        </>
    );
};
