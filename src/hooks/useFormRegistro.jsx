import { useForm } from 'react-hook-form';
import axios from 'axios';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

export const useFormRegistro = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      nombre: '',
      apellido: '',
      cedula: '',
      email: '',
      edad: '',
      telefono: '',
      enfermedades: '',
      domicilio: '',
    },
  });

  const [domicilios, setDomicilios] = useState([]);
  const [enfermedades, setEnfermedades] = useState([]);

  useEffect(() => {
    const fetchDomicilios = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/domicilios');
        setDomicilios(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching domicilios:', error);
      }
    };

    const fetchEnfermedades = async () => {
      try {
        //const response = await axios.get('http://localhost:5000/api/enfermedades');

        
        setEnfermedades([
          {
            id: 1,
            nombre: 'Enfermedad 1',
            descripcion: 'Descripción de la enfermedad 1',
            categoria: 'Categoria de la enfermedad 1',
            estado: true,
          },
          {
            id: 2,
            nombre: 'Enfermedad 2',
            descripcion: 'Descripción de la enfermedad 2',
            categoria: 'Categoria de la enfermedad 2',
            estado: false,
          },
          {
            id: 3,
            nombre: 'Enfermedad 3',
            descripcion: 'Descripción de la enfermedad 3',
            categoria: 'Categoria de la enfermedad 3',
            estado: false,
          },
        ]);
      } catch (error) {
        console.error('Error fetching domicilios:', error);
      }
    };

    
    fetchEnfermedades();
    fetchDomicilios();
  }, []);

  const onSubmit = async (data) => {

    try {

      const qrData = JSON.stringify(data);
      const qrImage = await QRCode.toDataURL(qrData);

      const cloudinaryResponse = await axios.post('https://api.cloudinary.com/v1_1/dlyytqayv/image/upload', {
        file: qrImage,
        upload_preset: 'QRCotopaxi'
      });

      console.log(cloudinaryResponse);

      const personaResponse = await axios.post('http://localhost:5000/api/ciudadano/register', {
        ...data,
        qrURL: cloudinaryResponse.data.secure_url
      });

      console.log(personaResponse);

      reset();
    } catch (error) {
      console.error(error);
    }

  };

  return { register, handleSubmit, errors, onSubmit, domicilios, enfermedades };
};