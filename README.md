# 🗳️ E-Voting Insan Muda Banyakan

Aplikasi pemilihan Ketua Insan Muda Banyakan Periode 2026-2029

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js (v18+)
- MySQL (via XAMPP/Laragon)

### Langkah-langkah

#### 1. Aktifkan MySQL
Pastikan MySQL sudah berjalan (jika pakai XAMPP/Laragon, start MySQL)

#### 2. Jalankan Backend
```bash
cd backend
npm run dev
```
Backend akan berjalan di: http://localhost:3001

#### 3. Jalankan Frontend (Terminal baru)
```bash
cd frontend
npm run dev
```
Frontend akan berjalan di: http://localhost:5173

#### 4. Buka Browser
Akses http://localhost:5173

---

## 📱 Halaman Aplikasi

| URL | Halaman |
|-----|---------|
| `/` | Halaman Pembuka |
| `/voting` | Halaman Voting |
| `/login-results` | Login Hasil Voting |
| `/results` | Hasil Voting |

## 🔐 Akses Hasil Voting
Password: `ketuaim2026`

---

## 📁 Struktur Folder

```
voting-insan-muda/
├── backend/           # API Server (Express.js)
│   ├── routes/
│   ├── server.js
│   └── .env
├── frontend/          # Web App (React + Vite)
│   ├── src/
│   └── public/photos/
└── README.md
```

## ⚙️ Konfigurasi Database

Edit file `backend/.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=voting_im
```
