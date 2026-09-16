import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout({ children }) {
    const { user, logout }   = useAuth()
    const location           = useLocation()
    const navigate           = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const menuItems = [
        { path: '/',         icon: '📅', label: 'Agenda'      },
        { path: '/clients',  icon: '👥', label: 'Clientes'    },
        { path: '/services', icon: '💅', label: 'Serviços'    },
		{ path: '/addons',   icon: '✨', label: 'Adicionais'  },
        { path: '/revenue',  icon: '💰', label: 'Faturamento' },
    ]

    return (
        <div className="min-h-screen bg-[#1a1a1a] flex">

            {/* Overlay mobile */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 min-h-full w-64 bg-[#2a2a2a] flex flex-col z-30
                transform transition-transform duration-300 ease-in-out
                ${menuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0
            `}>
                {/* Logo */}
                <div className="p-6 border-b border-[#C9956C33] flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-[#C9956C]">💅 DFreitas Nails</h1>
                        <p className="text-gray-400 text-sm mt-1">{user?.name}</p>
                    </div>
                    <button
                        className="md:hidden text-gray-400 hover:text-white"
                        onClick={() => setMenuOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                {/* Menu */}
                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map( item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMenuOpen(false)}
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
            <div className="flex-1 flex flex-col min-w-0">

                {/* Mobile Header */}
                <header className="md:hidden bg-[#2a2a2a] px-4 py-3 flex items-center gap-3 border-b border-[#C9956C33]">
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="text-[#C9956C] text-2xl"
                    >
                        ☰
                    </button>
                    <h1 className="text-lg font-bold text-[#C9956C]">💅 DFreitas Nails</h1>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}