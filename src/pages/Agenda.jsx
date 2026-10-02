import { useState, useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import Layout from '../components/Layout'
import api from '../services/api'

const statusLabels = {
    0: 'Agendado',
    1: 'Confirmado',
    2: 'Cancelado',
    3: 'Concluído'
}

const statusColors = {
    0: 'bg-yellow-700 text-yellow-200',
    1: 'bg-green-700 text-green-200',
    2: 'bg-red-700 text-red-200',
    3: 'bg-gray-600 text-gray-200'
}

export default function Agenda() {
    const [appointments, setAppointments] = useState([])
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [dayAppointments, setDayAppointments] = useState([])
    const [clients, setClients]     = useState([])
    const [services, setServices]   = useState([])
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading]     = useState(true)
    const calendarRef = useRef(null)

    const emptyForm = {
        clientId: '', serviceTypeId: '', startTime: '', discount: 0, addOns: []
    }
    const [form, setForm] = useState(emptyForm)

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        filterDayAppointments(selectedDate)
    }, [appointments, selectedDate])

    const loadData = async () => {
        try {
            setLoading(true)
            const [appRes, clientRes, serviceRes] = await Promise.all([
                api.get('/appointment'),
                api.get('/client'),
                api.get('/servicetype')
            ])
            setAppointments(appRes.data)
            setClients(clientRes.data)
            setServices(serviceRes.data)
        } catch {
            console.error('Erro ao carregar dados.')
        } finally {
            setLoading(false)
        }
    }

    const filterDayAppointments = (date) => {
        const dateStr = date.toISOString().split('T')[0]
        const filtered = appointments.filter(a => 
            a.startTime.startsWith(dateStr)
        )
        setDayAppointments(filtered.sort((a, b) => 
            new Date(a.startTime) - new Date(b.startTime)
        ))
    }

    const handleDateClick = (info) => {
        setSelectedDate(new Date(info.dateStr + 'T12:00:00'))
    }

    const calendarEvents = appointments
        .filter(a => a.status !== 2) // ignora cancelados
        .map(a => {
            const client = clients.find(c => c.name === a.clientName)
            return {
                id: a.id,
                title: a.clientName,
                start: a.startTime,
                end: a.endTime,
                backgroundColor: client?.color || '#C9956C',
                borderColor: client?.color || '#C9956C',
            }
        })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                ...form,
                clientId: parseInt(form.clientId),
                serviceTypeId: parseInt(form.serviceTypeId),
                startTime: form.startTime
            }
            await api.post('/appointment', payload)
            loadData()
            setShowModal(false)
            setForm(emptyForm)
        } catch (err) {
            alert(err.response?.data?.message || 'Erro ao criar agendamento.')
        }
    }

    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString('pt-BR', {
            hour: '2-digit', minute: '2-digit'
        })
    }

    const formatDate = (date) => {
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long', day: '2-digit', month: 'long'
        })
    }

    return (
        <Layout>
            <div className="space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-[#C9956C]">📅 Agenda</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-[#C9956C] hover:bg-[#B76E79] text-white px-4 py-2 rounded-lg transition"
                    >
                        + Novo Agendamento
                    </button>
                </div>

                {loading ? (
                    <p className="text-gray-400">Carregando...</p>
                ) : (
                    <>
                        {/* Calendar */}
                        <div className="bg-[#2a2a2a] rounded-xl p-4 calendar-dark">
                            <FullCalendar
                                ref={calendarRef}
                                plugins={[dayGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                locale={ptBrLocale}
                                events={calendarEvents}
                                dateClick={handleDateClick}
                                headerToolbar={{
                                    left: 'prev',
                                    center: 'title',
                                    right: 'next'
                                }}
                                height="auto"
                                eventDisplay="block"
                                dayMaxEvents={3}
                            />
                        </div>

                        {/* Day appointments */}
                        <div className="bg-[#2a2a2a] rounded-xl p-4">
                            <h2 className="text-lg font-semibold text-white mb-4 capitalize">
                                {formatDate(selectedDate)}
                            </h2>

                            {dayAppointments.length === 0 ? (
                                <p className="text-gray-400">Nenhum agendamento neste dia.</p>
                            ) : (
                                <div className="space-y-3">
                                    {dayAppointments.map(a => {
                                        const client = clients.find(c => c.name === a.clientName)
                                        return (
                                            <div key={a.id} className="flex items-center gap-3 py-2 border-b border-gray-700">
                                                <div
                                                    className="w-1 h-14 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: client?.color || '#C9956C' }}
                                                />
                                                <div className="w-16 text-gray-400 text-sm">
                                                    {formatTime(a.startTime)}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-white font-semibold">{a.clientName}</p>
                                                    <p className="text-gray-400 text-sm">{a.serviceTypeName}</p>
                                                    <p className="text-gray-400 text-xs">
                                                        {formatTime(a.startTime)} – {formatTime(a.endTime)}
                                                    </p>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[a.status]}`}>
                                                    {statusLabels[a.status]}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Modal Novo Agendamento */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#2a2a2a] rounded-2xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-[#C9956C] mb-4">Novo Agendamento</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-300 text-sm mb-1">Cliente</label>
                                <select
                                    value={form.clientId}
                                    onChange={e => setForm({...form, clientId: e.target.value})}
                                    className="w-full bg-[#1a1a1a] text-white border border-[#C9956C33] rounded-lg px-4 py-2 focus:outline-none focus:border-[#C9956C]"
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm mb-1">Serviço</label>
                                <select
                                    value={form.serviceTypeId}
                                    onChange={e => setForm({...form, serviceTypeId: e.target.value})}
                                    className="w-full bg-[#1a1a1a] text-white border border-[#C9956C33] rounded-lg px-4 py-2 focus:outline-none focus:border-[#C9956C]"
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    {services.filter(s => s.isActive).map(s => (
                                        <option key={s.id} value={s.id}>{s.name} — {s.durationMinutes}min</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm mb-1">Data e hora</label>
                                <input
                                    type="datetime-local"
                                    value={form.startTime}
                                    onChange={e => setForm({...form, startTime: e.target.value})}
                                    className="w-full bg-[#1a1a1a] text-white border border-[#C9956C33] rounded-lg px-4 py-2 focus:outline-none focus:border-[#C9956C]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm mb-1">Desconto (R$)</label>
                                <input
                                    type="number"
                                    value={form.discount}
                                    onChange={e => setForm({...form, discount: parseFloat(e.target.value)})}
                                    className="w-full bg-[#1a1a1a] text-white border border-[#C9956C33] rounded-lg px-4 py-2 focus:outline-none focus:border-[#C9956C]"
                                    min="0" step="0.01"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setForm(emptyForm) }}
                                    className="flex-1 border border-gray-600 text-gray-400 py-2 rounded-lg hover:bg-gray-700 transition"
                                >Cancelar</button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#C9956C] hover:bg-[#B76E79] text-white py-2 rounded-lg transition"
                                >Agendar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    )
}