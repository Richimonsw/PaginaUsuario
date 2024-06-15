import { useState } from 'react';
import { Link } from 'react-router-dom';
import imgVolcan from '../assets/volcan.jpg'

export const Nabvar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-transparent p-4">
            <div className="container mx-auto p-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <img src={imgVolcan} alt="volcan" className="w-16 h-16 rounded-full" />
                        <div className="text-white text-2xl font-bold ml-4">Volcán Cotopaxi</div>
                    </div>
                    <div className="hidden md:flex space-x-6">
                        <Link to="/" className="text-white text-xl font-bold">Inicio</Link>
                        <Link to="/formulario" className="text-white text-xl font-bold">Formulario</Link>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className={`transition-transform duration-500 ease-in-out transform ${isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'} origin-top`}>
                <div className="md:hidden mt-4">
                        <Link to="/" className="block text-white text-xl font-bold mb-2" onClick={() => setIsOpen(false)}>Inicio</Link>
                        <Link to="/formulario" className="block text-white text-xl font-bold" onClick={() => setIsOpen(false)}>Formulario</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
