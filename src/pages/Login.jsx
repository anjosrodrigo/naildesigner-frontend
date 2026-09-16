import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

export default function Login() {
    const [email, setEmail]       = useState('')
    const [password, setPassword] = useState('')
    const [error, setError]       = useState('')
    const [loading, setLoading]   = useState(false)

    const { login } = useAuth()
    const navigate  = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await api.post('/auth/login', { email, password })
            const { token, name, email: userEmail } = response.data

            login( token, { name, email: userEmail } )
            navigate('/')
        } catch (err) {
            setError('Email ou senha inválidos.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
            <div className="bg-[#2a2a2a] p-8 rounded-2xl shadow-2xl w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#C9956C]">💅 DFreitas Nails</h1>
                    <p className="text-gray-400 mt-2">Sistema de Agendamento</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 text-sm mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={ e => setEmail(e.target.value) }
                            className="w-full bg-[#1a1a1a] text-white border border-[#C9956C33] rounded-lg px-4 py-3 focus:outline-none focus:border-[#C9956C] transition"
                            placeholder="seu@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm mb-1">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={ e => setPassword(e.target.value) }
                            className="w-full bg-[#1a1a1a] text-white border border-[#C9956C33] rounded-lg px-4 py-3 focus:outline-none focus:border-[#C9956C] transition"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#C9956C] hover:bg-[#B76E79] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    )
}