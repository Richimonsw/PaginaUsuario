
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export const Menu = () => {

    const navigate = useNavigate();
    const handleLogout = () => {
        navigate('/login');
    };


    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar onLogout={handleLogout} />
            <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}
