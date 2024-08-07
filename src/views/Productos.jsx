import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Modal, Form, message, Select, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SwapOutlined, MinusCircleOutlined, QrcodeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import QrScanner from 'react-qr-scanner'
import useSound from 'use-sound';
import successSound from '../assets/sound/exito.mp3';
import errorSound from '../assets/sound/error.mp3';

export const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [transferForm] = Form.useForm();
  const [bodegas, setBodegas] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [scanResult, setScanResult] = useState(null);
  const [playSuccess] = useSound(successSound);
  const [playError] = useSound(errorSound);

  const handleQRScan = async (result) => {
    if (result && isScanning) {
      setIsScanning(false);
      try {
        const token = localStorage.getItem('token');
        const bodegaId = new URLSearchParams(location.search).get('Bodega_id');

        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}productos/actualizarProductoPorQR`,
          {
            qrData: result,
            bodegaId: bodegaId,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response);
        if (response.data.status === 'error') {
          playError();
          setScanResult('error');
          message.error(response.data.message);
        } else {
          playSuccess();
          setScanResult('success');
          message.success(response.data.message);
          fetchProductos(); // Asegúrate de que esta función exista y actualice la lista de productos
        }
      } catch (error) {
        console.error('Error al procesar QR:', error);
        playError();
        setScanResult('error');
        if (error.response) {
          message.error(`Error del servidor: ${error.response.data.message || 'No se pudo procesar el código QR'}`);
        } else if (error.request) {
          message.error('No se pudo conectar con el servidor');
        } else {
          message.error('Error al procesar la solicitud');
        }
      }

      setTimeout(() => {
        setScanResult(null); // Restablece el estado del resultado del escaneo
        setIsScanning(true);
      }, 3000);
    }
  };

  const handleQRError = (error) => {
    console.error(error);
    playError();
    setScanResult('error');
    message.error('Error al escanear el código QR');
  };

  const getBodegaId = () => {
    const params = new URLSearchParams(location.search);
    return params.get('Bodega_id');
  };

  const bodegaId = getBodegaId();

  useEffect(() => {
    fetchProductos();
    fetchBodegas();
  }, []);

  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}productos/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const productosFiltrados = response.data.filter(producto => producto.bodega === bodegaId);
      setProductos(productosFiltrados);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      message.error('No se pudieron cargar los productos');
    }
  };

  const fetchBodegas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}bodega`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBodegas(response.data);
    } catch (error) {
      console.error('Error al obtener bodegas:', error);
      message.error('No se pudieron cargar las bodegas');
    }
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      filteredValue: [searchText],
      onFilter: (value, record) =>
        record.nombre.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Stock Minimo',
      dataIndex: 'stockMin',
      key: 'stockMin',
    },
    {
      title: 'Stock Maximo',
      dataIndex: 'stockMax',
      key: 'stockMax',
    },
    {
      title: 'Codigo',
      dataIndex: 'codigo',
      key: 'codigo',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Fecha de caducidad',
      dataIndex: 'fechaVencimiento',
      key: 'fechaVencimiento',
      render: (text) => formatDate(text),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space size="middle">
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleAdd = () => {
    form.resetFields();
    setIsEditing(false);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {

    // Convertir la fecha a formato yyyy-MM-dd
    const date = new Date(record.fechaVencimiento);
    const formattedDate = date.toISOString().split('T')[0]; // Esto dará formato yyyy-MM-dd

    const formattedRecord = {
      ...record,
      fechaVencimiento: formattedDate
    };

    form.setFieldsValue(formattedRecord);
    setIsEditing(true);
    setIsModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_BASE_URL}productos/${record._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Producto eliminado con éxito');
      fetchProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      message.error('No se pudo eliminar el producto');
    }
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const token = localStorage.getItem('token');
        const formattedValues = {
          ...values,
          fechaVencimiento: values.fechaVencimiento ? new Date(values.fechaVencimiento).toISOString() : null
        };
        if (values._id) {
          const { _id, ...productData } = formattedValues;
          await axios.put(`${import.meta.env.VITE_BASE_URL}productos/${_id}`,
            { ...productData, bodega: bodegaId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          message.success('Producto actualizado con éxito');
        } else {
          await axios.post(`${import.meta.env.VITE_BASE_URL}productos/register`,
            { ...formattedValues, bodega: bodegaId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          message.success('Producto creado con éxito');
        }
        setIsModalVisible(false);
        form.resetFields();
        fetchProductos();
      } catch (error) {
        console.error('Error al guardar producto:', error);
        message.error('No se pudo guardar el producto');
      }
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    form.resetFields();
  };

  const handleTransfer = () => {
    transferForm.resetFields();
    setIsTransferModalVisible(true);
  };

  const handleTransferModalOk = () => {
    transferForm.validateFields().then(async (values) => {
      try {
        const token = localStorage.getItem('token');
        const transferData = {
          ...values,
          bodegaOrigenId: bodegaId
        };
        await axios.post(`${import.meta.env.VITE_BASE_URL}productos/transferirProducto`, transferData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        message.success('Productos transferidos con éxito');
        setIsTransferModalVisible(false);
        transferForm.resetFields();
        fetchProductos();
      } catch (error) {
        console.error('Error al transferir productos:', error);
        setError(error.response.data);
        message.error('No se pudieron transferir los productos');
      }
    });
  };

  const handleTransferModalCancel = () => {
    setIsTransferModalVisible(false);
    transferForm.resetFields();
  };

  const handleGoBack = () => {
    navigate(-1);
  };



  return (
    <div className="p-4">
      <div className="mb-4">
        <button
          onClick={handleGoBack}
          className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Volver
        </button>
      </div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Input.Search
            placeholder="Buscar por nombre"
            onSearch={handleSearch}
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} block>
            Agregar Producto
          </Button>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Button type="primary" icon={<SwapOutlined />} onClick={handleTransfer} block>
            Transferir Productos
          </Button>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Button type="primary" icon={<QrcodeOutlined />} onClick={() => setIsQRModalVisible(true)} block>
            Escanear Código QR
          </Button>
        </Col>
      </Row>
      <Modal
        title="Escanear Código QR"
        visible={isQRModalVisible}
        onCancel={() => setIsQRModalVisible(false)}
        footer={null}
      >
        {isScanning ? (
          <QrScanner
            delay={300}
            onError={handleQRError}
            onScan={handleQRScan}
            style={{ width: '100%' }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            {scanResult === 'success' ? (
              <CheckCircleOutlined style={{ fontSize: '48px', color: 'green' }} />
            ) : (
              <CloseCircleOutlined style={{ fontSize: '48px', color: 'red' }} />
            )}
            <p>{scanResult === 'success' ? 'Producto escaneado correctamente' : 'Error al escanear el producto'}</p>
          </div>
        )}
        {!isScanning && <p>Espere un momento antes de escanear otro código...</p>}
      </Modal>
      <Table
        columns={columns}
        dataSource={productos}
        rowKey="_id"
        scroll={{ x: 'max-content' }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true
        }}
      />
      <Modal
        title={isEditing ? "Editar Producto" : "Agregar Producto"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="_id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="stockMin" label="Stock Minimo" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="stockMax" label="Stock Maximo" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="codigo" label="Codigo" rules={[{ required: true }]}>
            <Input
              readOnly={isEditing}
              style={isEditing ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {}}
            />
          </Form.Item>
          <Form.Item name="descripcion" label="Descripción">
            <Input />
          </Form.Item>
          <Form.Item name="fechaVencimiento" label="Fecha de caducidad">
            <Input
              type="date"
              style={isEditing ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {}}
              disabled={isEditing}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Transferir Productos"
        visible={isTransferModalVisible}
        onOk={handleTransferModalOk}
        onCancel={handleTransferModalCancel}
      >
        <Form form={transferForm} layout="vertical">
          <Form.List name="productos">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space key={field.key} align="baseline">
                    <Form.Item
                      {...field}
                      name={[field.name, 'producto']}
                      fieldKey={[field.fieldKey, 'producto']}
                      label="Producto"
                      rules={[{ required: true, message: 'Selecciona un producto' }]}
                    >
                      <Select placeholder="Selecciona un producto" style={{ width: 200 }}>
                        {productos.map(producto => (
                          <Select.Option key={producto._id} value={producto._id}>
                            {producto.nombre}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'cantidad']}
                      fieldKey={[field.fieldKey, 'cantidad']}
                      label="Cantidad"
                      rules={[{ required: true, message: 'Ingresa la cantidad' }]}
                    >
                      <Input type="number" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Agregar Producto
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item
            name="bodegaDestinoId"
            label="Bodega Destino"
            rules={[{ required: true, message: 'Selecciona una bodega de destino' }]}
          >
            <Select placeholder="Selecciona una bodega" style={{ width: '100%' }}>
              {bodegas
                .filter(bodega => bodega._id !== bodegaId)
                .map(bodega => (
                  <Select.Option key={bodega._id} value={bodega._id}>
                    {bodega.nombre}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          {error && (
            <div className="mt-4 text-red-500">
              {error}
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
};
