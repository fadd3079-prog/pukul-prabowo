// game/gameState.js
// Menyimpan semua data gameplay — JANGAN simpan DOM element di sini

const gameState = {

  // --- HIT ---
  hit: 0,                  // Total hit keseluruhan
  lastHitValue: 1,         // Nilai hit terakhir (normal atau critical)

  // --- COMBO ---
  combo: 0,                // Combo saat ini
  maxCombo: 0,             // Combo tertinggi yang pernah dicapai
  lastClickTime: 0,        // Timestamp klik terakhir (ms)
  comboResetDelay: 2500,   // Batas waktu reset combo (ms)

  // --- CRITICAL ---
  criticalChance: 0.05,    // Base chance 5%
  isCritical: false,       // Apakah hit terakhir adalah critical

  // --- PLAYER ---
  player: {
    name: '',              // Nama pemain
    province: '',          // Provinsi pemain
    rank: 0,               // Rank pemain (dari server)
  },

  // --- SESSION ---
  isPlaying: false,        // Status sesi game aktif atau tidak
  startTime: 0,            // Waktu mulai sesi (timestamp)

  // --- FLAGS ---
  comboEventFired: false,  // Mencegah event combo dobel dalam 1 threshold

};

export default gameState;