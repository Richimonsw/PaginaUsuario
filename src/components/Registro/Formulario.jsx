import { useState, useEffect } from 'react';
import { formConfig } from './formConfig';
import { FormField } from '../FormField';
import { useFormRegistro } from '../../hooks/useFormRegistro';
import Modal from 'react-modal';

export const FormRegistro = () => {
  const {
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
    watch
  } = useFormRegistro();

  const [fieldValues, setFieldValues] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para el modal
  const selectedEnfermedad = watch("enfermedades");

  const updatedFormConfig = formConfig.map(field => {
    if (field.name === 'domicilio') {
      return {
        ...field,
        options: {
          ...field.options,
          choices: domicilios.map(d => ({ value: d._id, label: d.nombre }))
        }
      };
    }
    if (field.name === 'enfermedades') {
      return {
        ...field,
        options: {
          ...field.options,
          choices: [
            { value: '', label: 'Ninguna' },
            ...enfermedades.map(e => ({ value: e.nombre, label: e.nombre }))
          ]
        }
      };
    }
    if (field.name === 'medicamentos') {
      return {
        ...field,
        options: {
          ...field.options,
          choices: medicamentos.map(m => ({ value: m.nombre, label: m.nombre })),
          disabled: !selectedEnfermedad || selectedEnfermedad === '',
        }
      };
    }
    return field;
  });

  useEffect(() => {
    const subscription = watch((value) => {
      setFieldValues(value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Mostrar el modal cuando se completa el registro exitosamente
  useEffect(() => {
    if (submitSuccess) {
      setModalIsOpen(true);
    }
  }, [submitSuccess]);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full lg:w-2/3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Regístrate en nuestro sistema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {updatedFormConfig.map((field) => (
            <FormField
              key={field.name}
              {...field}
              register={register}
              errors={errors}
              value={fieldValues[field.name] || ''}
            />
          ))}
        </div>
        {isSubmitting ? (
          <div className="flex justify-center items-center">
            <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-4 border-t-indigo-600 rounded-full" role="status">
              <span className="visually-hidden"></span>
            </div>
          </div>
        ) : (
          <button
            type="submit"
            className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Enviar
          </button>
        )}
        {submitError && <p className="text-red-500 text-center mt-4">{submitError}</p>}
      </form>

      {/* Modal de éxito */}
      <Modal
  isOpen={modalIsOpen}
  onRequestClose={closeModal}
  contentLabel="Registro Exitoso"
  className="bg-white p-8 rounded-lg shadow-lg w-full lg:w-2/3 max-w-lg mx-auto relative z-50"
  overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
>

        <h2 className="text-2xl font-bold mb-4 text-center text-green-600">
          ¡Registro completado con éxito!
        </h2>
        <p className="text-center">
          Tus credenciales de acceso a la aplicación móvil son el <strong>NOMBRE</strong> y la <strong>CÉDULA</strong>.
        </p>
        <p>
          No olvides guardar tus credenciales en un lugar seguro, ya que si alguien obtiene tu cédula, podrá acceder a tu cuenta.
        </p>
        <button
          onClick={closeModal}
          className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Cerrar
        </button>
      </Modal>
    </>
  );
};
