import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import imgVolcan from '../assets/volcan.jpg';

export const Nabvar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <div className="fixed w-full z-10 ">
      <nav
        className={`container mx-auto  px-4 py-3 flex justify-between items-center transition-all duration-300 ${
          isScrolled ? 'bg-black opacity-70 ' : 'bg-black sm:bg-transparent'
        }`}
      >
        <div className="flex items-center">
          <img src={imgVolcan} alt="volcan" className="w-16 h-16 rounded-full" />
          <div className="text-white text-2xl font-bold ml-4">Volcán Cotopaxi</div>
        </div>
        <div className="hidden md:flex space-x-6">
          <Link
            to="/"
            className={`text-white text-xl font-bold hover:text-gray-300 transition-colors duration-300 relative ${
              location.pathname === '/' ? 'text-gray-300' : ''
            }`}
          >
            Inicio
            {location.pathname === '/' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-blue-700  rounded-full"></div>
            )}
          </Link>
          <Link
            to="/formulario"
            className={`text-white text-xl font-bold hover:text-gray-300 transition-colors duration-300 relative ${
              location.pathname === '/formulario' ? 'text-gray-300' : ''
            }`}
          >
            Formulario
            {location.pathname === '/formulario' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-blue-700 rounded-full"></div>
            )}
          </Link>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
              ></path>
            </svg>
          </button>
        </div>
      </nav>
      <div
        className={`md:hidden transition-transform duration-500 ease-in-out transform ${
          isOpen ? 'scale-y-100 ' : 'scale-y-0 bg-transparent'
        } origin-top bg-black opacity-70`}
      >
        <div className=" flex flex-col items-center">
          <Link
            to="/"
            className="text-white text-xl font-bold mb-2 hover:text-gray-300 transition-colors duration-300 relative"
            onClick={() => setIsOpen(false)}
          >
            Inicio
            {location.pathname === '/' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gray-300 rounded-full"></div>
            )}
          </Link>
          <Link
            to="/formulario"
            className="text-white text-xl font-bold mb-2 hover:text-gray-300 transition-colors duration-300 relative"
            onClick={() => setIsOpen(false)}
          >
            Formulario
            {location.pathname === '/formulario' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gray-300 rounded-full"></div>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};