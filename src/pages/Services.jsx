import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ConfirmModal from '../components/ConfirmModal'
import api from '../services/api'

const pricingTypeLabels = {
    0: 'Mão Inteira',
    1: 'Por Unha',
    2: 'Ambos'
}

export default function Services() {
    const [services, setServices]   = useState([])
    const [loading, setLoading]     = useState(true)
    const [error, setError]         = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingService, setEditingService] = useState(null)
	const [confirmDelete, setConfirmDelete] = useState(null)

    const emptyForm = {
        name: '', description: '', pricingType: 0,
        price: '', pricePerUnit: '', durationMinutes: 30, isActive: true
    }
    const [form, setForm] = useState(emptyForm)

    useEffect(() => { loadServices() }, [])

    const loadServices = async () => {
        try {
            setLoading(true)
            const response = await api.get('/servicetype')
            setServices(response.data)
        } catch {
            setError('Erro ao carregar serviços.')
        } finally {
            setLoading(false)
        }
    }

    const openModal = (service = null) => {
        if (service) {
            setForm(service)
            setEditingService(service)
        } else {
            setForm(emptyForm)
            setEditingService(null)
        }
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingService(null)
        setForm(emptyForm)
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingService) {
                await api.put(`/servicetype/${editingService.id}`, form)
            } else {
                await api.post('/servicetype', form)
            }
            loadServices()
            closeModal()
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao salvar serviço.')
        }
    }

    const handleDelete = async () => {
		try {
			await api.delete(`/servicetype/${confirmDelete}`)
			loadServices()
			setConfirmDelete(null)
		} catch {
			setError('Erro ao excluir serviço.')
			setConfirmDelete(null)
		}
	}

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-[#C9956C]">💅 Serviços</h1>
                    <button
                        onClick={() => openModal()}
                        className="bg-[#C9956C] hover:bg-[#B76E79] text-white px-4 py-2 rounded-lg transition"
                    >
                        + Novo Serviço
                    </button>
                </div>

                {error && <p className="text-red-400 mb-4">{error}</p>}

                {loading ? (
                    <p className="text-gray-400">Carregando...</p>
                ) : services.length === 0 ? (
                    <p className="text-gray-400">Nenhum serviço cadastrado.</p>
                ) : (
                    <div className="space-y-3">
                        {services.map(service => (
                            <div key={service.id} className="bg-[#2a2a2a] rounded-xl p-4 flex items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-white font-semibold">{service.name}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${service.isActive ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                                            {service.isActive ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm">{service.description}</p>
                                    <div className="flex gap-4 mt-1">
                                        <p className="text-[#C9956C] text-sm">💰 R$ {service.price.toFixed(2)}</p>
                                        <p className="text-gray-400 text-sm">⏱️ {service.durationMinutes} min</p>
                                        <p className="text-gray-400 text-sm">📋 {pricingTypeLabels[service.pricingType]}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(service)}
                                        className="text-[#C9956C] hover:text-white transition px-3 py-1 rounded-lg hover:bg-[#C9956C22]"
                                    >✏️</button>
                                    <button
                                        onClick={() => setConfirmDelete(service.id)}
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
                    <div className="bg-[#2a2a2a] rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-[#C9956C] mb-4">
                            {editingService ? 'Editar Serviço' : 'Novo Serviço'}
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

                            <div>
                                <label className="block text-gray-300 text-sm mb-1">Tipo de cobrança</label>
                                <select
                                    value={form.pricingType}
                                    onChange={e => setForm({...form, pricingType: parseInt(e.target.value)})}
                                    className="w-full bg-[#1a1a1a] text-white border border-[#C9956C33] rounded-lg px-4 py-2 focus:outline-none focus:border-[#C9956C]"
                                >
                                    <option value={0}>Mão Inteira</option>
                                    <option value={1}>Por Unha</option>
                                    <option value={2}>Ambos</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-gray-300 text-sm mb-1">Preço (R$)</label>
                                    <input
                                        type="number"
                                        value={form.price}
                                        onChange={e => setForm({...form, price: parseFloat(e.target.value)})}
                                        className="w-full bg-[#1a1a1a] text-white border border-[#C9956C33] rounded-lg px-4 py-2 focus:outline-none focus:border-[#C9956C]"
                                        min="0" step="0.01" required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm mb-1">Preço por unha (R$)</label>
                                    <input
                                        type="number"
                                        value={form.pricePerUnit || ''}
                                        onChange={e => setForm({...form, pricePerUnit: parseFloat(e.target.value)})}
                                        className="w-full bg-[#1a1a1a] text-white border border-[#C9956C33] rounded-lg px-4 py-2 focus:outline-none focus:border-[#C9956C]"
                                        min="0" step="0.01"
                                        disabled={form.pricingType === 0}
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
                                    {[30,60,90,120,150,180,210,240].map(min => (
                                        <option key={min} value={min}>{min} min ({min/60 < 1 ? '30min' : `${Math.floor(min/60)}h${min%60 > 0 ? `${min%60}min` : ''}`})</option>
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
                                <label htmlFor="isActive" className="text-gray-300 text-sm">Serviço ativo</label>
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
                                >{editingService ? 'Salvar' : 'Cadastrar'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
			{confirmDelete && (
				<ConfirmModal
					message="Deseja excluir este serviço? Esta ação não pode ser desfeita."
					onConfirm={handleDelete}
					onCancel={() => setConfirmDelete(null)}
				/>
			)}
        </Layout>
    )
}