import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Form, Button, Modal, message, Input, Space, List, Typography, DatePicker, Upload, Tag, Popover, Tooltip, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined, MedicineBoxOutlined, InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import * as XLSX from 'xlsx';

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
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
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
        descripcion,
      }))
    });
    setModalVisible(true);
  };


  const handleSubmit = async (values) => {
    try {
      // Filtrar los campos innecesarios de los medicamentos y formatear la fecha
      const medicamentosFiltrados = values.medicamentos.map(({ nombre, descripcion, codigo, fechaVencimiento }) => ({
        nombre,
        descripcion,
        codigo,
        fechaVencimiento: fechaVencimiento ? fechaVencimiento.format('YYYY-MM-DD') : null
      }));

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

  const handleExcelUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('http://localhost:5000/api/enfermedad/upload-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.resultados) {
        const successCount = response.data.resultados.filter(r => r.success).length;
        const errorCount = response.data.resultados.filter(r => r.error).length;

        message.success(`Archivo procesado. ${successCount} registros exitosos, ${errorCount} errores.`);

        if (errorCount > 0) {
          console.log('Errores:', response.data.resultados.filter(r => r.error));
        }
      } else {
        message.success('Archivo Excel procesado con éxito');
      }

      fetchEnfermedades();
    } catch (error) {
      message.error('Error al procesar el archivo Excel');
      console.error('Error:', error.response ? error.response.data : error.message);
    } finally {
      setUploading(false);
      setFileList([]);
    }

    return false;
  };

  const MedicamentoTag = ({ medicamento }) => (
    <Popover
      content={
        <List.Item.Meta
          avatar={<Avatar icon={<MedicineBoxOutlined />} style={{ backgroundColor: '#1890ff' }} />}
          title={medicamento.nombre}
          description={
            <>
              <p><Text strong>Código:</Text> {medicamento.codigo}</p>
              <p><Text strong>Descripción:</Text> {medicamento.descripcion}</p>
              {medicamento.fechaVencimiento && (
                <p><Text strong>Vence:</Text> {moment(medicamento.fechaVencimiento).format('DD/MM/YYYY')}</p>
              )}
            </>
          }
        />
      }
      title="Detalles del Medicamento"
      trigger="click"
    >
      <Tag color="blue" style={{ margin: '2px', cursor: 'pointer' }}>
        {medicamento.nombre}
      </Tag>
    </Popover>
  );

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
      render: (nombre) => <Text strong>{nombre}</Text>,
    },
    {
      title: 'Medicamentos',
      dataIndex: 'medicamentos',
      key: 'medicamentos',
      render: (medicamentos) => {
        const displayedMeds = medicamentos.slice(0, 3);
        const remainingMeds = medicamentos.slice(3);

        return (
          <Space wrap>
            {displayedMeds.map((med) => (
              <MedicamentoTag key={med._id} medicamento={med} />
            ))}
            {remainingMeds.length > 0 && (
              <Popover
                content={
                  <List
                    itemLayout="horizontal"
                    dataSource={remainingMeds}
                    renderItem={(item) => (
                      <MedicamentoTag key={item._id} medicamento={item} />
                    )}
                  />
                }
                title={`${remainingMeds.length} más medicamentos`}
                trigger="click"
              >
                <Tag color="cyan" style={{ cursor: 'pointer' }}>
                  +{remainingMeds.length} más
                </Tag>
              </Popover>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Acciones',
      key: 'acciones',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Editar">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="primary"
              shape="circle"
              size="small"
            />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id)}
              danger
              shape="circle"
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestión de Enfermedades y Medicamentos</h1>
      <Space style={{ marginBottom: '20px' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Añadir Enfermedad
        </Button>
        <Upload
          accept=".xlsx,.xls"
          beforeUpload={handleExcelUpload}
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
          onRemove={() => setFileList([])}
          multiple={false}
        >
          <Button
            icon={<UploadOutlined />}
            loading={uploading}
            disabled={fileList.length > 0}
          >
            {uploading ? 'Subiendo...' : 'Subir Excel'}
          </Button>
        </Upload>
      </Space>
      <Table
        columns={columns}
        dataSource={enfermedades}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          responsive: true,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        scroll={{ x: 'max-content' }}
        expandable={{
          expandedRowRender: (record) => (
            <p style={{ margin: 0 }}>
              <Text strong>Descripción:</Text> {record.descripcion}
            </p>
          ),
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <InfoCircleOutlined onClick={e => onExpand(record, e)} />
            ) : (
              <InfoCircleOutlined onClick={e => onExpand(record, e)} />
            )
        }}
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
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline" wrap>
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
                    <Form.Item
                      {...field}
                      name={[field.name, 'codigo']}
                      fieldKey={[field.fieldKey, 'codigo']}
                      rules={[{ required: true, message: 'Falta el código del medicamento' }]}
                    >
                      <Input placeholder="Código del medicamento" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'fechaVencimiento']}
                      fieldKey={[field.fieldKey, 'fechaVencimiento']}
                    >
                      <DatePicker placeholder="Fecha de vencimiento" />
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