import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'

const statusLabels = { 0: 'Agendado', 1: 'Confirmado', 2: 'Cancelado', 3: 'Concluído' }
const statusStyles = {
    0: { background: 'rgba(245,176,65,0.12)', color: '#f5b041' },
    1: { background: 'rgba(78,205,196,0.12)', color: '#4ecdc4' },
    2: { background: 'rgba(255,100,100,0.12)', color: '#ffb4ab' },
    3: { background: 'rgba(138,144,164,0.12)', color: '#8a90a4' }
}

export default function Revenue() {
    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState('')
    const [data, setData]       = useState(null)

    const getFirstDayOfMonth = () => {
        const d = new Date()
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
    }
    const getToday = () => {
        const d = new Date()
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    }

    const [startDate, setStartDate] = useState(getFirstDayOfMonth())
    const [endDate, setEndDate]     = useState(getToday())

    useEffect(() => { loadRevenue() }, [])

    const loadRevenue = async () => {
        try {
            setLoading(true)
            setError('')
            const response = await api.get(`/appointment/revenue?startDate=${startDate}&endDate=${endDate}`)
            setData(response.data)
        } catch {
            setError('Erro ao carregar faturamento.')
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    const formatDate = (dateStr) => new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })

    const metricCards = data ? [
        {
            label: 'Faturamento',
            value: formatCurrency(data.totalRevenue),
            icon: 'payments',
            color: '#ffb1c2',
            bg: 'rgba(224,122,147,0.12)'
        },
        {
            label: 'Total Agendamentos',
            value: data.totalAppointments,
            icon: 'event',
            color: '#d1bcff',
            bg: 'rgba(157,127,227,0.12)'
        },
        {
            label: 'Concluídos',
            value: data.totalCompleted,
            icon: 'check_circle',
            color: '#4ecdc4',
            bg: 'rgba(78,205,196,0.12)'
        },
        {
            label: 'Cancelados',
            value: data.totalCancelled,
            icon: 'cancel',
            color: '#ffb4ab',
            bg: 'rgba(255,100,100,0.12)'
        }
    ] : []

    return (
        <Layout>
            <div className="max-w-5xl mx-auto space-y-4">

                {/* Header */}
                <div>
                    <h1 className="font-semibold" style={{ fontSize: '24px', color: '#e1e1ef', letterSpacing: '-0.01em' }}>
                        Faturamento
                    </h1>
                    <p style={{ fontSize: '13px', color: '#8a90a4' }}>
                        Relatório financeiro por período
                    </p>
                </div>

                {/* Filters */}
                <div className="rounded-2xl p-4 flex flex-col sm:flex-row items-end gap-3"
                    style={{ background: 'rgba(29,31,40,0.9)', border: '1px solid rgba(45,50,67,0.5)' }}>
                    <div className="flex-1 w-full">
                        <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: '600', color: '#d9c0c4' }}>Data inicial</label>
                        <input type="date" value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                            style={{ background: '#0c0e16', color: '#e1e1ef', fontSize: '14px', border: '1px solid rgba(45,50,67,0.8)' }} />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: '600', color: '#d9c0c4' }}>Data final</label>
                        <input type="date" value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                            style={{ background: '#0c0e16', color: '#e1e1ef', fontSize: '14px', border: '1px solid rgba(45,50,67,0.8)' }} />
                    </div>
                    <button
                        onClick={loadRevenue}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all w-full sm:w-auto justify-center"
                        style={{
                            background: 'linear-gradient(135deg, #e07a93, #b85d77)',
                            color: 'white', fontSize: '13px',
                            boxShadow: '0 4px 14px rgba(224,122,147,0.35)'
                        }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>search</span>
                        Filtrar
                    </button>
                </div>

                {error && <p style={{ color: '#ffb4ab', fontSize: '13px' }}>{error}</p>}

                {loading ? (
                    <p style={{ color: '#8a90a4' }}>Carregando...</p>
                ) : data && (
                    <>
                        {/* Metric Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {metricCards.map(card => (
                                <div key={card.label}
                                    className="rounded-xl p-4 flex items-center justify-between"
                                    style={{ background: 'rgba(29,31,40,0.9)', border: '1px solid rgba(45,50,67,0.5)' }}>
                                    <div>
                                        <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.02em', color: '#8a90a4' }}>
                                            {card.label}
                                        </p>
                                        <p className="font-bold mt-1" style={{ fontSize: '20px', color: '#e1e1ef' }}>
                                            {card.value}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: card.bg }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: card.color }}>
                                            {card.icon}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Appointments list */}
                        <div className="rounded-2xl p-4"
                            style={{ background: 'rgba(29,31,40,0.9)', border: '1px solid rgba(45,50,67,0.5)' }}>
                            <h2 className="font-semibold mb-4" style={{ fontSize: '15px', color: '#e1e1ef' }}>
                                Agendamentos do Período
                            </h2>

                            {data.appointments.length === 0 ? (
                                <div className="text-center py-8">
                                    <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#32343e' }}>receipt_long</span>
                                    <p className="mt-2" style={{ fontSize: '13px', color: '#8a90a4' }}>Nenhum agendamento no período.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {data.appointments.map(a => (
                                        <div key={a.id}
                                            className="flex items-center gap-3 p-3 rounded-xl"
                                            style={{ background: 'rgba(40,41,51,0.6)' }}>

                                            <div className="flex flex-col items-center justify-center min-w-[56px]">
                                                <span style={{ fontSize: '11px', fontWeight: '600', color: '#ffb1c2' }}>
                                                    {formatDate(a.startTime.split('T')[0])}
                                                </span>
                                                <span style={{ fontSize: '10px', color: '#8a90a4' }}>
                                                    {formatTime(a.startTime)}
                                                </span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold truncate" style={{ fontSize: '13px', color: '#e1e1ef' }}>
                                                    {a.clientName}
                                                </p>
                                                <p className="truncate" style={{ fontSize: '11px', color: '#8a90a4' }}>
                                                    {a.serviceTypeName}
                                                </p>
                                            </div>

                                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
                                                style={statusStyles[a.status]}>
                                                {statusLabels[a.status]}
                                            </span>

                                            <span className="font-semibold flex-shrink-0" style={{ fontSize: '13px', color: '#e1e1ef', minWidth: '70px', textAlign: 'right' }}>
                                                {formatCurrency(a.totalPrice)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    )
}