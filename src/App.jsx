import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import bgImage from './assets/cotopaxi_inicio.jpg';
import { Nabvar } from './components/Nabvar';
import { Inicio } from './views/Inicio';
import { Formulario } from './views/Formulario';
import { Login } from './views/Login';
import { Menu } from './views/Menu';
import { Personal } from './components/Menu/Personal';
import { Albergues } from './components/Menu/Albergues';
import { SitioSeguros } from './components/Menu/SitioSeguros';
import { Bodegas } from './components/Menu/Bodegas';
import { Productos } from './views/Productos';
import { Domicilio } from './components/Menu/Domicilio';
import { Contenido } from './views/Albergues/Contenido';
import { Enfermedades } from './components/Menu/Enfermedades';
import { Dashboard } from './components/Menu/Dashboard';
import ProtectedRoute from './Services/ProtectedRoute';
import { useEffect } from 'react';
import RoleProtectedRoute from './Services/RoleProtectedRoute';

const protectedRoute = (Component) => (
  <ProtectedRoute>
    <Component />
  </ProtectedRoute>
);




function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={protectedRoute(Menu)}>
          <Route
            path="Dashboard"
            element={
              <RoleProtectedRoute allowedRoles={'admin_general'}>
                <Dashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="Personal"
            element={
              <RoleProtectedRoute allowedRoles={['admin_general']}>
                <Personal />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="Albergues"
            element={
              <RoleProtectedRoute allowedRoles={['admin_general', 'admin_farmaceutico', 'admin_zonal']}>
                <Albergues />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="Sitios-seguros"
            element={
              <RoleProtectedRoute allowedRoles={['admin_general']}>
                <SitioSeguros />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="Bodegas"
            element={
              <RoleProtectedRoute allowedRoles={['admin_general', 'admin_farmaceutico', 'admin_zonal']}>
                <Bodegas />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="Domicilios"
            element={
              <RoleProtectedRoute allowedRoles={['admin_general']}>
                <Domicilio />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="Productos"
            element={
              <RoleProtectedRoute allowedRoles={['admin_general', 'admin_farmaceutico', 'admin_zonal']}>
                <Productos />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="Contenido"
            element={
              <RoleProtectedRoute allowedRoles={['admin_general', 'admin_farmaceutico', 'admin_zonal']}>
                <Contenido />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="Enfermedades"
            element={
              <RoleProtectedRoute allowedRoles={['admin_general', 'admin_farmaceutico', 'admin_zonal']}>
                <Enfermedades />
              </RoleProtectedRoute>
            }
          />
        </Route>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="formulario" element={<Formulario />} />
        </Route>
      </Routes>
    </Router>
  );
}

function MainLayout() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50" />
      <div className="relative z-10 flex-grow flex flex-col">
        <Nabvar />
        <main className="flex-grow flex flex-col mt-24">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;