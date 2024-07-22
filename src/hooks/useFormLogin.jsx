import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

export const useFormLogin = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      cedula: '',
      password: ''
    },
  });
  const [loginError, setLoginError] = useState('');

  const onSubmit = async (data) => {

    try {


      const loginResponse = await axios.post('http://localhost:5000/api/usuario/login', {
        ...data
      });
      localStorage.setItem('token', loginResponse.data.token);
      console.log(loginResponse);
      navigate('/menu');
      reset();
    } catch (error) {
      setLoginError(error.response.data.message);
      
    }

  };

  return { register, handleSubmit, errors, onSubmit, loginError };
};