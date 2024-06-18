import React from 'react'

export const Nota = () => {
    return (
        <>
            <h2 className="text-2xl font-bold mb-4 text-indigo-600">¡Regístrate Ahora!</h2>
            <p className="text-gray-700 mb-4">
                <strong>Vivir cerca del volcán Cotopaxi</strong> implica estar preparados. Necesitamos tu información para:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Distribuir a las personas de forma segura en caso de emergencia.</li>
                <li>Abastecer cada ubicación con los medicamentos necesarios.</li>
            </ul>
            <p className="text-gray-700 mb-4">
                <strong>Tu seguridad es nuestra prioridad.</strong> Completa el formulario con datos precisos y actualizados.
            </p>
            <p className="text-gray-700 font-bold">
                ¡Tu colaboración puede salvar vidas!
            </p>
        </>
    )
}
