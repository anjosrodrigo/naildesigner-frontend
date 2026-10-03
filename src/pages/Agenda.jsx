import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import ConfirmModal from '../components/ConfirmModal'

const statusLabels = { 0: 'Agendado', 1: 'Confirmado', 2: 'Cancelado', 3: 'Concluído' }
const statusStyles = {
    0: { background: 'rgba(245,176,65,0.12)', color: '#f5b041' },
    1: { background: 'rgba(78,205,196,0.12)', color: '#4ecdc4' },
    2: { background: 'rgba(255,100,100,0.12)', color: '#ffb4ab' },
    3: { background: 'rgba(138,144,164,0.12)', color: '#8a90a4' }
}

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

export default function Agenda() {
    const [appointments, setAppointments] = useState([])
    const [clients, setClients] = useState([])
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())
	const [workload, setWorkload] = useState([])
	const [blockedTimes, setBlockedTimes] = useState([])
    const [showBlockModal, setShowBlockModal] = useState(false)
    const emptyBlockForm = { startTime: '', endTime: '', reason: '' }
    const [blockForm, setBlockForm] = useState(emptyBlockForm)
    const [showDropdown, setShowDropdown] = useState(false)
    const [confirmDeleteBlock, setConfirmDeleteBlock] = useState(null)

    const emptyForm = { clientId: '', serviceTypeId: '', startTime: '', discount: 0, addOns: [] }
    const [form, setForm] = useState(emptyForm)

    useEffect(() => { loadData() }, [currentDate])

	const loadData = async () => {
		try {
			setLoading(true)
			const [appRes, clientRes, serviceRes, blockedRes, workloadRes] = await Promise.all([
				api.get('/appointment'),
				api.get('/client'),
				api.get('/servicetype'),
				api.get('/blockedtime'),
				api.get(`/appointment/workload?year=${currentDate.getFullYear()}&month=${currentDate.getMonth() + 1}`)
			])
			setAppointments(appRes.data)
			setClients(clientRes.data)
			setServices(serviceRes.data)
			setBlockedTimes(blockedRes.data)
			setWorkload(workloadRes.data)
		} catch {
			console.error('Erro ao carregar dados.')
		} finally {
			setLoading(false)
		}
	}

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()

    const getAppointmentsForDay = (day) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return appointments.filter(a => a.startTime.startsWith(dateStr) && a.status !== 2)
    }

    const isToday = (day) => {
        const today = new Date()
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
    }

    const isSelected = (day) => {
        return day === selectedDate.getDate() &&
            currentDate.getMonth() === selectedDate.getMonth() &&
            currentDate.getFullYear() === selectedDate.getFullYear()
    }

    const handleDayClick = (day) => {
        setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
    }

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))

    const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    const dayAppointments = appointments
        .filter(a => a.startTime.startsWith(selectedDateStr))
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))

    const selectedDayBlocked = blockedTimes.filter(b => b.startTime.startsWith(selectedDateStr))

    const handleBlockSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.post('/blockedtime', blockForm)
            loadData()
            setShowBlockModal(false)
            setBlockForm(emptyBlockForm)
        } catch (err) {
            alert(err.response?.data?.message || 'Erro ao criar bloqueio.')
        }
    }

    const handleDeleteBlock = async () => {
        try {
            await api.delete(`/blockedtime/${confirmDeleteBlock}`)
            loadData()
            setConfirmDeleteBlock(null)
        } catch {
            alert('Erro ao excluir bloqueio.')
            setConfirmDeleteBlock(null)
        }
    }

    const activeAppointments = appointments.filter(a => a.status === 0 || a.status === 1)

    const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    const formatSelectedDate = () => selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.post('/appointment', {
                ...form,
                clientId: parseInt(form.clientId),
                serviceTypeId: parseInt(form.serviceTypeId),
            })
            loadData()
            setShowModal(false)
            setForm(emptyForm)
        } catch (err) {
            alert(err.response?.data?.message || 'Erro ao criar agendamento.')
        }
    }

    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())
    const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth())
    const calendarCells = []
    for (let i = 0; i < firstDay; i++) calendarCells.push(null)
    for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d)
    while (calendarCells.length % 7 !== 0) calendarCells.push(null)
	
	const getDayWorkload = (day) => {
		const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
		return workload.find(w => w.date === dateStr)
	}

	const getBlockedTimesForDay = (day) => {
		const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
		return blockedTimes.filter(b => b.startTime.startsWith(dateStr))
	}

    return (
        <Layout>
            <div className="space-y-4">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-semibold" style={{ fontSize: '24px', color: '#e1e1ef', letterSpacing: '-0.01em' }}>
                            Agenda do Studio
                        </h1>
                        <p style={{ fontSize: '13px', color: '#8a90a4' }}>
                            {activeAppointments.length} agendamento{activeAppointments.length !== 1 ? 's' : ''} ativo{activeAppointments.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="flex gap-2">
                    <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all"
                        style={{
                            background: 'linear-gradient(135deg, #e07a93, #b85d77)',
                            color: 'white', fontSize: '13px',
                            boxShadow: '0 4px 14px rgba(224,122,147,0.35)'
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                        Novo
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                            {showDropdown ? 'expand_less' : 'expand_more'}
                        </span>
                    </button>

                    {showDropdown && (
                        <>
                            {/* Overlay para fechar ao clicar fora */}
                            <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />

                            <div className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden z-20"
                                style={{
                                    background: 'rgba(29,31,40,0.98)',
                                    border: '1px solid rgba(45,50,67,0.5)',
                                    boxShadow: '0 12px 32px rgba(0,0,0,0.5)'
                                }}>
                                <button
                                    onClick={() => { setShowModal(true); setShowDropdown(false) }}
                                    className="w-full flex items-center gap-3 px-4 py-3 transition-all text-left"
                                    style={{ color: '#e1e1ef' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,122,147,0.1)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#ffb1c2' }}>event</span>
                                    <span style={{ fontSize: '13px' }}>Agendar</span>
                                </button>
                                <button
                                    onClick={() => { setShowBlockModal(true); setShowDropdown(false) }}
                                    className="w-full flex items-center gap-3 px-4 py-3 transition-all text-left"
                                    style={{ color: '#e1e1ef' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,122,147,0.1)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#a18b8f' }}>block</span>
                                    <span style={{ fontSize: '13px' }}>Bloquear Horário</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
                </div>
                </div>

                {loading ? (
                    <p style={{ color: '#8a90a4' }}>Carregando...</p>
                ) : (
                    <>
                        <div className="rounded-2xl p-4"
                            style={{ background: 'rgba(29,31,40,0.9)', border: '1px solid rgba(45,50,67,0.5)' }}>

                            <div className="flex items-center justify-between mb-4">
                                <button onClick={prevMonth}
                                    className="p-1.5 rounded-lg transition-colors"
                                    style={{ color: '#8a90a4' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
                                </button>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#ffb1c2' }}>calendar_month</span>
                                    <span className="font-semibold" style={{ fontSize: '15px', color: '#e1e1ef' }}>
                                        {months[currentDate.getMonth()]} de {currentDate.getFullYear()}
                                    </span>
                                </div>
                                <button onClick={nextMonth}
                                    className="p-1.5 rounded-lg transition-colors"
                                    style={{ color: '#8a90a4' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {weekDays.map((day, i) => (
                                    <div key={day} className="text-center py-1"
                                        style={{
                                            fontSize: '11px', fontWeight: '600',
                                            letterSpacing: '0.04em',
                                            color: i === 0 || i === 6 ? '#544245' : '#8a90a4'
                                        }}>
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {calendarCells.map((day, idx) => {
                                    if (!day) return (
                                        <div key={`empty-${idx}`} className="min-h-[72px] rounded-xl"
                                            style={{ background: 'rgba(12,14,22,0.4)', opacity: 0.3 }} />
                                    )

                                    const dayApps = getAppointmentsForDay(day)
									const dayBlocked = getBlockedTimesForDay(day)
									const dayWorkload = getDayWorkload(day)
									const isFull = dayWorkload?.isFull || false
                                    const today = isToday(day)
                                    const selected = isSelected(day)

                                    return (
                                        <div key={day}
                                            onClick={() => handleDayClick(day)}
                                            className="min-h-[72px] p-1.5 rounded-xl cursor-pointer transition-all flex flex-col justify-between"
                                            style={{
												background: isFull
													? 'rgba(255,100,100,0.08)'
													: today
														? 'rgba(50,52,62,0.9)'
														: selected
															? 'rgba(224,122,147,0.08)'
															: 'rgba(29,31,40,0.6)',
												border: isFull
													? '1px solid rgba(255,100,100,0.25)'
													: today
														? '1px solid rgba(224,122,147,0.3)'
														: selected
															? '1px solid rgba(224,122,147,0.4)'
															: '1px solid transparent'
											}}>

                                            <div className="flex items-center justify-between">
                                                {today ? (
                                                    <div className="flex items-center gap-1">
                                                        <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold"
                                                            style={{ background: '#e07a93', color: '#5f132d', fontSize: '11px' }}>
                                                            {day}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: '12px', fontWeight: '500', color: selected ? '#ffb1c2' : '#8a90a4' }}>
                                                        {day}
                                                    </span>
                                                )}
                                            </div>

                                            {(dayApps.length > 0 || dayBlocked.length > 0) && (
												<div className="flex flex-col gap-0.5 my-1">
													{dayApps.slice(0, 3).map((a, i) => {
														const client = clients.find(c => c.name === a.clientName)
														const firstName = a.clientName.split(' ')[0]
														return (
															<div key={`app-${i}`}
																className="rounded px-1 truncate"
																style={{
																	background: client?.color || '#e07a93',
																	fontSize: '8px',
																	fontWeight: '600',
																	color: '#0c0e16',
																	lineHeight: '14px'
																}}>
																{firstName}
															</div>
														)
													})}
													{dayBlocked.map((b, i) => (
														<div key={`block-${i}`}
															className="rounded px-1 truncate"
															style={{
																background: '#544245',
																fontSize: '8px',
																fontWeight: '600',
																color: '#e1e1ef',
																lineHeight: '14px'
															}}>
															Bloqueado
														</div>
													))}
												</div>
											)}

                                            {dayApps.length > 0 && (
                                                <span style={{ fontSize: '9px', color: dayApps.length >= 4 ? '#ffb1c2' : '#8a90a4' }}>
                                                    {dayApps.length >= 4 ? `Lotado (${dayApps.length})` : `${dayApps.length} atend.`}
                                                </span>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="rounded-2xl p-4"
                            style={{ background: 'rgba(29,31,40,0.9)', border: '1px solid rgba(45,50,67,0.5)' }}>

                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#ffb1c2' }}>event_available</span>
                                        <h2 className="font-semibold capitalize" style={{ fontSize: '15px', color: '#e1e1ef' }}>
                                            {formatSelectedDate()}
                                        </h2>
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#8a90a4' }}>
                                        {dayAppointments.length} agendamento{dayAppointments.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>

                            {dayAppointments.length === 0 && selectedDayBlocked.length === 0 ? (
                                <div className="text-center py-8">
                                    <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#32343e' }}>event_busy</span>
                                    <p className="mt-2" style={{ fontSize: '13px', color: '#8a90a4' }}>Nenhum agendamento neste dia.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {selectedDayBlocked.map(b => (
                                        <div key={`block-${b.id}`}
                                            className="relative overflow-hidden rounded-xl flex items-center gap-3 p-4 pl-5"
                                            style={{ background: 'rgba(84,66,69,0.3)', border: '1px solid rgba(84,66,69,0.5)' }}>

                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
                                                style={{ background: '#544245' }} />

                                            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#a18b8f' }}>block</span>

                                            <div className="flex flex-col flex-1">
                                                <p className="font-semibold" style={{ fontSize: '14px', color: '#e1e1ef' }}>
                                                    Horário Bloqueado
                                                </p>
                                                <p style={{ fontSize: '12px', color: '#8a90a4' }}>
                                                    {b.reason || 'Sem motivo informado'}
                                                </p>
                                                <p style={{ fontSize: '11px', color: '#544245' }}>
                                                    {formatTime(b.startTime)} – {formatTime(b.endTime)}
                                                </p>
                                            </div>
                                            <button onClick={() => setConfirmDeleteBlock(b.id)}
                                                className="p-1.5 rounded-lg transition-colors"
                                                style={{ color: '#8a90a4' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                                            </button>
                                        </div>
                                    ))}
                                    {dayAppointments.map(a => {
                                        const client = clients.find(c => c.name === a.clientName)
                                        return (
                                            <div key={a.id}
                                                className="relative overflow-hidden rounded-xl flex flex-col md:flex-row md:items-center justify-between p-4 gap-3 pl-5 transition-all"
                                                style={{
                                                    background: 'rgba(40,41,51,0.8)',
                                                    border: '1px solid rgba(45,50,67,0.5)'
                                                }}>

                                                <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
                                                    style={{ background: client?.color || '#e07a93' }} />

                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col items-center justify-center min-w-[72px] py-1.5 px-2 rounded-lg"
                                                        style={{ background: 'rgba(12,14,22,0.6)' }}>
                                                        <span className="font-semibold" style={{ fontSize: '14px', color: '#e1e1ef' }}>
                                                            {formatTime(a.startTime)}
                                                        </span>
                                                        <span style={{ fontSize: '10px', color: '#8a90a4' }}>
                                                            {formatTime(a.endTime)}
                                                        </span>
                                                    </div>

                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0"
                                                        style={{
                                                            background: `${client?.color || '#e07a93'}22`,
                                                            color: client?.color || '#e07a93',
                                                            fontSize: '14px',
                                                            border: `2px solid ${client?.color || '#e07a93'}50`
                                                        }}>
                                                        {a.clientName.charAt(0).toUpperCase()}
                                                    </div>

                                                    <div className="flex flex-col min-w-0">
                                                        <p className="font-semibold truncate" style={{ fontSize: '14px', color: '#e1e1ef' }}>
                                                            {a.clientName}
                                                        </p>
                                                        <p className="truncate" style={{ fontSize: '12px', color: '#8a90a4' }}>
                                                            {a.serviceTypeName}
                                                        </p>
                                                        {a.totalPrice > 0 && (
                                                            <p style={{ fontSize: '11px', color: '#ffb1c2' }}>
                                                                R$ {a.totalPrice.toFixed(2)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 ml-auto">
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                                                        style={statusStyles[a.status]}>
                                                        {statusLabels[a.status]}
                                                    </span>
                                                    <button className="p-1.5 rounded-lg transition-colors"
                                                        style={{ color: '#8a90a4' }}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

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
                            Novo Agendamento
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: '600', color: '#d9c0c4' }}>Cliente</label>
                                <select value={form.clientId}
                                    onChange={e => setForm({...form, clientId: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                                    style={{ background: '#0c0e16', color: '#e1e1ef', fontSize: '14px', border: '1px solid rgba(45,50,67,0.8)' }}
                                    required>
                                    <option value="">Selecione...</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: '600', color: '#d9c0c4' }}>Serviço</label>
                                <select value={form.serviceTypeId}
                                    onChange={e => setForm({...form, serviceTypeId: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                                    style={{ background: '#0c0e16', color: '#e1e1ef', fontSize: '14px', border: '1px solid rgba(45,50,67,0.8)' }}
                                    required>
                                    <option value="">Selecione...</option>
                                    {services.filter(s => s.isActive).map(s => (
                                        <option key={s.id} value={s.id}>{s.name} — {s.durationMinutes}min</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: '600', color: '#d9c0c4' }}>Data e hora</label>
                                <input type="datetime-local" value={form.startTime}
                                    onChange={e => setForm({...form, startTime: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                                    style={{ background: '#0c0e16', color: '#e1e1ef', fontSize: '14px', border: '1px solid rgba(45,50,67,0.8)' }}
                                    required />
                            </div>

                            <div>
                                <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: '600', color: '#d9c0c4' }}>Desconto (R$)</label>
                                <input type="number" value={form.discount}
                                    onChange={e => setForm({...form, discount: parseFloat(e.target.value)})}
                                    className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                                    style={{ background: '#0c0e16', color: '#e1e1ef', fontSize: '14px', border: '1px solid rgba(45,50,67,0.8)' }}
                                    min="0" step="0.01" />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button"
                                    onClick={() => { setShowModal(false); setForm(emptyForm) }}
                                    className="flex-1 py-2.5 rounded-xl font-medium"
                                    style={{ border: '1px solid rgba(45,50,67,0.8)', color: '#8a90a4', fontSize: '13px' }}>
                                    Cancelar
                                </button>
                                <button type="submit"
                                    className="flex-1 py-2.5 rounded-xl font-semibold"
                                    style={{
                                        background: 'linear-gradient(135deg, #e07a93, #b85d77)',
                                        color: 'white', fontSize: '13px',
                                        boxShadow: '0 4px 14px rgba(224,122,147,0.35)'
                                    }}>
                                    Agendar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showBlockModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
                    <div className="w-full max-w-md rounded-3xl p-6"
                        style={{
                            background: 'rgba(29,31,40,0.98)',
                            border: '1px solid rgba(45,50,67,0.5)',
                            boxShadow: '0 24px 48px rgba(0,0,0,0.6)'
                        }}>

                        <h2 className="font-semibold mb-5" style={{ fontSize: '20px', color: '#e1e1ef' }}>
                            Bloquear Horário
                        </h2>

                        <form onSubmit={handleBlockSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: '600', color: '#d9c0c4' }}>Início</label>
                                <input type="datetime-local" value={blockForm.startTime}
                                    onChange={e => setBlockForm({...blockForm, startTime: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                                    style={{ background: '#0c0e16', color: '#e1e1ef', fontSize: '14px', border: '1px solid rgba(45,50,67,0.8)' }}
                                    required />
                            </div>

                            <div>
                                <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: '600', color: '#d9c0c4' }}>Fim</label>
                                <input type="datetime-local" value={blockForm.endTime}
                                    onChange={e => setBlockForm({...blockForm, endTime: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                                    style={{ background: '#0c0e16', color: '#e1e1ef', fontSize: '14px', border: '1px solid rgba(45,50,67,0.8)' }}
                                    required />
                            </div>

                            <div>
                                <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: '600', color: '#d9c0c4' }}>Motivo (opcional)</label>
                                <input type="text" value={blockForm.reason}
                                    onChange={e => setBlockForm({...blockForm, reason: e.target.value})}
                                    placeholder="Ex: Compromisso pessoal"
                                    className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                                    style={{ background: '#0c0e16', color: '#e1e1ef', fontSize: '14px', border: '1px solid rgba(45,50,67,0.8)' }} />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button"
                                    onClick={() => { setShowBlockModal(false); setBlockForm(emptyBlockForm) }}
                                    className="flex-1 py-2.5 rounded-xl font-medium"
                                    style={{ border: '1px solid rgba(45,50,67,0.8)', color: '#8a90a4', fontSize: '13px' }}>
                                    Cancelar
                                </button>
                                <button type="submit"
                                    className="flex-1 py-2.5 rounded-xl font-semibold"
                                    style={{
                                        background: '#544245',
                                        color: '#e1e1ef', fontSize: '13px'
                                    }}>
                                    Bloquear
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {confirmDeleteBlock && (
                <ConfirmModal
                    message="Deseja excluir este bloqueio de horário?"
                    onConfirm={handleDeleteBlock}
                    onCancel={() => setConfirmDeleteBlock(null)}
                />
            )}
        </Layout>
    )
}