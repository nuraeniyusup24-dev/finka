export default function ({ store, redirect, route }) {
  // Ambil data user dari Vuex state auth
  const user = store.state.auth ? store.state.auth.user : null

  // 1. Jika pengguna belum login atau bukan ber-role 'ortu'
  if (!user || user.role !== 'ortu') {
    // Alihkan ke /login (bukan ke /ortu) untuk mencegah infinite redirect loop
    return redirect('/login?next=' + encodeURIComponent(route.fullPath))
  }
}
