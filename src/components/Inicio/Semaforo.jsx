import React, { useState, useEffect } from 'react';

const alerts = [
    {
        color: 'red',
        title: 'Alerta Roja',
        description: 'Grado de alerta que significa un aviso de erupción volcánica en curso. Las sugerencias son cubrirse y evacuar hacia sitios seguros, aplicar plan de contingencia y llevar mochila de emergencia.',
        sound: 'alerta-roja.mp3'
    },
    {
        color: 'yellow',
        title: 'Alerta Amarilla',
        description: 'Se sugiere preparar y revisar los planes de contingencia y familiar. Es necesario tener lista una mochila de emergencia en el caso de las poblaciones o localidades cercanas al volcán.',
        sound: 'alerta-amarilla.mp3'
    },
    {
        color: 'orange',
        title: 'Alerta Naranja',
        description: 'Este nivel anuncia la preparación para una erupción inminente. En este grado se recomienda seguir las instrucciones dadas por las autoridades, evacuar si se es parte de un grupo vulnerable o si se desea hacerlo voluntariamente.',
        sound: 'alerta-naranja.mp3'
    }
];

export const Semaforo = () => {
    const [currentAlert, setCurrentAlert] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAlert((prevAlert) => (prevAlert + 1) % alerts.length);
        }, 10000); // Cambia cada 10 segundos

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const audio = new Audio(alerts[currentAlert].sound);
        audio.play();
    }, [currentAlert]);

    const handleClick = (index) => {
        setCurrentAlert(index);
    };

    return (
        <div className="flex flex-col items-center p-4">
            <div className="relative w-16 h-48 rounded-lg shadow-2xl overflow-hidden cursor-pointer border-4 border-gray-300">
                {alerts.map((alert, index) => (
                    <div
                        key={alert.color}
                        onClick={() => handleClick(index)}
                        className={`absolute w-full h-1/3 transition-transform duration-500 transform ${currentAlert === index ? 'scale-110' : 'scale-75'}`}
                        style={{ backgroundColor: alert.color, top: `${index * 33.33}%` }}
                    ></div>
                ))}
            </div>
            <div className="my-6 text-center px-4 max-w-xl">
                <h2 className="text-4xl font-bold text-white mb-4">{alerts[currentAlert].title}</h2>
                <p className="text-lg mt-2 text-white">{alerts[currentAlert].description}</p>
            </div>
        </div>
    );
};
