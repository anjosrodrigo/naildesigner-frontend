import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'

export default function Clients() {
    const [clients, setClients]   = useState([])
    const [loading, setLoading]   = useState(true)
    const [error, setError]       = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingClient, setEditingClient] = useState(null)

    const emptyForm = {
        name: '', phone: '', birthDay: '', birthMonth: '', color: '#C9956C'
    }
    const [form, setForm] = useState(emptyForm)

    useEffect(() => {
        loadClients()
    }, [])

    const loadClients = async () => {
        try {
            setLoading(true)
            const response = await api.get('/client')
            setClients(response.data)
        } catch {
            setError('Erro ao carregar clientes.')
        } finally {
            setLoading(false)
        }
    }

    const openModal = (client = null) => {
        if (client) {
            setForm(client)
            setEditingClient(client)
        } else {
            setForm(emptyForm)
            setEditingClient(null)
        }
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingClient(null)
        setForm(emptyForm)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingClient) {
                await api.put(`/client/${editingClient.id}`, form)
            } else {
                await api.post('/client', form)
            }
            loadClients()
            closeModal()
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao salvar cliente.')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Deseja excluir esta cliente?')) return
        try {
            await api.delete(`/client/${id}`)
            loadClients()
        } catch {
            setError('Erro ao excluir cliente.')
        }
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-[#C9956C]">👥 Clientes</h1>
                    <button
                        onClick={() => openModal()}
                        className="bg-[#C9956C] hover:bg-[#B76E79] text-white px-4 py-2 rounded-lg transition"
                    >
                        + Nova Cliente
                    </button>
                </div>

                {/* Error */}
                {error && <p className="text-red-400 mb-4">{error}</p>}

                {/* Loading */}
                {loading ? (
                    <p className="text-gray-400">Carregando...</p>
                ) : clients.length === 0 ? (
                    <p className="text-gray-400">Nenhuma cliente cadastrada.</p>
                ) : (
                    <div className="space-y-3">
                        {clients.map(client => (
                            <div
                                key={client.id}
                                className="bg-[#2a2a2a] rounded-xl p-4 flex items-center gap-4"
                            >
                                {/* Color indicator */}
                                <div
                                    className="w-3 h-12 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: client.color }}
                                />

                                {/* Info */}
                                <div className="flex-1">
                                    <p className="text-white font-semibold">{client.name}</p>
                                    <p className="text-gray-400 text-sm">{client.phone}</p>
                                    <p className="text-gray-400 text-sm">
                                        🎂 {String(client.birthDay).padStart(2,'0')}/{String(client.birthMonth).padStart(2,'0')}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(client)}
                                        className="text-[#C9956C] hover:text-white transition px-3 py-1 rounded-lg hover:bg-[#C9956C22]"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(client.id)}
                                        className="text-red-400 hover:text-white transition px-3 py-1 rounded-lg hover:bg-red-900"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#2a2a2a] rounded-2xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-[#C9956C] mb-4">
                            {editingClient ? 'Editar Cliente' : 'Nova Cliente'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 text-sm mb-1">Nome</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({...form, name: e.target.value})}
                                    className="w-full bg-[#1a1a1a] text-white border border-[#C9956C33] rounded-lg px-4 py-2 focus:outline-none focus:border-[#C9956C]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm mb-1">Telefone</label>
                                <input
                                    type="text"
                                    value={form.phone}
                                    onChange={e => setForm({...form, phone: e.target.value})}
                                    className="w-full bg-[#1a1a1a] text-white border border-[#C9956C33] rounded-lg px-4 py-2 focus:outline-none focus:border-[#C9956C]"
                                    placeholder="5541999990000"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-gray-300 text-sm mb-1">Dia nasc.</label>
                                    <input
                                        type="number"
                                        value={form.birthDay}
                                        onChange={e => setForm({...form, birthDay: parseInt(e.target.value)})}
                                        className="w-full bg-[#1a1a1a] text-white border border-[#C9956C33] rounded-lg px-4 py-2 focus:outline-none focus:border-[#C9956C]"
                                        min="1" max="31"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm mb-1">Mês nasc.</label>
                                    <input
                                        type="number"
                                        value={form.birthMonth}
                                        onChange={e => setForm({...form, birthMonth: parseInt(e.target.value)})}
                                        className="w-full bg-[#1a1a1a] text-white border border-[#C9956C33] rounded-lg px-4 py-2 focus:outline-none focus:border-[#C9956C]"
                                        min="1" max="12"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm mb-1">Cor da cliente</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={form.color}
                                        onChange={e => setForm({...form, color: e.target.value})}
                                        className="w-12 h-10 rounded cursor-pointer border-0 bg-transparent"
                                    />
                                    <span className="text-gray-400 text-sm">{form.color}</span>
                                </div>
                            </div>

                            {error && <p className="text-red-400 text-sm">{error}</p>}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 border border-gray-600 text-gray-400 py-2 rounded-lg hover:bg-gray-700 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#C9956C] hover:bg-[#B76E79] text-white py-2 rounded-lg transition"
                                >
                                    {editingClient ? 'Salvar' : 'Cadastrar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    )
}