import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ConfirmModal from '../components/ConfirmModal'
import api from '../services/api'

export default function AddOns() {
    const [addOns, setAddOns]       = useState([])
    const [loading, setLoading]     = useState(true)
    const [error, setError]         = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingAddOn, setEditingAddOn]   = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null)

    const emptyForm = {
        name: '', description: '', pricePerUnit: '',
        priceAll: '', durationMinutes: 30, isActive: true
    }
    const [form, setForm] = useState(emptyForm)

    useEffect(() => { loadAddOns() }, [])

    const loadAddOns = async () => {
        try {
            setLoading(true)
            const response = await api.get('/serviceaddon')
            setAddOns(response.data)
        } catch {
            setError('Erro ao carregar adicionais.')
        } finally {
            setLoading(false)
        }
    }

    const openModal = (addOn = null) => {
        if (addOn) {
            setForm(addOn)
            setEditingAddOn(addOn)
        } else {
            setForm(emptyForm)
            setEditingAddOn(null)
        }
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingAddOn(null)
        setForm(emptyForm)
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingAddOn) {
                await api.put(`/serviceaddon/${editingAddOn.id}`, form)
            } else {
                await api.post('/serviceaddon', form)
            }
            loadAddOns()
            closeModal()
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao salvar adicional.')
        }
    }

    const handleDelete = async () => {
        try {
            await api.delete(`/serviceaddon/${confirmDelete}`)
            loadAddOns()
            setConfirmDelete(null)
        } catch {
            setError('Erro ao excluir adicional.')
            setConfirmDelete(null)
        }
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-[#C9956C]">✨ Adicionais</h1>
                    <button
                        onClick={() => openModal()}
                        className="bg-[#C9956C] hover:bg-[#B76E79] text-white px-4 py-2 rounded-lg transition"
                    >
                        + Novo Adicional
                    </button>
                </div>

                {error && <p className="text-red-400 mb-4">{error}</p>}

                {loading ? (
                    <p className="text-gray-400">Carregando...</p>
                ) : addOns.length === 0 ? (
                    <p className="text-gray-400">Nenhum adicional cadastrado.</p>
                ) : (
                    <div className="space-y-3">
                        {addOns.map(addOn => (
                            <div key={addOn.id} className="bg-[#2a2a2a] rounded-xl p-4 flex items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-white font-semibold">{addOn.name}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${addOn.isActive ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                                            {addOn.isActive ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm">{addOn.description}</p>
                                    <div className="flex gap-4 mt-1">
                                        <p className="text-[#C9956C] text-sm">💅 R$ {addOn.pricePerUnit.toFixed(2)}/unha</p>
                                        <p className="text-[#C9956C] text-sm">💅 R$ {addOn.priceAll.toFixed(2)}/todas</p>
                                        <p className="text-gray-400 text-sm">⏱️ {addOn.durationMinutes} min</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(addOn)}
                                        className="text-[#C9956C] hover:text-white transition px-3 py-1 rounded-lg hover:bg-[#C9956C22]"
                                    >✏️</button>
                                    <button
                                        onClick={() => setConfirmDelete(addOn.id)}
                                        className="text-red-400 hover:text-white transition px-3 py-1 rounded-lg hover:bg-red-900"
                                    >🗑️</button>
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
                            {editingAddOn ? 'Editar Adicional' : 'Novo Adicional'}
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
                                <label className="block text-gray-300 text-sm mb-1">Descrição</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm({...form, description: e.target.value})}
                                    className="w-full bg-[#1a1a1a] text-white border border-[#C9956C33] rounded-lg px-4 py-2 focus:outline-none focus:border-[#C9956C]"
                                    rows={2}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-gray-300 text-sm mb-1">Preço por unha (R$)</label>
                                    <input
                                        type="number"
                                        value={form.pricePerUnit}
                                        onChange={e => setForm({...form, pricePerUnit: parseFloat(e.target.value)})}
                                        className="w-full bg-[#1a1a1a] text-white border border-[#C9956C33] rounded-lg px-4 py-2 focus:outline-none focus:border-[#C9956C]"
                                        min="0" step="0.01" required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm mb-1">Preço todas (R$)</label>
                                    <input
                                        type="number"
                                        value={form.priceAll}
                                        onChange={e => setForm({...form, priceAll: parseFloat(e.target.value)})}
                                        className="w-full bg-[#1a1a1a] text-white border border-[#C9956C33] rounded-lg px-4 py-2 focus:outline-none focus:border-[#C9956C]"
                                        min="0" step="0.01" required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm mb-1">Duração (minutos)</label>
                                <select
                                    value={form.durationMinutes}
                                    onChange={e => setForm({...form, durationMinutes: parseInt(e.target.value)})}
                                    className="w-full bg-[#1a1a1a] text-white border border-[#C9956C33] rounded-lg px-4 py-2 focus:outline-none focus:border-[#C9956C]"
                                >
                                    {[30,60,90,120].map(min => (
                                        <option key={min} value={min}>{min} min</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={form.isActive}
                                    onChange={e => setForm({...form, isActive: e.target.checked})}
                                    className="accent-[#C9956C]"
                                />
                                <label htmlFor="isActive" className="text-gray-300 text-sm">Adicional ativo</label>
                            </div>

                            {error && <p className="text-red-400 text-sm">{error}</p>}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 border border-gray-600 text-gray-400 py-2 rounded-lg hover:bg-gray-700 transition"
                                >Cancelar</button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#C9956C] hover:bg-[#B76E79] text-white py-2 rounded-lg transition"
                                >{editingAddOn ? 'Salvar' : 'Cadastrar'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {confirmDelete && (
                <ConfirmModal
                    message="Deseja excluir este adicional? Esta ação não pode ser desfeita."
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </Layout>
    )
}