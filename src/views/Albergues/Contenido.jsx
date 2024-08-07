import React, { useEffect, useState } from 'react';
import { Administradores } from '../../components/Menu/Albergues/Administradores';
import { Bodegas } from '../../components/Menu/Albergues/Bodegas';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, Input, Button, Space, Modal, Form, message, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, QrcodeOutlined } from '@ant-design/icons';


export const Contenido = () => {
    const [ciudadanos, setCiudadanos] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const location = useLocation();
    const navigate = useNavigate();
    const [rol, setRol] = useState('');
    

    

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setRol(decodedToken.rol);
        }
    }, []);

    const getAlbergueId = () => {
        const params = new URLSearchParams(location.search);
        return params.get('Albergue_id');
    };

    const albergueId = getAlbergueId();

    useEffect(() => {
        fetchCiudadanos();
    }, [albergueId]);

    const fetchCiudadanos = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}ciudadano/${albergueId}/ciudadanos`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCiudadanos(response.data);
        } catch (error) {
            console.error('Error fetching ciudadanos:', error);
            message.error('No se pudieron cargar los ciudadanos');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
        },
        {
            title: 'Apellido',
            dataIndex: 'apellido',
            key: 'apellido',
        },
        {
            title: 'Edad',
            dataIndex: 'edad',
            key: 'edad',
        },
        {
            title: 'Teléfono',
            dataIndex: 'telefono',
            key: 'telefono',
        },
        {
            title: 'Cedula',
            dataIndex: 'cedula',
            key: 'cedula',
            filteredValue: [searchText],
            onFilter: (value, record) =>
                record.cedula.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Enfermedades',
            dataIndex: 'enfermedades',
            key: 'enfermedades',
        },
        {
            title: 'Medicamentos',
            dataIndex: 'medicamentos',
            key: 'medicamentos',
            render: (medicamentos) => medicamentos.join(', ')
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        Editar
                    </Button>
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)}>
                        Eliminar
                    </Button>
                </Space>
            ),
        },
    ];

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleEdit = (record) => {
        form.setFieldsValue(record);
        setIsEditing(true);
        setIsModalVisible(true);
    };

    const handleDelete = async (record) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_BASE_URL}ciudadano/${record._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success('Ciudadano eliminado con éxito');
            fetchCiudadanos();
        } catch (error) {
            console.error('Error al eliminar ciudadano:', error);
            message.error('No se pudo eliminar el ciudadano');
        }
    };

    const handleModalOk = () => {
        form.validateFields().then(async (values) => {
            try {
                const token = localStorage.getItem('token');
                if (values._id) {
                    // Actualizar ciudadano existente
                    await axios.put(`${import.meta.env.VITE_BASE_URL}ciudadano/${values._id}`,
                        { ...values, albergue: albergueId },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    message.success('Ciudadano actualizado con éxito');
                }
                setIsModalVisible(false);
                form.resetFields();
                fetchCiudadanos();
            } catch (error) {
                console.error('Error al guardar ciudadano:', error);
                message.error('No se pudo guardar el ciudadano');
            }
        });
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="p-4">
            <div className="flex items-center mb-4">
                <button
                    onClick={handleGoBack}
                    className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                >
                    <FaArrowLeft className="mr-2" />
                    Volver
                </button>
            </div>

            {rol === 'admin_general' && (
                <>
                    <Administradores albergueId={albergueId} />
                </>
            )}
            <Bodegas albergueId={albergueId} />
            
            <div className="bg-white p-4 mt-5 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">Ciudadanos</h2>
                <Input.Search
                    placeholder="Buscar por nombre, cedula"
                    onSearch={handleSearch}
                    style={{ width: '100%', maxWidth: 300, marginBottom: 16 }}
                />
                <Spin spinning={loading}>
                    <Table
                        columns={columns}
                        dataSource={ciudadanos}
                        rowKey="_id"
                        scroll={{ x: 'max-content' }}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true
                        }}
                    />
                </Spin>
                <Modal
                    title={isEditing ? "Editar Ciudadano" : "Agregar Ciudadano"}
                    visible={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={() => setIsModalVisible(false)}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item name="_id" hidden>
                            <Input />
                        </Form.Item>
                        <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="apellido" label="Apellido" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="cedula" label="Cédula" rules={[{ required: true }]}>
                            <Input
                                readOnly={isEditing}
                                style={isEditing ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {}}
                            />
                        </Form.Item>
                        <Form.Item name="telefono" label="Teléfono" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="edad" label="Edad" rules={[{ required: true, type: 'number' }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="enfermedades" label="Enfermedades" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};