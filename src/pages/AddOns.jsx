import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ConfirmModal from '../components/ConfirmModal'
import api from '../services/api'

export default function AddOns() {
    const [addOns, setAddOns]           = useState([])
    const [loading, setLoading]         = useState(true)
    const [error, setError]             = useState('')
    const [showModal, setShowModal]     = useState(false)
    const [editingAddOn, setEditingAddOn]     = useState(null)
    const [confirmDelete, setConfirmDelete]   = useState(null)

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
        if (addOn) { setForm(addOn); setEditingAddOn(addOn) }
        else { setForm(emptyForm); setEditingAddOn(null) }
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
            if (editingAddOn) await api.put(`/serviceaddon/${editingAddOn.id}`, form)
            else await api.post('/serviceaddon', form)
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
                    <div>
                        <h1 className="font-semibold" style={{ fontSize: '24px', color: '#e1e1ef', letterSpacing: '-0.01em' }}>
                            Adicionais
                        </h1>
                        <p style={{ fontSize: '13px', color: '#8a90a4' }}>
                            {addOns.length} adicional{addOns.length !== 1 ? 'is' : ''} cadastrado{addOns.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all"
                        style={{
                            background: 'linear-gradient(135deg, #e07a93, #b85d77)',
                            color: 'white', fontSize: '13px',
                            boxShadow: '0 4px 14px rgba(224,122,147,0.35)'
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                        Novo Adicional
                    </button>
                </div>

                {error && <p className="mb-4" style={{ color: '#ffb4ab', fontSize: '13px' }}>{error}</p>}

                {loading ? (
                    <p style={{ color: '#8a90a4' }}>Carregando...</p>
                ) : addOns.length === 0 ? (
                    <div className="text-center py-16">
                        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#32343e' }}>auto_awesome</span>
                        <p className="mt-2" style={{ color: '#8a90a4' }}>Nenhum adicional cadastrado.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {addOns.map(addOn => (
                            <div key={addOn.id}
                                className="flex items-center gap-4 p-4 rounded-2xl transition-all"
                                style={{
                                    background: 'rgba(29,31,40,0.9)',
                                    border: '1px solid rgba(45,50,67,0.5)'
                                }}>

                                {/* Icon */}
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'rgba(157,127,227,0.12)' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#d1bcff' }}>auto_awesome</span>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-semibold" style={{ fontSize: '14px', color: '#e1e1ef' }}>
                                            {addOn.name}
                                        </p>
                                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                                            style={addOn.isActive
                                                ? { background: 'rgba(78,205,196,0.12)', color: '#5dd9d0' }
                                                : { background: 'rgba(50,52,62,0.8)', color: '#8a90a4' }}>
                                            {addOn.isActive ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                    <p className="truncate" style={{ fontSize: '12px', color: '#8a90a4' }}>{addOn.description}</p>
                                    <div className="flex gap-3 mt-1 flex-wrap">
                                        <span style={{ fontSize: '12px', color: '#d1bcff' }}>💅 R$ {addOn.pricePerUnit.toFixed(2)}/unha</span>
                                        <span style={{ fontSize: '12px', color: '#d1bcff' }}>💅 R$ {addOn.priceAll.toFixed(2)}/todas</span>
                                        <span style={{ fontSize: '12px', color: '#8a90a4' }}>⏱ {addOn.durationMinutes}min</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-1">
                                    <button onClick={() => openModal(addOn)}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                                        style={{ color: '#8a90a4' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(224,122,147,0.1)'; e.currentTarget.style.color = '#ffb1c2' }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8a90a4' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                                    </button>
                                    <button onClick={() => setConfirmDelete(addOn.id)}
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
                            {editingAddOn ? 'Editar Adicional' : 'Novo Adicional'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div>
                                <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: '600', color: '#d9c0c4' }}>Nome</label>
                                <input type="text" value={form.name}
                                    onChange={e => setForm({...form, name: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                                    style={{ background: '#0c0e16', color: '#e1e1ef', fontSize: '14px', border: '1px solid rgba(45,50,67,0.8)' }}
                                    onFocus={e => e.target.style.borderColor = '#e07a93'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(45,50,67,0.8)'}
                                    required />
                            </div>

                            <div>
                                <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: '600', color: '#d9c0c4' }}>Descrição</label>
                                <textarea value={form.description}
                                    onChange={e => setForm({...form, description: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl outline-none transition-all resize-none"
                                    style={{ background: '#0c0e16', color: '#e1e1ef', fontSize: '14px', border: '1px solid rgba(45,50,67,0.8)' }}
                                    onFocus={e => e.target.style.borderColor = '#e07a93'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(45,50,67,0.8)'}
                                    rows={2} />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: '600', color: '#d9c0c4' }}>Preço por unha (R$)</label>
                                    <input type="number" value={form.pricePerUnit}
                                        onChange={e => setForm({...form, pricePerUnit: parseFloat(e.target.value)})}
                                        className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                                        style={{ background: '#0c0e16', color: '#e1e1ef', fontSize: '14px', border: '1px solid rgba(45,50,67,0.8)' }}
                                        onFocus={e => e.target.style.borderColor = '#e07a93'}
                                        onBlur={e => e.target.style.borderColor = 'rgba(45,50,67,0.8)'}
                                        min="0" step="0.01" required />
                                </div>
                                <div>
                                    <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: '600', color: '#d9c0c4' }}>Preço todas (R$)</label>
                                    <input type="number" value={form.priceAll}
                                        onChange={e => setForm({...form, priceAll: parseFloat(e.target.value)})}
                                        className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                                        style={{ background: '#0c0e16', color: '#e1e1ef', fontSize: '14px', border: '1px solid rgba(45,50,67,0.8)' }}
                                        onFocus={e => e.target.style.borderColor = '#e07a93'}
                                        onBlur={e => e.target.style.borderColor = 'rgba(45,50,67,0.8)'}
                                        min="0" step="0.01" required />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: '600', color: '#d9c0c4' }}>Duração</label>
                                <select value={form.durationMinutes}
                                    onChange={e => setForm({...form, durationMinutes: parseInt(e.target.value)})}
                                    className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                                    style={{ background: '#0c0e16', color: '#e1e1ef', fontSize: '14px', border: '1px solid rgba(45,50,67,0.8)' }}>
                                    {[30,60,90,120].map(min => (
                                        <option key={min} value={min}>{min}min</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2 cursor-pointer"
                                onClick={() => setForm({...form, isActive: !form.isActive})}>
                                <div className="w-4 h-4 rounded flex items-center justify-center transition-all"
                                    style={{ background: form.isActive ? '#ffb1c2' : '#0c0e16', border: '1px solid rgba(45,50,67,0.8)' }}>
                                    {form.isActive && <span style={{ color: '#5e122c', fontSize: '10px', fontWeight: 'bold' }}>✓</span>}
                                </div>
                                <label className="cursor-pointer" style={{ fontSize: '13px', color: '#d9c0c4' }}>Adicional ativo</label>
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
                                        color: 'white', fontSize: '13px',
                                        boxShadow: '0 4px 14px rgba(224,122,147,0.35)'
                                    }}>
                                    {editingAddOn ? 'Salvar' : 'Cadastrar'}
                                </button>
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