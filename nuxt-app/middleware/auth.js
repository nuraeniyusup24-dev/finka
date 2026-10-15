export default function ({ store, redirect, route }) {
  if (process.server) return // Token hanya ada di localStorage browser, cek di client saja

  const cekDanRedirect = () => {
    const isLoggedIn = !!store.state.auth.token
    const isLoginPage = route.path === '/login'

    // 1. Jika belum login dan bukan di halaman login, lempar ke /login dengan query next
    if (!isLoggedIn) {
      if (!isLoginPage) {
        redirect('/login?next=' + encodeURIComponent(route.fullPath))
      }
      return
    }

    // 2. Jika password sementara (hasil reset/impor) wajib diganti sebelum memakai aplikasi
    const u = store.state.auth.user
    if (u && u.wajib_ganti_password && route.path !== '/akun/password') {
      redirect('/akun/password')
    }
  }

  // Jika rehydrate sudah siap, langsung jalankan pengecekan
  if (store.state.auth.siap) {
    cekDanRedirect()
    return
  }

  // Tunggu rehydrate plugin selesai (return Promise agar Nuxt menahan render halaman)
  return new Promise((resolve) => {
    const berhenti = store.watch(
      (s) => s.auth.siap,
      (siap) => {
        if (siap) {
          berhenti()
          cekDanRedirect()
          resolve()
        }
      }
    )
  })
}
