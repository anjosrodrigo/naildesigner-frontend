import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

export default function Login() {
    const [email, setEmail]       = useState('')
    const [password, setPassword] = useState('')
    const [error, setError]       = useState('')
    const [loading, setLoading]   = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [remember, setRemember] = useState(false)

    const { login } = useAuth()
    const navigate  = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const response = await api.post('/auth/login', { email, password })
            const { token, name, email: userEmail } = response.data
            login(token, { name, email: userEmail })
            navigate('/')
        } catch {
            setError('E-mail ou senha inválidos.')
        } finally {
            setLoading(false)
        }
    }
	
	const savedUserName = localStorage.getItem('lastUser')?.split(' ')[0]

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#11131c' }}>
            <main className="w-full max-w-sm mx-auto p-space-lg">
                <div className="flex flex-col w-full relative items-center justify-center py-4">

                    {/* Ambient Glow */}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none -z-10"
                        style={{ background: 'rgba(224,122,147,0.20)', filter: 'blur(100px)' }} />
                    <div className="absolute -bottom-10 right-1/4 w-64 h-64 rounded-full pointer-events-none -z-10"
                        style={{ background: 'rgba(81,51,147,0.25)', filter: 'blur(90px)' }} />

                    {/* Card */}
                    <div className="w-full rounded-3xl p-6 flex flex-col relative overflow-hidden"
                        style={{
                            background: 'rgba(29,31,40,0.90)',
                            backdropFilter: 'blur(24px)',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)'
                        }}>

                        {/* Top highlight line */}
                        <div className="absolute inset-x-0 top-0 h-px"
                            style={{ background: 'linear-gradient(to right, transparent, rgba(255,177,194,0.4), transparent)' }} />

                        {/* Logo */}
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-3 flex items-center justify-center">
                                <div className="absolute inset-0 rounded-2xl"
                                    style={{ background: 'rgba(224,122,147,0.25)', filter: 'blur(12px)' }} />
                                <img
                                    src="/logo.png"
                                    alt="DFreitas Nails"
                                    className="relative w-20 h-20 object-contain rounded-2xl"
                                    style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                                />
                            </div>
                            <span className="uppercase tracking-widest px-3 py-1 rounded-full mb-2 inline-flex items-center gap-1.5"
                                style={{
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    letterSpacing: '0.04em',
                                    color: '#ffb1c2',
                                    background: 'rgba(95,19,45,0.5)'
                                }}>
                                <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                                    style={{ background: '#ffb1c2' }} />
                                Painel Administrativo
                            </span>
                            <p style={{ fontSize: '12px', color: '#d9c0c4' }}>
                                Sistema de Gestão & Agendamentos Exclusivos
                            </p>
                        </div>

                        {/* Welcome */}
						<div className="mt-6 mb-5 rounded-2xl p-3.5 flex items-center gap-3"
							style={{ background: 'rgba(40,41,51,0.80)' }}>
							<div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
								style={{ background: '#32343e' }}>
								<span className="material-symbols-outlined"
									style={{ fontSize: '20px', color: '#ffb1c2' }}>spa</span>
							</div>
							<div className="flex flex-col text-left">
								<span style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.04em', color: '#d9c0c4' }}>
									Sessão Segura
								</span>
								<span style={{ fontSize: '16px', fontWeight: '600', color: '#e1e1ef' }}>
									{savedUserName ? `Bem-vinda de volta, ${savedUserName}` : 'Bem-vinda!'}
								</span>
							</div>
						</div>

                        {/* Form */}
                        <form className="flex flex-col gap-4" onSubmit={handleLogin}>

                            {/* Email */}
                            <div className="flex flex-col gap-1.5 text-left">
                                <label className="flex items-center justify-between"
                                    style={{ fontSize: '13px', fontWeight: '600', letterSpacing: '0.02em', color: '#d9c0c4' }}>
                                    <span>E-mail Profissional</span>
                                    <span style={{ fontSize: '11px', color: '#5dd9d0' }}>Verificado</span>
                                </label>
                                <div className="relative flex items-center">
                                    <span className="material-symbols-outlined absolute left-3.5 pointer-events-none"
										style={{ color: '#a18b8f', fontSize: '18px' }}>alternate_email</span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="contato@dfreitasnails.com.br"
                                        className="w-full pl-9 pr-4 py-3 rounded-xl outline-none transition-all"
                                        style={{
                                            background: '#0c0e16',
                                            color: '#e1e1ef',
                                            fontSize: '14px',
                                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                                        }}
                                        onFocus={e => e.target.style.boxShadow = '0 0 16px rgba(224,122,147,0.22), inset 0 2px 4px rgba(0,0,0,0.3)'}
                                        onBlur={e => e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.3)'}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1.5 text-left">
                                <div className="flex items-center justify-between">
                                    <label style={{ fontSize: '13px', fontWeight: '600', letterSpacing: '0.02em', color: '#d9c0c4' }}>
                                        Senha de Acesso
                                    </label>
                                    <span className="cursor-pointer"
                                        style={{ fontSize: '11px', color: '#ffb1c2' }}>
                                        Esqueceu sua senha?
                                    </span>
                                </div>
                                <div className="relative flex items-center">
                                    <span className="material-symbols-outlined absolute left-3.5 pointer-events-none"
										style={{ color: '#a18b8f', fontSize: '18px' }}>lock</span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full pl-9 pr-12 py-3 rounded-xl outline-none transition-all"
                                        style={{
                                            background: '#0c0e16',
                                            color: '#e1e1ef',
                                            fontSize: '14px',
                                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                                        }}
                                        onFocus={e => e.target.style.boxShadow = '0 0 16px rgba(224,122,147,0.22), inset 0 2px 4px rgba(0,0,0,0.3)'}
                                        onBlur={e => e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.3)'}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 p-1 rounded-lg transition-colors"
                                        style={{ color: '#a18b8f' }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
											{showPassword ? 'visibility_off' : 'visibility'}
										</span>
                                    </button>
                                </div>
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center gap-2.5 pt-1 cursor-pointer"
                                onClick={() => setRemember(!remember)}>
                                <div className="w-5 h-5 rounded-md flex items-center justify-center transition-all"
                                    style={{
                                        background: remember ? '#ffb1c2' : '#0c0e16',
                                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                                    }}>
                                    {remember && <span style={{ color: '#5e122c', fontSize: '12px', fontWeight: 'bold' }}>✓</span>}
                                </div>
                                <span style={{ fontSize: '12px', color: '#d9c0c4' }}>
                                    Lembrar de mim neste dispositivo
                                </span>
                            </div>

                            {/* Error */}
                            {error && (
                                <p className="text-center" style={{ fontSize: '13px', color: '#ffb4ab' }}>{error}</p>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 py-3.5 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                style={{
                                    background: 'linear-gradient(to right, #e07a93, #ffb1c2, #e07a93)',
                                    color: '#5f132d',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    boxShadow: '0 8px 24px rgba(224,122,147,0.32)'
                                }}
                            >
                                <span>{loading ? 'Entrando...' : 'Entrar no Sistema'}</span>
                                {!loading && <span>→</span>}
                            </button>
                        </form>

                        {/* Security */}
                        <div className="mt-6 flex items-center justify-center gap-1.5"
                            style={{ color: '#a18b8f' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#5dd9d0' }}>
								lock
							</span>
                            <span style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.04em' }}>
                                Criptografia SSL de Ponta a Ponta
                            </span>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-6 text-center">
                        <p style={{ fontSize: '12px', color: '#a18b8f' }}>
                            © 2025 DFreitas Nails Studio • Todos os direitos reservados
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}