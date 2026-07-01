# 🥊 Pukul Prabowo

Game tap-tap web mirip **Popcat**. Pemain memasukkan nama dan provinsi, lalu tap/click untuk menaikkan skor. Ada leaderboard pemain dan provinsi — siapa provinsi terkuat?

---

## 🛠 Tech Stack

| Layer       | Teknologi                                |
| ----------- | ---------------------------------------- |
| Frontend    | Vanilla HTML, CSS, JavaScript (ES Modules) |
| Backend     | Vercel Serverless Functions (Node.js)    |
| Database    | Supabase (PostgreSQL)                    |
| Hosting     | Vercel                                   |

---

## 📂 Project Structure

```
pukul-prabowo/
├── api/                        # Vercel serverless functions
│   ├── donors/index.js         #   GET /api/donors
│   ├── health.js               #   GET /api/health
│   ├── leaderboards/
│   │   ├── players.js          #   GET /api/leaderboards/players
│   │   └── provinces.js        #   GET /api/leaderboards/provinces
│   └── players/
│       ├── rank.js             #   GET /api/players/rank
│       └── score.js            #   POST /api/players/score
├── assets/                     # Static assets
│   ├── logo.png
│   ├── objek.png
│   └── sfx-pukul.ogg
├── data/
│   └── provinces.js            # Province list data
├── game/                       # Game engine modules
│   ├── animationSystem.js
│   ├── clickSystem.js
│   ├── comboSystem.js
│   ├── engine.js
│   ├── gameState.js
│   ├── popupSystem.js
│   └── soundSystem.js
├── lib/                        # Shared server utilities
│   ├── apiHelper.js
│   └── supabase.js
├── scripts/
│   └── check-env.js            # Env var validation script
├── services/                   # Frontend API services
│   ├── donorAPI.js
│   ├── leaderboardAPI.js
│   └── playerAPI.js
├── supabase/
│   └── reset.sql               # DB schema + seed
├── ui/                         # UI modules
│   ├── donorTicker.js
│   ├── errorToast.js
│   ├── leaderboardUI.js
│   ├── loginUI.js
│   └── profileUI.js
├── .env.example                # Environment variable template
├── index.html                  # Main HTML
├── package.json
├── script.js                   # Main entry point (ES module)
├── style.css                   # All styles
├── TODO.md
├── vercel.json                 # Vercel routing & headers
└── README.md
```

---

## 📋 Prerequisites

- **Node.js** >= 18
- **Vercel CLI** (`npm i -g vercel`)
- **Supabase** account (free tier is fine)

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USER/pukul-prabowo.git
cd pukul-prabowo
npm install
```

### 2. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** di dashboard Supabase
3. Jalankan isi file `supabase/reset.sql` — ini akan membuat semua tabel, RLS policies, dan seed data

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Isi file `.env` dengan values dari dashboard Supabase (Settings → API):

| Variable                     | Deskripsi                        |
| ---------------------------- | -------------------------------- |
| `SUPABASE_URL`               | URL project Supabase             |
| `SUPABASE_SERVICE_ROLE_KEY`  | Service role key (server-only!)  |

Validasi env vars:

```bash
npm run check
```

### 4. Run Development Server

```bash
npm run dev
```

Buka `http://localhost:3000` di browser.

---

## 🔌 API Endpoints

| Method | Path                         | Deskripsi                          | Auth       |
| ------ | ---------------------------- | ---------------------------------- | ---------- |
| GET    | `/api/health`                | Health check                       | None       |
| POST   | `/api/players/score`         | Submit/update skor pemain          | None       |
| GET    | `/api/players/rank`          | Get rank pemain (query: `name`)    | None       |
| GET    | `/api/leaderboards/players`  | Leaderboard pemain                 | None       |
| GET    | `/api/leaderboards/provinces`| Leaderboard provinsi               | None       |
| GET    | `/api/donors`                | Daftar donatur                     | None       |

Semua response menggunakan format konsisten:

```json
{
  "ok": true,
  "data": { ... },
  "error": null
}
```

---

## 🚢 Deploy to Vercel

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Link & Deploy

```bash
vercel          # ikuti prompt untuk link project
vercel --prod   # deploy ke production
```

### 3. Set Environment Variables

Di Vercel dashboard → Settings → Environment Variables, tambahkan:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 🔒 Security Notes

- **Service Role Key** hanya digunakan di server-side (Vercel functions) — **tidak pernah** dikirim ke client
- **RLS (Row Level Security)** diaktifkan di semua tabel Supabase
- Client **tidak bisa** menulis langsung ke database — semua write melalui API endpoints
- Input validation dilakukan di setiap API endpoint
- Anti-cheat ringan via score audit trail

---

## ⚠️ Known Limitations

- Belum ada rate limiting di API — potensi abuse via script
- Anti-cheat masih basic (audit trail, belum IP-based)
- Tidak ada admin dashboard untuk manage donors
- Belum PWA (no service worker / offline support)
- Sound tidak bisa di-toggle dari UI (auto-play on click)
- Belum ada fitur share score ke social media

---

## 📜 License

© 2026 fadd_graphics
