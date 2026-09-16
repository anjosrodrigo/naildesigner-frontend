import axios from 'axios'

const api = axios.create({
    //baseURL: 'http://localhost:5014/api',
	baseURL: 'http://192.168.15.8:5014/api',
    headers: {
        'Content-Type': 'application/json'
    }
})

// Interceptor — adiciona o token automaticamente em todas as requisições
api.interceptors.request.use( config => {
    const token = localStorage.getItem( 'token' )
    if ( token ) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Interceptor — trata erros globalmente
api.interceptors.response.use(
    response => response,
    error => {
        if ( error.response?.status === 401 ) {
            localStorage.removeItem( 'token' )
            window.location.href = '/login'
        }
        return Promise.reject( error )
    }
)

export default api