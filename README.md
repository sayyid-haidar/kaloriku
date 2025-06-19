# 🥗 KaloriKu - Your Simple Calorie Pal

**Versi:** 1.0 (MVP)  
**Tanggal Rilis:** 1 Juni 2025
**Teknologi:** Laravel (PHP), React.js, MySQL

---

## ❓ Why - Latar Belakang Masalah

Tingkat obesitas di Indonesia terus meningkat — menurut Riskesdas 2018, **1 dari 5 orang dewasa mengalami obesitas**, yang menjadi pintu gerbang ke berbagai penyakit kronis seperti:
- Diabetes
- Hipertensi
- Penyakit jantung

Meskipun kesadaran hidup sehat makin tinggi, banyak orang **gagal membangun kebiasaan mencatat kalori** karena aplikasi yang tersedia:
- Terlalu rumit
- Tidak relevan dengan makanan lokal
- Menuntut input data berlebihan
- Membosankan karena repetitif

---

## ✅ Solusi: KaloriKu

KaloriKu hadir sebagai aplikasi web pencatat kalori **yang sangat sederhana dan cepat digunakan**, khususnya bagi masyarakat Indonesia.  
Dirancang untuk menjadi **teman kalori pertama** yang ringan, intuitif, dan relevan.

> Fokus KaloriKu: **“Simple > Complete”**, karena pengguna pemula butuh solusi mudah terlebih dahulu sebelum komitmen jangka panjang.

---

## 🎯 Visi Produk

> Menjadi aplikasi pencatat kalori harian **yang paling cepat dan tidak merepotkan**, khususnya bagi masyarakat Indonesia.

---

## 🧑‍💻 Target Pengguna

- **Individu Sibuk:** Profesional, mahasiswa, orang tua yang tidak sempat mencatat detail makanan.
- **Pemula Diet:** Butuh pengalaman pertama yang positif dan tidak mengintimidasi.
- **Penjaga Berat Badan:** Hanya ingin alat pantau yang simpel dan cepat.

---

## 🧩 Fitur Utama (MVP)

| Prioritas | Fitur | Deskripsi |
|----------|-------|-----------|
| Wajib | 🔐 Pendaftaran & Login | Autentikasi pengguna menggunakan email & password. |
| Wajib | 🧍‍♂️ Setup Profil | Input data diri: gender, usia, berat, tinggi, aktivitas → kalkulasi BMI & target kalori. |
| Wajib | ✍️ Pencatatan Manual | Input makanan & kalori secara cepat setiap hari. |
| Wajib | 📊 Dashboard Harian | Lihat total kalori masuk vs. target dengan visual jelas (progress bar). |
| Penting | 📆 Riwayat Kalori | Ringkasan 7 hari terakhir dalam bentuk daftar atau grafik. |
| Penting | ❤️ Makanan Favorit | Simpan makanan yang sering dimakan agar bisa input 1 klik. |

---

## 🛠️ Teknologi

- **Backend:** Laravel (PHP)
- **Frontend:** React.js (via Vite di dalam Laravel)
- **Database:** MySQL
- **Arsitektur:** Monolithic App

---

## 🧱 Struktur Database (ERD)

Diagram berikut merepresentasikan struktur database utama menggunakan **Mermaid.js**:

```mermaid
erDiagram
  users ||--o{ user_profiles : has
  users ||--o{ calorie_entries : logs
  users ||--o{ weight_logs : tracks
  users ||--o{ calorie_summaries : summarizes
  users ||--o{ user_favorite_foods : saves
  users ||--o{ foods : creates
  user_profiles }o--|| activity_levels : uses
  user_profiles }o--|| goals : has
  calorie_entries }o--|| foods : references
  user_favorite_foods }o--|| foods : favorites
  food_tags }o--|| tags : tags
  food_tags }o--|| foods : categorizes

  users {
    int id PK
    varchar name
    varchar email
    varchar password
  }

  user_profiles {
    int id PK
    int user_id FK
    enum gender
    int age
    float weight
    float height
    int activity_level_id FK
    int goal_id FK
    float bmi
    int daily_calorie_target
  }

  activity_levels {
    int id PK
    varchar name
    float multiplier
  }

  goals {
    int id PK
    varchar name
    int calorie_modifier
  }

  weight_logs {
    int id PK
    int user_id FK
    float weight
    date log_date
  }

  foods {
    int id PK
    varchar name
    int default_calorie
    int created_by_user_id FK
  }

  tags {
    int id PK
    varchar name
  }

  food_tags {
    int food_id FK
    int tag_id FK
  }

  calorie_entries {
    int id PK
    int user_id FK
    int food_id FK
    float portion
    int calorie_amount
    date entry_date
  }

  user_favorite_foods {
    int user_id FK
    int food_id FK
    varchar note
  }

  calorie_summaries {
    int id PK
    int user_id FK
    date summary_date
    int total_calories
    int calorie_target
    int deviation
  }
