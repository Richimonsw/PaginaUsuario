import React, { useState } from 'react';
import { FormField } from '../components/FormField';
import { formConfig } from '../components/Login/formConfig';
import { useFormLogin } from '../hooks/useFormLogin';
import bgImage from '../assets/cotopaxi_inicio.jpg';
import logoImage from '../assets/volcan.jpg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const Login = () => {
    const { register, handleSubmit, errors, onSubmit, loginError } = useFormLogin();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
                                    {field.name === 'password' ? (
                                        <div className="relative">
                                            <FormField
                                                {...field}
                                                type={showPassword ? 'text' : 'password'}
                                                register={register}
                                                errors={errors}
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                <button
                                                    type="button"
                                                    onClick={togglePasswordVisibility}
                                                    className="text-gray-500"
                                                >
                                                    {showPassword ? (
                                                        <FaEyeSlash className="h-5 w-5" aria-hidden="true" />
                                                    ) : (
                                                        <FaEye className="h-5 w-5" aria-hidden="true" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <FormField
                                            {...field}
                                            register={register}
                                            errors={errors}
                                        />
                                    )}
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
                        {loginError && <p className="text-red-500 text-center mt-4">{loginError}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};
