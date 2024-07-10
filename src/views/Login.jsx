import React from 'react'
import { FormField } from '../components/FormField';
import { formConfig } from '../components/Login/formConfig';
import { useFormLogin } from '../hooks/useFormLogin';
import bgImage from '../assets/cotopaxi_inicio.jpg';
import logoImage from '../assets/volcan.jpg';

export const Login = () => {
    const { register, handleSubmit, errors, onSubmit } = useFormLogin();
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
             style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="w-full max-w-md space-y-8">
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
                    <div>
                        <img className="mx-auto h-16 sm:h-20 w-auto rounded-full" src={logoImage} alt="Cotopaxi Emergency System" />
                        <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
                            Sistema de Administración Cotopaxi
                        </h2>
                        <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
                            Control de emergencias y recursos
                        </p>
                    </div>
                    <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            {formConfig.map((field) => (
                                <div key={field.name} className="mb-3 sm:mb-4">
                                    <FormField
                                        {...field}
                                        register={register}
                                        errors={errors}
                                    />
                                </div>
                            ))}
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Iniciar Sesión
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}