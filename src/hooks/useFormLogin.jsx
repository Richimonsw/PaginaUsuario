import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useFormLogin = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      cedula: '',
      password: ''
    },
  });

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
      console.error(error);
    }

  };

  return { register, handleSubmit, errors, onSubmit };
};