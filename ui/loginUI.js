// ui/loginUI.js
// Mengelola tampilan dan logika form login (nama + provinsi)

import { populateProvinceSelect } from '../data/provinces.js';

// ===== ELEMENT REFS =====
const screenLogin    = document.getElementById('screen-login');
const inputName      = document.getElementById('input-name');
const inputProvince  = document.getElementById('input-province');
const btnPlay        = document.getElementById('btn-play');

// ===== INIT =====
/**
 * Inisialisasi login UI
 * @param {{ onPlay: Function }} callbacks
 * onPlay(name, province) dipanggil saat player tekan Main
 */
export function initLoginUI({ onPlay } = {}) {

  // Isi dropdown provinsi
  populateProvinceSelect(inputProvince);

  // Submit via tombol Main
  btnPlay.addEventListener('click', () => {
    handleSubmit(onPlay);
  });

  // Submit via Enter di keyboard
  inputName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSubmit(onPlay);
  });
}

// ===== HANDLE SUBMIT =====
/**
 * Validasi input lalu panggil onPlay
 * @param {Function} onPlay
 */
function handleSubmit(onPlay) {
  const name     = inputName.value.trim();
  const province = inputProvince.value;

  // Validasi nama
  if (!name) {
    shakeInput(inputName);
    inputName.focus();
    return;
  }

  // Validasi provinsi
  if (!province) {
    shakeInput(inputProvince);
    return;
  }

  // Sembunyikan error jika ada
  clearErrors();

  // Panggil callback ke script.js
  if (onPlay) onPlay(name, province);
}

// ===== SHAKE FEEDBACK =====
/**
 * Animasi shake pada input yang kosong
 * @param {HTMLElement} el
 */
function shakeInput(el) {
  el.classList.remove('input-error');
  // Reflow trick agar animasi bisa diulang
  void el.offsetWidth;
  el.classList.add('input-error');

  el.addEventListener('animationend', () => {
    el.classList.remove('input-error');
  }, { once: true });
}

// ===== CLEAR ERRORS =====
function clearErrors() {
  inputName.classList.remove('input-error');
  inputProvince.classList.remove('input-error');
}

// ===== SHOW / HIDE =====
/**
 * Tampilkan screen login
 */
export function showLoginScreen() {
  screenLogin.classList.add('active');
}

/**
 * Sembunyikan screen login
 */
export function hideLoginScreen() {
  screenLogin.classList.remove('active');
}