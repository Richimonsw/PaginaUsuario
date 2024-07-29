import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaUsers,
  FaHouseUser,
  FaShieldAlt,
  FaWarehouse,
  FaSignOutAlt,
  FaHome,
  FaUserMd,
} from "react-icons/fa";

export const Sidebar = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rol, setRol] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setRol(decodedToken.rol);
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavLinkClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const getNavLinkClass = (isActive) => {
    return isActive
      ? "flex items-center px-4 py-3 my-1 rounded-lg bg-indigo-800 text-white transition-all duration-200 shadow-lg"
      : "flex items-center px-4 py-3 my-1 rounded-lg text-indigo-100 hover:bg-indigo-500 hover:text-white transition-all duration-200";
  };

  return (
    <>
      <div className="md:hidden fixed p-2 z-50">
        <button
          onClick={toggleSidebar}
          className="text-white bg-indigo-700 p-2 rounded focus:outline-none"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      <div
        className={`fixed md:static top-0 left-0 h-full bg-indigo-700 text-white transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 z-40 shadow-xl`}
      >
        <div className="flex items-center justify-center mt-10">
          <div className="flex flex-col items-center mb-3 ">
            <div className="relative">
              <img
                className="w-24 h-24 rounded-full border-4 border-blue-500"
                src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                alt="Foto de perfil"
              />
            </div>
            <div className="mt-4 text-center">
              <h2 className="text-xl font-semibold text-gray-100">
                Administrador{" "}
              </h2>
            </div>
          </div>
        </div>

        <nav className="flex flex-col w-full px-4 flex-grow text-sm">
          {rol === "admin_general" && (
            <>
              <NavLink
                to="/menu/Dashboard"
                className={({ isActive }) => getNavLinkClass(isActive)}
                onClick={handleNavLinkClick}
              >
                <FaUsers className="mr-3" /> Datos Recolectados
              </NavLink>
              <NavLink
                to="/menu/Personal"
                className={({ isActive }) => getNavLinkClass(isActive)}
                onClick={handleNavLinkClick}
              >
                <FaUsers className="mr-3" /> Personal
              </NavLink>
              <NavLink
                to="/menu/Sitios-seguros"
                className={({ isActive }) => getNavLinkClass(isActive)}
                onClick={handleNavLinkClick}
              >
                <FaShieldAlt className="mr-3" /> Sitios Seguros
              </NavLink>
              <NavLink
                to="/menu/Bodegas"
                className={({ isActive }) => getNavLinkClass(isActive)}
                onClick={handleNavLinkClick}
              >
                <FaWarehouse className="mr-3" /> Bodegas
              </NavLink>
              <NavLink
                to="/menu/Domicilios"
                className={({ isActive }) => getNavLinkClass(isActive)}
                onClick={handleNavLinkClick}
              >
                <FaHome className="mr-3" /> Zonas de Riesgo
              </NavLink>
            </>
          )}

          {(rol === "admin_farmaceutico" ||
            rol === "admin_zonal" ||
            rol === "admin_general") && (
            <>
              <NavLink
                to="/menu/Albergues"
                className={({ isActive }) => getNavLinkClass(isActive)}
                onClick={handleNavLinkClick}
              >
                <FaHouseUser className="mr-3" /> Albergues
              </NavLink>
              <NavLink
                to="/menu/Enfermedades"
                className={({ isActive }) => getNavLinkClass(isActive)}
                onClick={handleNavLinkClick}
              >
                <FaUserMd className="mr-3" /> Enfermedades
              </NavLink>
            </>
          )}

          {(rol === "admin_farmaceutico" || rol === "admin_zonal") && (
            <>
              <NavLink
                to="/menu/Registros"
                className={({ isActive }) => getNavLinkClass(isActive)}
                onClick={handleNavLinkClick}
              >
                <FaHouseUser className="mr-3" /> Regisrar Ciudadano
              </NavLink>
            </>
          )}
        </nav>
        <div className="w-full px-4 pb-4 mt-auto">
          <button
            onClick={() => {
              handleNavLinkClick();
              onLogout();
            }}
            className="flex items-center px-4 py-3 w-full rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200 shadow-lg"
          >
            <FaSignOutAlt className="mr-3" /> Cerrar Sesión
          </button>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};
