/* app.js — Abstractive Text Summariser Frontend Logic */

const API_BASE = 'http://localhost:5000';

/* ── DOM refs ─────────────────────────────────────── */
const inputText = document.getElementById('input-text');
const wordCountEl = document.getElementById('word-count');
const minSlider = document.getElementById('min-length');
const maxSlider = document.getElementById('max-length');
const minValEl = document.getElementById('min-val');
const maxValEl = document.getElementById('max-val');
const btnSubmit = document.getElementById('btn-submit');
const outputSec = document.getElementById('output-section');
const summaryEl = document.getElementById('summary-text');
const inputWCEl = document.getElementById('stat-input-wc');
const summaryWCEl = document.getElementById('stat-summary-wc');
const comprEl = document.getElementById('stat-compression');
const btnCopy = document.getElementById('btn-copy');
const errorSec = document.getElementById('error-section');
const errorTitle = document.getElementById('error-title');
const errorMsg = document.getElementById('error-msg');
const toastEl = document.getElementById('toast');
const toastMsg = toastEl.querySelector('.toast-msg');

/* ── Word counter ──────────────────────────────────── */
function updateWordCount() {
  const text = inputText.value.trim();
  const count = text ? text.split(/\s+/).length : 0;
  wordCountEl.textContent = count;

  // Toggle the 'warn' class on the badge when below minimum
  if (count > 0 && count < 20) {
    wordCountEl.classList.add('warn');
  } else {
    wordCountEl.classList.remove('warn');
  }
}

inputText.addEventListener('input', updateWordCount);
updateWordCount();

/* ── Range slider fill track ───────────────────────── */
function updateSliderFill(slider) {
  const min = parseFloat(slider.min);
  const max = parseFloat(slider.max);
  const val = parseFloat(slider.value);
  const pct = ((val - min) / (max - min)) * 100;
  slider.style.background =
    `linear-gradient(to right, var(--purple) ${pct}%, var(--border) ${pct}%)`;
}

function clampSliders() {
  let min = parseInt(minSlider.value, 10);
  let max = parseInt(maxSlider.value, 10);
  if (max <= min) {
    maxSlider.value = min + 10;
    max = min + 10;
  }
  minValEl.textContent = min;
  maxValEl.textContent = maxSlider.value;
  updateSliderFill(minSlider);
  updateSliderFill(maxSlider);
}

minSlider.addEventListener('input', clampSliders);
maxSlider.addEventListener('input', clampSliders);
clampSliders(); // initialise on page load

/* ── Submit ────────────────────────────────────────── */
btnSubmit.addEventListener('click', async () => {
  const text = inputText.value.trim();

  if (!text) {
    showError('No text provided', 'Please paste or type some text in the input area before summarising.');
    return;
  }

  const wordCount = text.split(/\s+/).length;
  if (wordCount < 20) {
    showError('Text too short',
      `Your input has only ${wordCount} word(s). Please provide at least 20 words for a meaningful summary.`);
    return;
  }

  setLoading(true);
  hideOutput();
  hideError();

  try {
    const response = await fetch(`${API_BASE}/api/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        min_length: parseInt(minSlider.value, 10),
        max_length: parseInt(maxSlider.value, 10),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Server error (${response.status})`);
    }

    showOutput(data);

  } catch (err) {
    if (err.name === 'TypeError' && err.message.toLowerCase().includes('fetch')) {
      showError(
        'Cannot reach the server',
        'Make sure the Flask backend is running on http://localhost:5000 — open a terminal and run: python app.py'
      );
    } else {
      showError('Summarisation failed', err.message);
    }
  } finally {
    setLoading(false);
  }
});

/* ── UI helpers ────────────────────────────────────── */
function setLoading(on) {
  btnSubmit.disabled = on;
  btnSubmit.classList.toggle('loading', on);
}

function showOutput(data) {
  summaryEl.textContent = data.summary || '(no summary returned)';
  inputWCEl.textContent = (data.input_word_count ?? '—').toLocaleString();
  summaryWCEl.textContent = (data.summary_word_count ?? '—').toLocaleString();
  comprEl.textContent = data.compression_ratio != null
    ? `${data.compression_ratio}%`
    : '—';

  outputSec.classList.add('visible');
  setTimeout(() => outputSec.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
}

function hideOutput() { outputSec.classList.remove('visible'); }

function showError(title, message) {
  errorTitle.textContent = title;
  errorMsg.textContent = message;
  errorSec.classList.add('visible');
  setTimeout(() => errorSec.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
}

function hideError() { errorSec.classList.remove('visible'); }

/* ── Copy to clipboard ─────────────────────────────── */
btnCopy.addEventListener('click', async () => {
  const text = summaryEl.textContent;
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    btnCopy.classList.add('copied');
    btnCopy.innerHTML = '<span>✓</span> Copied!';
    showToast('Summary copied to clipboard!');
    setTimeout(() => {
      btnCopy.classList.remove('copied');
      btnCopy.innerHTML = '<span>⎘</span> Copy';
    }, 2500);
  } catch {
    showToast('⚠ Could not copy — please select and copy manually.');
  }
});

/* ── Toast ─────────────────────────────────────────── */
let toastTimer;
function showToast(message) {
  toastMsg.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2800);
}
