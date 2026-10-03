import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout({ children }) {
    const { user, logout }        = useAuth()
    const location                = useLocation()
    const navigate                = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const menuItems = [
        { path: '/',         icon: 'calendar_month', label: 'Agenda'      },
        { path: '/clients',  icon: 'group',          label: 'Clientes'    },
        { path: '/services', icon: 'spa',            label: 'Serviços'    },
        { path: '/addons',   icon: 'auto_awesome',   label: 'Adicionais'  },
        { path: '/revenue',  icon: 'payments',       label: 'Faturamento' },
    ]

    return (
        <div className="flex" style={{ background: '#11131c', fontFamily: 'Plus Jakarta Sans, sans-serif', minHeight: '100dvh' }}>

            {/* Overlay mobile */}
            {menuOpen && (
                <div
                    className="fixed inset-0 z-20 md:hidden"
                    style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 min-h-full w-64 flex flex-col z-30
                transform transition-transform duration-300 ease-in-out
                ${menuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0
            `}
                style={{
                    background: 'rgba(29,31,40,0.95)',
                    backdropFilter: 'blur(24px)',
                    borderRight: '1px solid rgba(45,50,67,0.5)'
                }}>

                {/* Logo */}
                <div className="p-6 flex items-center justify-between"
                    style={{ borderBottom: '1px solid rgba(45,50,67,0.5)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{ background: 'rgba(224,122,147,0.15)' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#ffb1c2' }}>spa</span>
                        </div>
                        <div>
                            <h1 className="font-semibold" style={{ fontSize: '14px', color: '#e1e1ef' }}>DFreitas Nails</h1>
                            <p style={{ fontSize: '11px', color: '#8a90a4' }}>{user?.name}</p>
                        </div>
                    </div>
                    <button
                        className="md:hidden transition-colors"
                        style={{ color: '#8a90a4' }}
                        onClick={() => setMenuOpen(false)}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                    </button>
                </div>

                {/* Menu */}
                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                            style={location.pathname === item.path ? {
                                background: 'rgba(224,122,147,0.12)',
                                borderLeft: '3px solid #e07a93',
                                color: '#ffb1c2'
                            } : {
                                color: '#8a90a4',
                                borderLeft: '3px solid transparent'
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{item.icon}</span>
                            <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4" style={{ borderTop: '1px solid rgba(45,50,67,0.5)' }}>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                        style={{ color: '#8a90a4' }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(255,100,100,0.1)'
                            e.currentTarget.style.color = '#ffb4ab'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent'
                            e.currentTarget.style.color = '#8a90a4'
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Mobile Header */}
                <header className="md:hidden px-4 py-3 flex items-center gap-3"
                    style={{
                        background: 'rgba(29,31,40,0.95)',
                        borderBottom: '1px solid rgba(45,50,67,0.5)'
                    }}>
                    <button onClick={() => setMenuOpen(true)} style={{ color: '#ffb1c2' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>menu</span>
                    </button>
                    <h1 style={{ fontSize: '16px', fontWeight: '600', color: '#e1e1ef' }}>DFreitas Nails</h1>
                </header>

                {/* Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}