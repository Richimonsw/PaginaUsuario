import React, { useEffect, useState } from 'react'
import { Card } from '../../Card';
import { FaArrowRight, FaWarehouse, FaUserTie, FaBox, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from '../../Loading';
import { NotificacionGlobal } from '../../NotificacionGlobal';

export const Bodegas = ({ albergueId }) => {
    const navigate = useNavigate();
    const [bodegas, setBodegas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBodegas();
    }, [albergueId]);

    const fetchBodegas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/bodega/${albergueId}/bodegas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setBodegas(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener bodegas:', error);
            setError('Error al obtener bodegas');
            setLoading(false);
        }
    };

    const handleInspect = async (id) => {
        navigate(`/menu/Productos?Bodega_id=${id}`);
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const getAlertColor = (alerta) => {
        if (alerta === "Crítico: La bodega está casi llena") return "red";
        if (alerta === "Advertencia: La bodega está llegando a su capacidad máxima") return "yellow";
        return "green";
    };

    return (
        <>
            
            <h2 className="text-2xl font-bold mb-4 mt-4">Bodegas</h2>
            <NotificacionGlobal bodegas={bodegas} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bodegas.length === 0 ? (
                    <div className="flex flex-col items-center bg-yellow-100 p-4 rounded-lg shadow-md">
                        <FaExclamationCircle className="text-yellow-500 text-4xl mb-2" />
                        <p className="text-yellow-700">No hay ninguna bodega asignada al albergue todavía.</p>
                    </div>
                ) : (
                    bodegas.map(bodega => (
                        <Card
                            key={bodega._id}
                            title={bodega.nombre}
                            items={[
                                { icon: FaWarehouse, text: `Categoria: ${bodega.categoria}`, color: "green" },
                                { icon: FaUserTie, text: `Capacidad: ${bodega.capacidad}`, color: "purple" },
                                { icon: FaBox, text: `Productos: ${bodega.cantidadProductos}`, color: "blue" },
                                { 
                                    icon: bodega.alerta ? FaExclamationCircle : FaCheckCircle, 
                                    text: bodega.alerta || "Bodega estable", 
                                    color: getAlertColor(bodega.alerta) 
                                }
                            ]}
                            actions={[
                                { icon: FaBox, onClick: () => handleInspect(bodega._id), color: "green" },
                            ]}
                        />
                    ))
                )}
            </div>
        </>
    )
}