import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout({ children }) {
    const { user, logout } = useAuth()
    const location         = useLocation()
    const navigate         = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const menuItems = [
        { path: '/',         icon: '📅', label: 'Agenda'       },
        { path: '/clients',  icon: '👥', label: 'Clientes'     },
        { path: '/services', icon: '💅', label: 'Serviços'     },
        { path: '/revenue',  icon: '💰', label: 'Faturamento'  },
    ]

    return (
        <div className="min-h-screen bg-[#1a1a1a] flex">

            {/* Sidebar */}
            <aside className="w-64 bg-[#2a2a2a] flex flex-col">

                {/* Logo */}
                <div className="p-6 border-b border-[#C9956C33]">
                    <h1 className="text-xl font-bold text-[#C9956C]">💅 DFreitas Nails</h1>
                    <p className="text-gray-400 text-sm mt-1">{user?.name}</p>
                </div>

                {/* Menu */}
                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map( item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                                ${location.pathname === item.path
                                    ? 'bg-[#C9956C] text-white'
                                    : 'text-gray-400 hover:bg-[#C9956C22] hover:text-white'
                                }`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-[#C9956C33]">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-900 hover:text-white transition"
                    >
                        <span>🚪</span>
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>

        </div>
    )
}