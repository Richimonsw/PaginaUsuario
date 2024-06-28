import { useForm } from 'react-hook-form';
import axios from 'axios';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

export const useFormRegistro = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      nombres: '',
      apellidos: '',
      cedula: '',
      correoElectronico: '',
      edad: '',
      enfermedadesAlergias: '',
      medicamentos: '',
      lugarResidencia: '',
    },
  });

  const [domicilios, setDomicilios] = useState([]);
  const [enfermedades, setEnfermedades] = useState([]);

  useEffect(() => {
    const fetchDomicilios = async () => {
      try {
        const response = await axios.get('https://sistema-cotopaxi-backend.onrender.com/api/domicilios');
        setDomicilios(response.data);
      } catch (error) {
        console.error('Error fetching domicilios:', error);
      }
    };

    const fetchEnfermedades = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/enfermedades');
        setEnfermedades(response.data);
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

      const personaResponse = await axios.post('https://sistema-cotopaxi-backend.onrender.com/api/personas', {
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