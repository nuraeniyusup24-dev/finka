import { api } from '~/plugins/api'

export default {
  /**
   * Mengambil daftar seluruh siswa (bisa menggunakan parameter pencarian/filter/halaman)
   * @param {Object} [params] - Parameter query seperti { q: 'nama/nis', kelas: '10A', page: 1 }
   */
  getSiswa(params = {}) {
    return api.get('/admin/siswa', { params })
  },

  /**
   * Mengambil detail data satu siswa berdasarkan ID
   * @param {String|Number} id - ID siswa
   */
  getDetail(id) {
    return api.get(`/admin/siswa/${id}`)
  },

  /**
   * Menambahkan data siswa baru
   * @param {Object} data - Payload data siswa { nama, nis, kelas, saldo, ... }
   */
  tambah(data) {
    return api.post('/admin/siswa', data)
  },

  /**
   * Memperbarui data siswa yang sudah ada
   * @param {String|Number} id - ID siswa
   * @param {Object} data - Payload data siswa yang diperbarui
   */
  update(id, data) {
    return api.put(`/admin/siswa/${id}`, data)
  },

  /**
   * Menghapus data siswa dari sistem
   * @param {String|Number} id - ID siswa
   */
  hapus(id) {
    return api.delete(`/admin/siswa/${id}`)
  },

  /**
   * Melakukan isi ulang (top-up) saldo siswa langsung dari panel Admin
   * @param {String|Number} id - ID siswa
   * @param {Object} payload - { nominal: 50000, catatan: 'Top-up tunai via admin' }
   */
  topup(id, payload) {
    return api.post(`/admin/siswa/${id}/topup`, payload)
  },

  /**
   * Mereset PIN pembayaran siswa ke default/sementara
   * @param {String|Number} id - ID siswa
   */
  resetPin(id) {
    return api.post(`/admin/siswa/${id}/reset-pin`)
  }
}
