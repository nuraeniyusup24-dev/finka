export default function ({ store, redirect, route }) {
  // Token disimpan di localStorage browser, jadi pengecekan hanya dilakukan di sisi client
  if (process.server) return

  // Fungsi internal untuk mengecek token dan alur navigasi
  const cekDanRedirect = () => {
    const isLoggedIn = !!(store.state.auth && store.state.auth.token)
    const isLoginPage = route.path === '/login'

    // 1. Jika belum login dan sedang mengakses halaman terlindungi
    if (!isLoggedIn) {
      if (!isLoginPage) {
        // Simpan halaman tujuan di query parameter ?next= agar bisa di-redirect kembali setelah login
        redirect('/login?next=' + encodeURIComponent(route.fullPath))
      }
      return
    }

    // 2. Jika password sementara (hasil reset/impor) wajib diganti sebelum menggunakan aplikasi
    const user = store.state.auth.user
    if (user && user.wajib_ganti_password && route.path !== '/akun/password') {
      redirect('/akun/password')
    }
  }

  // Jika rehydrate status autentikasi sudah siap, langsung eksekusi pengecekan
  if (store.state.auth && store.state.auth.siap) {
    cekDanRedirect()
    return
  }

  // Jika rehydrate belum selesai, kembalikan Promise agar Nuxt menahan proses render halaman
  return new Promise((resolve) => {
    const berhentiWatch = store.watch(
      (state) => state.auth && state.auth.siap,
      (siap) => {
        if (siap) {
          berhentiWatch() // Hentikan watcher setelah status siap
          cekDanRedirect()
          resolve()
        }
      }
    )
  })
}
