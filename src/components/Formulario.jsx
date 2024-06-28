
import { formConfig } from './Registro/formConfig';
import { FormField } from './Registro/FormField';
import { useFormRegistro } from '../hooks/useFormRegistro';

export const FormRegistro = () => {
  const { register, handleSubmit, errors, onSubmit, domicilios, enfermedades } = useFormRegistro();

  const updatedFormConfig = formConfig.map(field => {
    if (field.name === 'lugarResidencia') {
      return {
        ...field,
        options: {
          ...field.options,
          choices: domicilios.map(d => ({ value: d._id, label: d.nombre }))
        }
      };
    }
    if (field.name === 'enfermedadesAlergias') {
      return {
        ...field,
        options: {
          ...field.options,
          choices: enfermedades.map(e => ({ value: e._id, label: e.nombre }))
        }
      };
    }
    return field;
  });

  return (
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
          />
        ))}
      </div>
      <button
        type="submit"
        className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Enviar
      </button>
    </form>
  );
};
