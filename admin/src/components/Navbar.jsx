import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { LogOut, Code, Users, BarChart3, Activity } from 'lucide-react';

const navItems = [
    { to: '/cards', icon: BarChart3, label: 'Dashboard' },
    { to: '/add', icon: Code, label: 'Add User' },
    { to: '/teams', icon: Users, label: 'Teams' },
    { to: '/logs', icon: Activity, label: 'Server Logs' },
    { to: '/edit-access', icon: Code, label: 'Edit Access' }
];

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-violet-900 to-black shadow-lg">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
                {/* Logo/Brand */}
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                        <Code className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-xl font-bold text-white">ERM Forms</span>
                </div>
                {/* Navigation */}
                <div className="flex items-center gap-6">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 rounded-lg transition-colors font-medium text-white hover:bg-white/10 ${
                                    isActive ? 'bg-white/20 text-yellow-200' : ''
                                }`
                            }
                        >
                            <Icon className="w-5 h-5 mr-2" />
                            {label}
                        </NavLink>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 rounded-lg bg-white/20 hover:bg-red-600 text-white transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;