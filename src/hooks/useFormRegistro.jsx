import { useForm } from "react-hook-form";
import axios from "axios";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

export const useFormRegistro = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      nombre: "",
      apellido: "",
      cedula: "",
      email: "",
      edad: "",
      telefono: "",
      enfermedades: "",
      medicamentos: [],
      domicilio: "",
    },
  });

  const [domicilios, setDomicilios] = useState([]);
  const [enfermedades, setEnfermedades] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchDomicilios = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/domicilios"
        );
        setDomicilios(response.data);
      } catch (error) {
        console.error("Error fetching domicilios:", error);
      }
    };

    const fetchEnfermedades = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/enfermedad"
        );
        setEnfermedades(response.data);
      } catch (error) {
        console.error("Error fetching enfermedades:", error);
      }
    };

    fetchEnfermedades();
    fetchDomicilios();
  }, []);

  const selectedEnfermedad = watch("enfermedades");
  useEffect(() => {
    if (selectedEnfermedad) {
      const enfermedad = enfermedades.find(
        (e) => e.nombre === selectedEnfermedad
      );
      if (enfermedad) {
        setMedicamentos(enfermedad.medicamentos);
      }
    } else {
      setMedicamentos([]);
    }
  }, [selectedEnfermedad, enfermedades]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        const qrData = JSON.stringify(data);
        const qrImage = await QRCode.toDataURL(qrData);

        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dlyytqayv/image/upload",
          {
            file: qrImage,
            upload_preset: "QRCotopaxi",
          }
        );

        const personaResponse = await axios.post(
          "http://localhost:5000/api/ciudadano/register",
          {
            ...data,
            qrURL: cloudinaryResponse.data.secure_url,
          }
        );

        reset();
        setSubmitSuccess(true);
      } else {
        const qrData = JSON.stringify(data);
        const qrImage = await QRCode.toDataURL(qrData);

        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dlyytqayv/image/upload",
          {
            file: qrImage,
            upload_preset: "QRCotopaxi",
          }
        );

        const personaResponse = await axios.post(
          "http://localhost:5000/api/ciudadano/registerUser",
          {
            ...data,
            qrURL: cloudinaryResponse.data.secure_url,
          },
          {
            headers: { 'Authorization': `Bearer ${token}` },
          }
        );
      }

      reset();
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(
        error.response?.data?.error ||
        "Hubo un error al procesar la solicitud. Por favor, inténtelo de nuevo."
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    domicilios,
    enfermedades,
    medicamentos,
    isSubmitting,
    submitError,
    submitSuccess,
    watch,
  };
};
