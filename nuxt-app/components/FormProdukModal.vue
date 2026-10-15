<template>
  <ModalDialog
    :judul="ubah ? 'Ubah produk' : 'Tambah produk'"
    :sub="(ubah ? 'Perubahan akan tersimpan di katalog ' : 'Produk akan masuk ke katalog ') + outletNama + '.'"
    @tutup="$emit('tutup')"
    @kirim="simpan"
  >
    <FormField label="Nama produk" untuk="p-nama" :galat="galat.nama">
      <input
        id="p-nama"
        v-model="f.nama"
        class="input"
        type="text"
        autocomplete="off"
        placeholder="mis. Es teh manis"
        :aria-invalid="galat.nama ? 'true' : 'false'"
      />
    </FormField>

    <FormField label="Harga" untuk="p-harga" :galat="galat.harga">
      <input
        id="p-harga"
        v-model.number="f.harga"
        class="input num"
        type="number"
        min="0"
        placeholder="0"
        :aria-invalid="galat.harga ? 'true' : 'false'"
      />
    </FormField>

    <FormField label="Kategori" untuk="p-kategori">
      <select id="p-kategori" v-model="f.kategori" class="input">
        <option value="makanan">Makanan</option>
        <option value="minuman">Minuman</option>
        <option value="snack">Snack / Cemilan</option>
        <option value="lainnya">Lainnya</option>
      </select>
    </FormField>
  </ModalDialog>
</template>

<script>
export default {
  props: {
    ubah: { type: Boolean, default: false },
    outletNama: { type: String, default: 'Outlet' },
    produkData: { type: Object, default: () => ({ id: null, nama: '', harga: '', kategori: 'makanan' }) }
  },
  data() {
    return {
      f: {
        id: this.produkData.id || null,
        nama: this.produkData.nama || '',
        harga: this.produkData.harga || '',
        kategori: this.produkData.kategori || 'makanan'
      },
      galat: {}
    }
  },
  watch: {
    produkData: {
      deep: true,
      handler(val) {
        if (val) {
          this.f = {
            id: val.id || null,
            nama: val.nama || '',
            harga: val.harga || '',
            kategori: val.kategori || 'makanan'
          }
        }
      }
    }
  },
  methods: {
    validasi() {
      this.galat = {}
      if (!this.f.nama || !this.f.nama.trim()) {
        this.galat.nama = 'Nama produk wajib diisi'
      }
      if (this.f.harga === '' || this.f.harga === null || Number(this.f.harga) <= 0) {
        this.galat.harga = 'Harga harus lebih dari 0'
      }
      return Object.keys(this.galat).length === 0
    },
    simpan() {
      if (!this.validasi()) return
      this.$emit('simpan', {
        id: this.f.id,
        nama: this.f.nama.trim(),
        harga: Number(this.f.harga),
        kategori: this.f.kategori
      })
    }
  }
}
</script>  
