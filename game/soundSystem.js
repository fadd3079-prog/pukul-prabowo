// game/soundSystem.js

// ===== PRELOAD =====
const hitSound   = audio.src = "/assets/sfx-pukul.ogg"
hitSound.preload = 'auto';

const comboSound = audio.src = "/assets/sfx-pukul.ogg"
comboSound.preload      = 'auto';
comboSound.playbackRate = 1.5;
comboSound.volume       = 1.0;

let enabled = true;

// ===== INIT =====
export function initSoundSystem() {
  document.addEventListener('pointerdown', unlockAudio, { once: true });
}

function unlockAudio() {
  const silent = audio.src = "/assets/sfx-pukul.ogg"
  silent.volume = 0;
  silent.play().catch(() => {});
}

// ===== PLAY HIT =====
export function playHit(isCritical = false) {
  if (!enabled) return;
  try {
    hitSound.pause();
    hitSound.currentTime  = 0;
    hitSound.volume       = isCritical ? 0.9 : 0.6;
    hitSound.playbackRate = isCritical ? 1.5 : 1.0;
    hitSound.play().catch(() => {});
  } catch (e) {}
}

// ===== PLAY COMBO =====
export function playCombo() {
  if (!enabled) return;
  try {
    comboSound.pause();
    comboSound.currentTime = 0;
    comboSound.play().catch(() => {});
  } catch (e) {}
}

// ===== TOGGLE =====
export function setSoundEnabled(val) { enabled = val; }
export function isSoundEnabled()     { return enabled; }
// ```

// ---

// **Cara kerjanya:**
// ```
// Klik 1  → restart dari 0 → "d..."
// Klik 2  → restart dari 0 → "d..."
// Klik 3  → restart dari 0 → "d..."
// [berhenti]
//            → tidak ada yang interrupt → "duuuuaaarrr" ✅