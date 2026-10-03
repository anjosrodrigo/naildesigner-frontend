import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ConfirmModal from '../components/ConfirmModal'
import api from '../services/api'

export default function Clients() {
    const [clients, setClients]         = useState([])
    const [loading, setLoading]         = useState(true)
    const [error, setError]             = useState('')
    const [showModal, setShowModal]     = useState(false)
    const [editingClient, setEditingClient]   = useState(null)
    const [confirmDelete, setConfirmDelete]   = useState(null)

    const emptyForm = { name: '', phone: '', birthDay: '', birthMonth: '', color: '#e07a93' }
    const [form, setForm] = useState(emptyForm)

    useEffect(() => { loadClients() }, [])

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
        if (client) { setForm(client); setEditingClient(client) }
        else { setForm(emptyForm); setEditingClient(null) }
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingClient(null)
        setForm(emptyForm)
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingClient) await api.put(`/client/${editingClient.id}`, form)
            else await api.post('/client', form)
            loadClients()
            closeModal()
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao salvar cliente.')
        }
    }

    const handleDelete = async () => {
        try {
            await api.delete(`/client/${confirmDelete}`)
            loadClients()
            setConfirmDelete(null)
        } catch {
            setError('Erro ao excluir cliente.')
            setConfirmDelete(null)
        }
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="font-semibold" style={{ fontSize: '24px', color: '#e1e1ef', letterSpacing: '-0.01em' }}>
                            Clientes
                        </h1>
                        <p style={{ fontSize: '13px', color: '#8a90a4' }}>
                            {clients.length} cliente{clients.length !== 1 ? 's' : ''} cadastrada{clients.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all"
                        style={{
                            background: 'linear-gradient(135deg, #e07a93, #b85d77)',
                            color: 'white',
                            fontSize: '13px',
                            boxShadow: '0 4px 14px rgba(224,122,147,0.35)'
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                        Nova Cliente
                    </button>
                </div>

                {error && <p className="mb-4" style={{ color: '#ffb4ab', fontSize: '13px' }}>{error}</p>}

                {loading ? (
                    <p style={{ color: '#8a90a4' }}>Carregando...</p>
                ) : clients.length === 0 ? (
                    <div className="text-center py-16">
                        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#32343e' }}>group</span>
                        <p className="mt-2" style={{ color: '#8a90a4' }}>Nenhuma cliente cadastrada.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {clients.map(client => (
                            <div key={client.id}
                                className="flex items-center gap-4 p-4 rounded-2xl transition-all"
                                style={{
                                    background: 'rgba(29,31,40,0.9)',
                                    border: '1px solid rgba(45,50,67,0.5)'
                                }}>

                                {/* Color bar */}
                                <div className="w-1 h-12 rounded-full flex-shrink-0"
                                    style={{ background: client.color }} />

                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-semibold"
                                    style={{
                                        background: `${client.color}22`,
                                        color: client.color,
                                        fontSize: '16px'
                                    }}>
                                    {client.name.charAt(0).toUpperCase()}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold truncate" style={{ fontSize: '14px', color: '#e1e1ef' }}>
                                        {client.name}
                                    </p>
                                    <p style={{ fontSize: '12px', color: '#8a90a4' }}>{client.phone}</p>
                                    <p className="flex items-center gap-1" style={{ fontSize: '12px', color: '#8a90a4' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>cake</span>
                                        {String(client.birthDay).padStart(2,'0')}/{String(client.birthMonth).padStart(2,'0')}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-1">
                                    <button onClick={() => openModal(client)}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                                        style={{ color: '#8a90a4' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(224,122,147,0.1)'; e.currentTarget.style.color = '#ffb1c2' }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8a90a4' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                                    </button>
                                    <button onClick={() => setConfirmDelete(client.id)}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                                        style={{ color: '#8a90a4' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,100,100,0.1)'; e.currentTarget.style.color = '#ffb4ab' }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8a90a4' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
                    <div className="w-full max-w-md rounded-3xl p-6"
                        style={{
                            background: 'rgba(29,31,40,0.98)',
                            border: '1px solid rgba(45,50,67,0.5)',
                            boxShadow: '0 24px 48px rgba(0,0,0,0.6)'
                        }}>

                        <h2 className="font-semibold mb-5" style={{ fontSize: '20px', color: '#e1e1ef' }}>
                            {editingClient ? 'Editar Cliente' : 'Nova Cliente'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div>
                                <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: '600', color: '#d9c0c4' }}>Nome</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({...form, name: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                                    style={{ background: '#0c0e16', color: '#e1e1ef', fontSize: '14px', border: '1px solid rgba(45,50,67,0.8)' }}
                                    onFocus={e => e.target.style.borderColor = '#e07a93'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(45,50,67,0.8)'}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: '600', color: '#d9c0c4' }}>Telefone</label>
                                <input
                                    type="text"
                                    value={form.phone}
                                    onChange={e => setForm({...form, phone: e.target.value})}
                                    placeholder="5541999990000"
                                    className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                                    style={{ background: '#0c0e16', color: '#e1e1ef', fontSize: '14px', border: '1px solid rgba(45,50,67,0.8)' }}
                                    onFocus={e => e.target.style.borderColor = '#e07a93'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(45,50,67,0.8)'}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: '600', color: '#d9c0c4' }}>Dia nasc.</label>
                                    <input
                                        type="number"
                                        value={form.birthDay}
                                        onChange={e => setForm({...form, birthDay: parseInt(e.target.value)})}
                                        className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                                        style={{ background: '#0c0e16', color: '#e1e1ef', fontSize: '14px', border: '1px solid rgba(45,50,67,0.8)' }}
                                        onFocus={e => e.target.style.borderColor = '#e07a93'}
                                        onBlur={e => e.target.style.borderColor = 'rgba(45,50,67,0.8)'}
                                        min="1" max="31" required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: '600', color: '#d9c0c4' }}>Mês nasc.</label>
                                    <input
                                        type="number"
                                        value={form.birthMonth}
                                        onChange={e => setForm({...form, birthMonth: parseInt(e.target.value)})}
                                        className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                                        style={{ background: '#0c0e16', color: '#e1e1ef', fontSize: '14px', border: '1px solid rgba(45,50,67,0.8)' }}
                                        onFocus={e => e.target.style.borderColor = '#e07a93'}
                                        onBlur={e => e.target.style.borderColor = 'rgba(45,50,67,0.8)'}
                                        min="1" max="12" required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: '600', color: '#d9c0c4' }}>Cor da cliente</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={form.color}
                                        onChange={e => setForm({...form, color: e.target.value})}
                                        className="w-10 h-10 rounded-lg cursor-pointer border-0"
                                        style={{ background: 'transparent' }}
                                    />
                                    <span style={{ fontSize: '13px', color: '#8a90a4' }}>{form.color}</span>
                                </div>
                            </div>

                            {error && <p style={{ fontSize: '12px', color: '#ffb4ab' }}>{error}</p>}

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={closeModal}
                                    className="flex-1 py-2.5 rounded-xl font-medium transition-all"
                                    style={{ border: '1px solid rgba(45,50,67,0.8)', color: '#8a90a4', fontSize: '13px' }}>
                                    Cancelar
                                </button>
                                <button type="submit"
                                    className="flex-1 py-2.5 rounded-xl font-semibold transition-all"
                                    style={{
                                        background: 'linear-gradient(135deg, #e07a93, #b85d77)',
                                        color: 'white',
                                        fontSize: '13px',
                                        boxShadow: '0 4px 14px rgba(224,122,147,0.35)'
                                    }}>
                                    {editingClient ? 'Salvar' : 'Cadastrar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {confirmDelete && (
                <ConfirmModal
                    message="Deseja excluir esta cliente? Esta ação não pode ser desfeita."
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </Layout>
    )
}