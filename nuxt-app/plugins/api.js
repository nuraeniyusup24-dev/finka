import axios from 'axios'

// 1. Buat instance Axios dengan konfigurasi dasar
export const api = axios.create({
  baseURL: process.env.BACKEND_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export default function ({ store, redirect, route }, inject) {
  // Flag penanda agar redirect 401 tidak dieksekusi berulang kali
  let isRedirecting = false

  // Interceptor Request: Sisipkan token JWT ke header Authorization jika tersedia
  api.interceptors.request.use((config) => {
    const token = store.state.auth ? store.state.auth.token : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  // Interceptor Response: Tangkap error 401 secara global
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // Periksa apakah error berasal dari respon HTTP 401 (Unauthorized / Token Kedaluwarsa)
      if (error.response && error.response.status === 401) {
        if (!isRedirecting && process.client) {
          isRedirecting = true

          // Bersihkan token dari localStorage dan reset state Vuex
          localStorage.removeItem('token')
          if (store.commit) {
            store.commit('auth/setToken', null)
            store.commit('auth/setUser', null)
          }

          // Alihkan pengguna ke halaman /login dengan menyisipkan URL halaman saat ini
          const currentPath = route ? route.fullPath : '/'
          if (currentPath !== '/login') {
            window.location.href = `/login?expired=1&next=${encodeURIComponent(currentPath)}`
          }
        }
      }

      return Promise.reject(error)
    }
  )

  // Inject $api agar bisa dipanggil di komponen melalui this.$api
  inject('api', api)
}
