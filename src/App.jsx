import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Pages
import Login from './pages/Login'
import Agenda from './pages/Agenda'
import Clients from './pages/Clients'
import Services from './pages/Services'
import Revenue from './pages/Revenue'
import AddOns from './pages/AddOns'

// Protected Route
function ProtectedRoute({ children }) {
    const { token, loading } = useAuth()

    if ( loading ) return <div>Carregando...</div>
    if ( !token ) return <Navigate to="/login" />

    return children
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Agenda />
                        </ProtectedRoute>
                    } />
                    <Route path="/clients" element={
                        <ProtectedRoute>
                            <Clients />
                        </ProtectedRoute>
                    } />
                    <Route path="/services" element={
                        <ProtectedRoute>
                            <Services />
                        </ProtectedRoute>
                    } />
                    <Route path="/revenue" element={
                        <ProtectedRoute>
                            <Revenue />
                        </ProtectedRoute>
                    } />
					<Route path="/addons" element={
						<ProtectedRoute>
							<AddOns />
						</ProtectedRoute>
					} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App