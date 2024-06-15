import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import bgImage from './assets/cotopaxi_inicio.jpg';
import { Nabvar } from './components/Nabvar';
import { Inicio } from './views/Inicio';
import { Formulario } from './views/Formulario';

function App() {
  return (
    <Router>
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
          <main className="flex-grow flex flex-col">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/formulario" element={<Formulario />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;