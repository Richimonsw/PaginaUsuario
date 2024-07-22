import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Form, Button, Modal, message, Input, Space, List, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;
const API_BASE_URL = 'http://localhost:5000/api/enfermedad';

// Función para obtener el token del localStorage
const getToken = () => localStorage.getItem('token');

// Crear una instancia de axios con el token en los headers
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  }
});

// Interceptor para actualizar el token en cada petición
axiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const Enfermedades = () => {
  const [enfermedades, setEnfermedades] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEnfermedad, setEditingEnfermedad] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchEnfermedades();
  }, []);

  const fetchEnfermedades = async () => {
    try {
      const response = await axiosInstance.get('');
      setEnfermedades(response.data);
    } catch (error) {
      message.error('Error al cargar las enfermedades');
      if (error.response && error.response.status === 401) {
        // Manejar error de autenticación
        message.error('Sesión expirada. Por favor, vuelva a iniciar sesión.');
        // Aquí podrías redirigir al usuario a la página de login
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/${id}`);
      message.success('Enfermedad eliminada con éxito');
      fetchEnfermedades();
    } catch (error) {
      message.error('Error al eliminar la enfermedad');
    }
  };

  const handleEdit = (enfermedad) => {
    setEditingEnfermedad(enfermedad);
    form.setFieldsValue({
      ...enfermedad,
      medicamentos: enfermedad.medicamentos.map(({ _id, nombre, descripcion }) => ({
        key: _id, // Usamos _id como key para el formulario, pero no lo enviamos al backend
        nombre,
        descripcion
      }))
    });
    setModalVisible(true);
  };


  const handleSubmit = async (values) => {
    try {
      // Filtrar los campos innecesarios de los medicamentos
      const medicamentosFiltrados = values.medicamentos.map(({ nombre, descripcion }) => ({ nombre, descripcion }));

      const dataToSend = {
        ...values,
        medicamentos: medicamentosFiltrados 
      };

      if (editingEnfermedad) {
        await axiosInstance.put(`/${editingEnfermedad._id}`, dataToSend);
        message.success('Enfermedad actualizada con éxito');
      } else {
        await axiosInstance.post('/register', dataToSend);
        message.success('Enfermedad registrada con éxito');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingEnfermedad(null);
      fetchEnfermedades();
    } catch (error) {
      console.error('Error al guardar la enfermedad:', error);
      message.error('Error al guardar la enfermedad');
    }
  };


  
  const columns = [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
    {
      title: 'Medicamentos',
      dataIndex: 'medicamentos',
      key: 'medicamentos',
      render: (medicamentos) => (
        <List
          size="small"
          dataSource={medicamentos}
          renderItem={item => (
            <List.Item style={{ padding: '4px 0' }}>
              <Text strong>{item.nombre}: </Text>
              <Text>{item.descripcion}</Text>
            </List.Item>
          )}
        />
      )
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} danger />
        </>
      )
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestión de Enfermedades y Medicamentos</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setModalVisible(true)}
        style={{ marginBottom: '20px' }}
      >
        Añadir Enfermedad
      </Button>
      <Table
        dataSource={enfermedades}
        columns={columns}
        rowKey="_id"
        responsive
        scroll={{ x: true }}
      />
      <Modal
        title={editingEnfermedad ? "Editar Enfermedad" : "Añadir Enfermedad"}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingEnfermedad(null);
        }}
        footer={null}
        width={800}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="descripcion" label="Descripción" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.List name="medicamentos">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...field}
                      name={[field.name, 'nombre']}
                      fieldKey={[field.fieldKey, 'nombre']}
                      rules={[{ required: true, message: 'Falta el nombre del medicamento' }]}
                    >
                      <Input placeholder="Nombre del medicamento" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'descripcion']}
                      fieldKey={[field.fieldKey, 'descripcion']}
                      rules={[{ required: true, message: 'Falta la descripción del medicamento' }]}
                    >
                      <Input placeholder="Descripción del medicamento" />
                    </Form.Item>
                    <Button type="link" onClick={() => remove(field.name)} icon={<DeleteOutlined />}>
                      Eliminar
                    </Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Añadir medicamento
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingEnfermedad ? "Actualizar" : "Crear"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};