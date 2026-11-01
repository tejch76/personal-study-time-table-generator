/* ═══════════════════════════════════════════════════════════
   StudyFlow – script.js
   Personal Study Timetable Generator
   Features: Dashboard, Manage Subjects (Modal Form), Timetable,
   Study Timer, Progress, LocalStorage Persistence.
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ═══════════════════════════════════════════════════════════
   1. APP STATE
═══════════════════════════════════════════════════════════ */
let APP = {
  subjects:  [],   // [{ id, name, color, priority, startTime, endTime, duration, breakDuration, hours }]
  timetable: { daily: [] }, // [{ id, type: 'session'|'break', subject, color, priority, start, end, duration, breakDuration, subjectId }]
  sessions:  [],   // Completed focus sessions [{ id, date, subject, duration, mode }]
  settings: {
    pomoWork:  25,
    pomoShort: 5,
    pomoLong:  15,
  },
  timer: {
    interval:      null,
    mode:          'work', // 'work' | 'shortBreak' | 'longBreak'
    timeLeft:      25 * 60,
    totalSeconds:  25 * 60,
    isRunning:     false,
    sessionCount:  0,
    totalSessions: 4,
  },
  timetableMode: 'table', // 'table' | 'daily'
  theme:         'light',
  quoteIndex:    0,
};

/* ═══════════════════════════════════════════════════════════
   2. LOCALSTORAGE PERSISTENCE
═══════════════════════════════════════════════════════════ */
const STORAGE_KEY = 'studyflow_v3';

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      subjects:  APP.subjects,
      timetable: APP.timetable,
      sessions:  APP.sessions,
      settings:  APP.settings,
      theme:     APP.theme,
    }));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

function loadState() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    // Backward compatibility with legacy storage keys to prevent data loss
    if (!raw) {
      raw = localStorage.getItem('studyflow_pro_v2') || localStorage.getItem('studyflow_pro');
    }
    if (!raw) return false;
    const d = JSON.parse(raw);
    if (d.subjects && Array.isArray(d.subjects)) APP.subjects = d.subjects;
    if (d.timetable && typeof d.timetable === 'object') APP.timetable = d.timetable;
    if (d.sessions && Array.isArray(d.sessions)) APP.sessions = d.sessions;
    if (d.settings) APP.settings = Object.assign(APP.settings, d.settings);
    if (d.theme) APP.theme = d.theme;
    return true;
  } catch (e) {
    console.warn('LocalStorage load failed:', e);
    return false;
  }
}

/* ═══════════════════════════════════════════════════════════
   3. UTILITIES & TIME HELPERS
═══════════════════════════════════════════════════════════ */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function timeToMins(t) {
  if (!t) return 0;
  const parts = t.split(':').map(Number);
  return (parts[0] || 0) * 60 + (parts[1] || 0);
}

function minsToTime(total) {
  total = Math.max(0, Math.min(total, 23 * 60 + 59));
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatTime12(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function fmtDuration(mins) {
  if (!mins || mins <= 0) return '0 min';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  return h > 0 ? `${h}h` : `${m}m`;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getDateStr(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setInner(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function getVal(id) { return document.getElementById(id)?.value || ''; }
function setVal(id, val) { const el = document.getElementById(id); if (el) el.value = val; }

function hexRgba(hex, alpha) {
  if (!hex || hex.length < 7) return `rgba(108,99,255,${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const PALETTE = ['#6c63ff', '#3b9eda', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
function getRandomColor() {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}

/* ═══════════════════════════════════════════════════════════
   4. TOAST NOTIFICATIONS
═══════════════════════════════════════════════════════════ */
function toast(msg, type = 'info', duration = 3000) {
  const icons = {
    success: 'fa-circle-check',
    error:   'fa-circle-xmark',
    info:    'fa-circle-info',
    warning: 'fa-triangle-exclamation'
  };
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<i class="fas ${icons[type] || 'fa-circle-info'}"></i><span>${msg}</span>`;
  container.appendChild(el);
  setTimeout(() => {
    el.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => el.remove(), 300);
  }, duration);
}

/* ═══════════════════════════════════════════════════════════
   5. MODAL SYSTEM
═══════════════════════════════════════════════════════════ */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

let _confirmCb = null;
function confirmAction(message, cb, okLabel = 'Confirm') {
  const msgEl = document.getElementById('confirm-message');
  const okBtn = document.getElementById('confirm-ok-btn');
  if (msgEl) msgEl.textContent = message;
  if (okBtn) okBtn.textContent = okLabel;
  _confirmCb = cb;
  openModal('confirm-modal');
}

/* ═══════════════════════════════════════════════════════════
   6. NAVIGATION (FIXED: NEVER HIDES CONTENT PERMANENTLY)
═══════════════════════════════════════════════════════════ */
function switchSection(sectionId) {
  // 1. Hide all page sections cleanly
  document.querySelectorAll('.page-section').forEach(el => {
    el.classList.remove('active-page');
    el.classList.remove('hidden'); // Guarantee no lingering hidden class
    el.style.display = 'none';
  });

  // 2. Remove active state from all sidebar nav links
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

  // 3. Show target section
  const target = document.getElementById(`section-${sectionId}`);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('active-page');
    target.style.display = 'block';
  } else {
    console.error(`Section not found: section-${sectionId}`);
  }

  // 4. Highlight active nav item
  const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
  if (navItem) navItem.classList.add('active');

  // 5. Trigger section-specific re-renders
  if (sectionId === 'dashboard')  renderDashboard();
  if (sectionId === 'subjects')   renderSubjects();
  if (sectionId === 'timetable')  renderTimetableDisplay();
  if (sectionId === 'timer')      renderTimerSubjectSelect();
  if (sectionId === 'progress')   renderProgress();

  // Close mobile sidebar if open
  closeSidebar();
}

/* ═══════════════════════════════════════════════════════════
   7. MOBILE SIDEBAR DRAWER
═══════════════════════════════════════════════════════════ */
function openSidebar() {
  document.getElementById('sidebar')?.classList.add('open');
  const ov = document.getElementById('sidebar-overlay');
  if (ov) {
    ov.classList.remove('hidden');
    ov.classList.add('visible');
  }
}

function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  const ov = document.getElementById('sidebar-overlay');
  if (ov) {
    ov.classList.add('hidden');
    ov.classList.remove('visible');
  }
}

/* ═══════════════════════════════════════════════════════════
   8. THEME TOGGLE (DARK / LIGHT MODE)
═══════════════════════════════════════════════════════════ */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  APP.theme = theme;
  const icon1 = document.getElementById('theme-icon');
  const icon2 = document.getElementById('theme-icon-top');
  const label = document.getElementById('theme-label');
  if (theme === 'dark') {
    if (icon1) icon1.className = 'fas fa-sun';
    if (icon2) icon2.className = 'fas fa-sun';
    if (label) label.textContent = 'Light Mode';
  } else {
    if (icon1) icon1.className = 'fas fa-moon';
    if (icon2) icon2.className = 'fas fa-moon';
    if (label) label.textContent = 'Dark Mode';
  }
  saveState();
}

function toggleTheme() {
  applyTheme(APP.theme === 'light' ? 'dark' : 'light');
}

/* ═══════════════════════════════════════════════════════════
   9. LIVE CLOCK & DATE
═══════════════════════════════════════════════════════════ */
function updateClock() {
  const now = new Date();
  const timeEl = document.getElementById('live-time');
  const dateEl = document.getElementById('live-date');
  if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-US', { hour12: true });
  if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'
  });
}

/* ═══════════════════════════════════════════════════════════
   10. MOTIVATIONAL QUOTES
═══════════════════════════════════════════════════════════ */
const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Genius is 1% inspiration and 99% perspiration.", author: "Thomas Edison" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Small steps every day lead to big results over time.", author: "Anonymous" },
];

function renderQuote(randomize = false) {
  if (randomize) APP.quoteIndex = Math.floor(Math.random() * QUOTES.length);
  const q = QUOTES[APP.quoteIndex % QUOTES.length];
  const el   = document.getElementById('daily-quote');
  const auth = document.getElementById('quote-author');
  if (el)   el.textContent   = `"${q.text}"`;
  if (auth) auth.textContent = `— ${q.author}`;
}

/* ═══════════════════════════════════════════════════════════
   11. DASHBOARD
═══════════════════════════════════════════════════════════ */
function renderDashboard() {
  renderGreeting();
  renderDashboardStats();
  renderProgressBar();
  renderUpcomingSessions();
  renderQuote();
}

function renderGreeting() {
  const hour = new Date().getHours();
  let g = 'Good Morning';
  if (hour >= 12 && hour < 17) g = 'Good Afternoon';
  else if (hour >= 17)         g = 'Good Evening';
  const emojis = ['👋', '☀️', '🌟', '💪', '🎯'];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  setInner('greeting-text', `${g}! ${emoji}`);
  setInner('greeting-sub', 'Ready to crush your study goals today?');
}

function renderDashboardStats() {
  setInner('stat-subjects', APP.subjects.length);
  const totalHours = APP.subjects.reduce((a, s) => a + (parseFloat(s.hours) || 0), 0);
  setInner('stat-hours', `${totalHours.toFixed(1)}h`);
  const today = todayStr();
  const todaySess = APP.sessions.filter(s => s.date === today && s.mode === 'work').length;
  setInner('stat-sessions', todaySess);
  setInner('stat-streak', calculateStreak());
}

function renderProgressBar() {
  const today = todayStr();
  const todayMins = APP.sessions
    .filter(s => s.date === today && s.mode === 'work')
    .reduce((a, s) => a + (s.duration || 0), 0);
  const plannedMins = APP.subjects.reduce((a, s) => a + (parseFloat(s.hours) || 0) * 60, 0);
  const pct = plannedMins > 0 ? Math.min(100, Math.round((todayMins / plannedMins) * 100)) : 0;

  const bar = document.getElementById('daily-progress-bar');
  const pctEl = document.getElementById('progress-pct');
  if (bar) bar.style.width = `${pct}%`;
  if (pctEl) pctEl.textContent = `${pct}%`;
  setInner('progress-done', `${fmtDuration(todayMins)} done`);
  setInner('progress-total', `of ${fmtDuration(plannedMins)} planned`);
}

function renderUpcomingSessions() {
  const list = document.getElementById('upcoming-sessions-list');
  if (!list) return;
  const daily = APP.timetable.daily || [];
  const sessions = daily.filter(e => e.type === 'session').slice(0, 5);
  if (sessions.length === 0) {
    list.innerHTML = '<div class="empty-mini">Generate a timetable to see sessions here</div>';
    return;
  }
  list.innerHTML = sessions.map(s => `
    <div class="session-mini">
      <div class="session-mini-dot" style="background:${s.color}"></div>
      <div class="session-mini-info">
        <div class="session-mini-name">${escHtml(s.subject)}</div>
        <div class="session-mini-time">${formatTime12(s.start)} – ${formatTime12(s.end)}</div>
      </div>
      <span class="session-mini-badge" style="background:${s.color}22;color:${s.color}">
        ${fmtDuration(s.duration)}
      </span>
    </div>`).join('');
}

/* ═══════════════════════════════════════════════════════════
   12. SUBJECTS MANAGEMENT (MODAL POPUP & CRUD)
═══════════════════════════════════════════════════════════ */

/* ── Overlap Checking ── */
function checkOverlap(candidateStart, candidateEnd, ignoreId = null) {
  const cS = timeToMins(candidateStart);
  const cE = timeToMins(candidateEnd);
  for (const s of APP.subjects) {
    if (ignoreId && s.id === ignoreId) continue;
    if (!s.startTime || !s.endTime) continue;
    const sS = timeToMins(s.startTime);
    const sE = timeToMins(s.endTime);
    // Overlap condition: cS < sE && sS < cE
    if (cS < sE && sS < cE) {
      return `Timing overlap with "${s.name}" (${formatTime12(s.startTime)} – ${formatTime12(s.endTime)}). Please choose a different timing.`;
    }
  }
  return null;
}

function getNextAvailableStartTime() {
  if (!APP.subjects || APP.subjects.length === 0) return '09:00';
  const ends = APP.subjects
    .filter(s => s.endTime)
    .map(s => timeToMins(s.endTime) + (s.breakDuration || 10))
    .sort((a, b) => b - a);
  if (ends.length === 0) return '09:00';
  const latest = ends[0];
  if (latest + 60 > 23 * 60) return '08:00';
  return minsToTime(latest);
}

function showModalError(msg) {
  const el = document.getElementById('subject-modal-error');
  if (el) {
    el.textContent = msg;
    el.classList.remove('hidden');
  }
}

function clearModalError() {
  const el = document.getElementById('subject-modal-error');
  if (el) {
    el.textContent = '';
    el.classList.add('hidden');
  }
}

function openAddSubjectModal() {
  setVal('modal-sub-id', '');
  setVal('modal-sub-name', '');
  setVal('modal-sub-priority', 'Medium');

  const color = getRandomColor();
  setVal('modal-sub-color', color);
  const colorPrev = document.getElementById('modal-sub-color-preview');
  if (colorPrev) colorPrev.textContent = color;

  const nextStart = getNextAvailableStartTime();
  setVal('modal-sub-start', nextStart);
  setVal('modal-sub-end', minsToTime(timeToMins(nextStart) + 90));
  setVal('modal-sub-duration', '90');
  setVal('modal-sub-break', '10');

  setInner('subject-modal-title', '<i class="fas fa-book-open"></i> Add Subject');
  setInner('modal-save-btn-text', 'Save Subject');

  clearModalError();
  openModal('subject-modal');
  setTimeout(() => document.getElementById('modal-sub-name')?.focus(), 150);
}

function openEditSubjectModal(id) {
  const sub = APP.subjects.find(s => s.id === id);
  if (!sub) {
    toast('Subject not found.', 'error');
    return;
  }

  setVal('modal-sub-id', sub.id);
  setVal('modal-sub-name', sub.name);
  setVal('modal-sub-start', sub.startTime || '09:00');
  setVal('modal-sub-end', sub.endTime || '10:30');
  const dur = sub.duration || (timeToMins(sub.endTime) - timeToMins(sub.startTime)) || 90;
  setVal('modal-sub-duration', dur);
  setVal('modal-sub-break', sub.breakDuration !== undefined ? sub.breakDuration : 10);
  setVal('modal-sub-priority', sub.priority || 'Medium');
  setVal('modal-sub-color', sub.color || '#6c63ff');
  const colorPrev = document.getElementById('modal-sub-color-preview');
  if (colorPrev) colorPrev.textContent = sub.color || '#6c63ff';

  setInner('subject-modal-title', '<i class="fas fa-pen"></i> Edit Subject');
  setInner('modal-save-btn-text', 'Save Changes');

  clearModalError();
  openModal('subject-modal');
  setTimeout(() => document.getElementById('modal-sub-name')?.focus(), 150);
}

function saveSubjectFromModal() {
  clearModalError();

  const id       = getVal('modal-sub-id').trim();
  const name     = getVal('modal-sub-name').trim();
  const start    = getVal('modal-sub-start');
  const end      = getVal('modal-sub-end');
  let   duration = parseInt(getVal('modal-sub-duration'));
  const breakDur = parseInt(getVal('modal-sub-break')) || 0;
  const priority = getVal('modal-sub-priority') || 'Medium';
  const color    = getVal('modal-sub-color') || '#6c63ff';

  // 1. Validation
  if (!name) {
    showModalError('Please enter a subject name.');
    document.getElementById('modal-sub-name')?.focus();
    return;
  }
  if (name.length > 50) {
    showModalError('Subject name must be 50 characters or less.');
    return;
  }
  if (!start) {
    showModalError('Please select a start time.');
    return;
  }
  if (!end) {
    showModalError('Please select an end time.');
    return;
  }

  const sMin = timeToMins(start);
  const eMin = timeToMins(end);
  if (eMin <= sMin) {
    showModalError('End time must be later than start time.');
    return;
  }

  if (isNaN(duration) || duration <= 0) {
    duration = eMin - sMin;
  }
  if (duration < 5) {
    showModalError('Study duration must be at least 5 minutes.');
    return;
  }

  // 2. Duplicate Name Check
  const dup = APP.subjects.find(s => s.name.toLowerCase() === name.toLowerCase() && s.id !== id);
  if (dup) {
    showModalError(`A subject named "${name}" already exists. Please choose a different name.`);
    return;
  }

  // 3. Timing Overlap Check
  const overlapError = checkOverlap(start, end, id || null);
  if (overlapError) {
    showModalError(overlapError);
    return;
  }

  const hours = parseFloat((duration / 60).toFixed(2));

  // 4. Save or Update
  if (id) {
    const idx = APP.subjects.findIndex(s => s.id === id);
    if (idx !== -1) {
      APP.subjects[idx] = {
        ...APP.subjects[idx],
        name, color, priority,
        startTime: start, endTime: end,
        duration, breakDuration: breakDur, hours
      };
      // Update linked timetable entry if present
      if (APP.timetable.daily) {
        APP.timetable.daily = APP.timetable.daily.map(entry => {
          if (entry.type === 'session' && (entry.subjectId === id || entry.subject === name)) {
            return { ...entry, subject: name, color, priority, start, end, duration, breakDuration: breakDur };
          }
          return entry;
        });
      }
      toast(`Subject "${name}" updated successfully! ✅`, 'success');
    }
  } else {
    APP.subjects.push({
      id: uid(),
      name, color, priority,
      startTime: start, endTime: end,
      duration, breakDuration: breakDur, hours
    });
    toast(`Subject "${name}" added successfully! 🎉`, 'success');
  }

  // 5. Commit state & re-render
  saveState();
  closeModal('subject-modal');
  renderSubjects();
  renderTimerSubjectSelect();
  renderDashboard();

  // If a timetable is already active, regenerate to keep in sync
  if (APP.timetable.daily && APP.timetable.daily.length > 0) {
    generateTimetable(false);
  }
}

function deleteSubject(id) {
  const sub = APP.subjects.find(s => s.id === id);
  if (!sub) return;

  confirmAction(`Are you sure you want to delete "${sub.name}"? This will also remove it from the timetable.`, () => {
    APP.subjects = APP.subjects.filter(s => s.id !== id);
    if (APP.timetable.daily) {
      APP.timetable.daily = APP.timetable.daily.filter(e => e.subjectId !== id && e.subject !== sub.name);
    }
    saveState();
    renderSubjects();
    renderTimerSubjectSelect();
    renderDashboard();
    renderTimetableDisplay();
    toast(`Subject "${sub.name}" deleted.`, 'info');
  }, 'Delete Subject');
}

function renderSubjects() {
  const grid  = document.getElementById('subjects-grid');
  const empty = document.getElementById('subjects-empty');
  const count = document.getElementById('subjects-count');
  if (!grid) return;

  const search = (getVal('subject-search') || '').toLowerCase().trim();
  let subs = [...APP.subjects];
  if (search) subs = subs.filter(s => s.name.toLowerCase().includes(search));

  if (count) count.textContent = APP.subjects.length;

  // Clear existing rendered cards (keep empty state container)
  grid.querySelectorAll('.subject-card').forEach(c => c.remove());

  if (subs.length === 0) {
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  const prioMap = { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' };

  subs.forEach(sub => {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.style.setProperty('--subject-color', sub.color || 'var(--primary)');

    const timingHtml = (sub.startTime && sub.endTime) ? `
      <div class="subject-card-timing">
        <span class="timing-pill"><i class="fas fa-clock"></i> ${formatTime12(sub.startTime)} – ${formatTime12(sub.endTime)}</span>
        <span class="timing-pill"><i class="fas fa-stopwatch"></i> ${sub.duration || Math.round((sub.hours || 1) * 60)} min</span>
        ${sub.breakDuration > 0 ? `<span class="break-pill"><i class="fas fa-coffee"></i> ${sub.breakDuration}m break</span>` : ''}
      </div>` : '';

    card.innerHTML = `
      <div class="subject-card-top">
        <div class="subject-card-name-row">
          <div class="subject-color-dot" style="background:${sub.color}"></div>
          <div class="subject-name">${escHtml(sub.name)}</div>
        </div>
        <div class="subject-card-actions">
          <button class="btn-icon" data-action="edit-sub" data-id="${sub.id}" title="Edit Subject" type="button" aria-label="Edit Subject">
            <i class="fas fa-pen"></i>
          </button>
          <button class="btn-icon danger" data-action="del-sub" data-id="${sub.id}" title="Delete Subject" type="button" aria-label="Delete Subject">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      ${timingHtml}
      <div class="subject-card-badges">
        <span class="badge ${prioMap[sub.priority] || 'badge-medium'}"><i class="fas fa-flag"></i> ${sub.priority} Priority</span>
        <span class="badge" style="background:var(--blue-light);color:var(--blue)"><i class="fas fa-hourglass"></i> ${sub.hours || '1.5'}h/day</span>
      </div>`;
    grid.appendChild(card);
  });
}

/* ═══════════════════════════════════════════════════════════
   13. TIMETABLE GENERATOR & RESET
═══════════════════════════════════════════════════════════ */
function generateTimetable(showToast = true) {
  const errEl = document.getElementById('tt-error-msg');
  if (errEl) errEl.classList.add('hidden');

  if (!APP.subjects || APP.subjects.length === 0) {
    if (errEl) {
      errEl.textContent = 'Add at least one subject with timings before generating a timetable.';
      errEl.classList.remove('hidden');
    }
    toast('Please add subjects first.', 'warning');
    return;
  }

  // 1. Check for overlapping timings
  for (let i = 0; i < APP.subjects.length; i++) {
    for (let j = i + 1; j < APP.subjects.length; j++) {
      const a = APP.subjects[i], b = APP.subjects[j];
      if (a.startTime && a.endTime && b.startTime && b.endTime) {
        const aS = timeToMins(a.startTime), aE = timeToMins(a.endTime);
        const bS = timeToMins(b.startTime), bE = timeToMins(b.endTime);
        if (aS < bE && bS < aE) {
          const msg = `Timing Overlap Detected: "${a.name}" (${formatTime12(a.startTime)}–${formatTime12(a.endTime)}) overlaps with "${b.name}" (${formatTime12(b.startTime)}–${formatTime12(b.endTime)}). Please adjust their timings.`;
          if (errEl) { errEl.textContent = msg; errEl.classList.remove('hidden'); }
          toast('Overlapping timings found! Please adjust timings.', 'error', 5000);
          return;
        }
      }
    }
  }

  // 2. Sort subjects chronologically by startTime
  const sorted = [...APP.subjects].sort((a, b) => timeToMins(a.startTime) - timeToMins(b.startTime));

  const entries = [];
  sorted.forEach((sub, idx) => {
    const start    = sub.startTime;
    const end      = sub.endTime;
    const duration = sub.duration || (timeToMins(end) - timeToMins(start));
    const breakDur = sub.breakDuration !== undefined ? sub.breakDuration : 10;

    entries.push({
      id: uid(),
      type: 'session',
      subject: sub.name,
      color: sub.color || '#6c63ff',
      priority: sub.priority || 'Medium',
      start,
      end,
      duration,
      breakDuration: breakDur,
      subjectId: sub.id,
    });

    // Add rest break between sessions if applicable
    if (idx < sorted.length - 1 && breakDur > 0) {
      const nextSub = sorted[idx + 1];
      const curEndMin  = timeToMins(end);
      const nextStMin  = timeToMins(nextSub.startTime);
      const gapMins    = nextStMin - curEndMin;
      const actualBreak = Math.min(breakDur, gapMins > 0 ? gapMins : 0);
      if (actualBreak > 0) {
        entries.push({
          id: uid(),
          type: 'break',
          start: minsToTime(curEndMin),
          end:   minsToTime(curEndMin + actualBreak),
          duration: actualBreak,
        });
      }
    }
  });

  APP.timetable.daily = entries;
  saveState();
  renderTimetableDisplay();
  renderDashboard();
  if (showToast) toast('Timetable generated successfully! 🎉', 'success');
}

function resetTimetable() {
  confirmAction('Are you sure you want to clear the timetable? Your subjects will remain saved.', () => {
    APP.timetable.daily = [];
    saveState();
    renderTimetableDisplay();
    renderDashboard();
    toast('Timetable cleared.', 'info');
  }, 'Clear Timetable');
}

/* ═══════════════════════════════════════════════════════════
   14. TIMETABLE DISPLAY
═══════════════════════════════════════════════════════════ */
function renderTimetableDisplay() {
  const container = document.getElementById('timetable-display');
  if (!container) return;
  if (APP.timetableMode === 'table') {
    renderTableView(container);
  } else {
    renderTimelineView(container);
  }
}

function renderTableView(container) {
  const entries  = APP.timetable.daily || [];
  const sessions = entries.filter(e => e.type === 'session');

  if (sessions.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-calendar-xmark"></i>
        <h3>No timetable generated yet</h3>
        <p>Go to <strong>Subjects</strong>, add your subjects with timings, then click <strong>Generate Timetable</strong></p>
        <button class="btn-primary" id="tt-goto-sub-btn" type="button">
          <i class="fas fa-book-open"></i> Go to Subjects
        </button>
      </div>`;
    document.getElementById('tt-goto-sub-btn')?.addEventListener('click', () => switchSection('subjects'));
    return;
  }

  const totalStudy  = sessions.reduce((a, s) => a + (s.duration || 0), 0);
  const totalBreaks = entries.filter(e => e.type === 'break').reduce((a, b) => a + (b.duration || 0), 0);

  const prioMap = {
    High:   '<span class="badge badge-high"><i class="fas fa-flag"></i> High</span>',
    Medium: '<span class="badge badge-medium"><i class="fas fa-flag"></i> Medium</span>',
    Low:    '<span class="badge badge-low"><i class="fas fa-flag"></i> Low</span>',
  };

  let rows = '';
  let idx  = 1;
  entries.forEach(item => {
    if (item.type === 'session') {
      const brkStr = item.breakDuration > 0
        ? `<span class="tt-break-badge"><i class="fas fa-coffee"></i> ${item.breakDuration}m</span>`
        : '<span style="color:var(--text-muted);font-size:0.75rem">—</span>';
      rows += `
        <tr>
          <td><strong style="color:var(--text-muted);font-size:0.82rem;">#${idx++}</strong></td>
          <td>
            <div class="tt-sub-cell">
              <div class="tt-sub-color-pill" style="background:${item.color}"></div>
              <span class="tt-sub-name-strong">${escHtml(item.subject)}</span>
            </div>
          </td>
          <td>${prioMap[item.priority] || prioMap['Medium']}</td>
          <td>
            <div class="tt-time-cell">
              <span class="tt-time-main">${formatTime12(item.start)}</span>
              <span class="tt-time-sub">${item.start}</span>
            </div>
          </td>
          <td>
            <div class="tt-time-cell">
              <span class="tt-time-main">${formatTime12(item.end)}</span>
              <span class="tt-time-sub">${item.end}</span>
            </div>
          </td>
          <td><span class="tt-duration-badge"><i class="fas fa-stopwatch"></i> ${fmtDuration(item.duration)}</span></td>
          <td>${brkStr}</td>
          <td>
            <div style="display:flex;gap:6px;">
              <button class="btn-icon" onclick="openEditSubjectModal('${item.subjectId || ''}')" title="Edit Subject Timings" type="button">
                <i class="fas fa-pen"></i>
              </button>
              <button class="btn-icon danger" onclick="deleteSessionEntry('${item.id}')" title="Remove from Timetable" type="button">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>`;
    } else {
      rows += `
        <tr class="break-row">
          <td colspan="8">
            <span><i class="fas fa-coffee"></i> <strong>Break:</strong> ${formatTime12(item.start)} – ${formatTime12(item.end)} (${item.duration} min rest)</span>
          </td>
        </tr>`;
    }
  });

  container.innerHTML = `
    <div class="timetable-card-clean">
      <div class="timetable-table-header">
        <div class="table-title">
          <i class="fas fa-table-list"></i>
          <h3>Daily Study Schedule</h3>
          <span class="badge" style="background:var(--primary-light);color:var(--primary)">${sessions.length} sessions</span>
        </div>
        <div class="table-quick-stats">
          <span><i class="fas fa-book-open"></i> Study Time: <strong>${fmtDuration(totalStudy)}</strong></span>
          <span><i class="fas fa-mug-hot"></i> Breaks: <strong>${fmtDuration(totalBreaks)}</strong></span>
        </div>
      </div>
      <div class="timetable-table-responsive">
        <table class="clean-timetable-table">
          <thead>
            <tr>
              <th style="width:42px">#</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Duration</th>
              <th>Break After</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="table-footer-summary">
        <span>Showing <strong>${sessions.length} study sessions</strong> totaling <strong>${fmtDuration(totalStudy + totalBreaks)}</strong></span>
        <div style="display:flex;gap:10px;">
          <button class="btn-outline btn-sm" onclick="window.print()" type="button"><i class="fas fa-print"></i> Print</button>
          <button class="btn-primary btn-sm" onclick="generateTimetable(true)" type="button"><i class="fas fa-rotate"></i> Refresh</button>
        </div>
      </div>
    </div>`;
}

function renderTimelineView(container) {
  const entries = APP.timetable.daily || [];
  if (entries.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-calendar-xmark"></i>
        <h3>No timetable generated yet</h3>
        <p>Add subjects and click <strong>Generate Timetable</strong></p>
      </div>`;
    return;
  }

  const wrap = document.createElement('div');
  wrap.className = 'card';
  const timeline = document.createElement('div');
  timeline.className = 'daily-timeline';

  entries.forEach((entry, i) => {
    if (entry.type === 'session') {
      const row = document.createElement('div');
      row.className = 'tt-session';
      row.innerHTML = `
        <div class="tt-time">
          <div class="tt-time-start">${formatTime12(entry.start)}</div>
          <div class="tt-time-end">${formatTime12(entry.end)}</div>
        </div>
        <div class="tt-dot-col">
          <div class="tt-dot" style="color:${entry.color}"></div>
          ${i < entries.length - 1 ? '<div class="tt-line"></div>' : ''}
        </div>
        <div class="tt-content" style="border-left-color:${entry.color};background:${hexRgba(entry.color, 0.06)}">
          <div class="tt-subject-name" style="color:${entry.color}">${escHtml(entry.subject)}</div>
          <div class="tt-meta">
            <span><i class="fas fa-clock"></i> ${fmtDuration(entry.duration)}</span>
            <span><i class="fas fa-play"></i> ${formatTime12(entry.start)}</span>
            <span><i class="fas fa-stop"></i> ${formatTime12(entry.end)}</span>
          </div>
        </div>`;
      timeline.appendChild(row);
    } else {
      const row = document.createElement('div');
      row.className = 'tt-break';
      row.innerHTML = `
        <div class="tt-break-spacer"></div>
        <div class="tt-break-dot-col"></div>
        <div class="tt-break-label"><i class="fas fa-mug-hot"></i> Break — ${entry.duration} min</div>`;
      timeline.appendChild(row);
    }
  });

  wrap.appendChild(timeline);
  container.innerHTML = '';
  container.appendChild(wrap);
}

window.deleteSessionEntry = function(sessionId) {
  APP.timetable.daily = (APP.timetable.daily || []).filter(e => e.id !== sessionId);
  saveState();
  renderTimetableDisplay();
  renderDashboard();
  toast('Session removed from timetable.', 'info');
};

/* ═══════════════════════════════════════════════════════════
   15. STUDY TIMER (POMODORO)
═══════════════════════════════════════════════════════════ */
const TIMER_DURATIONS = {
  work:       () => (APP.settings.pomoWork || 25) * 60,
  shortBreak: () => (APP.settings.pomoShort || 5) * 60,
  longBreak:  () => (APP.settings.pomoLong || 15) * 60,
};

function initTimer() {
  APP.timer.mode         = 'work';
  APP.timer.timeLeft     = TIMER_DURATIONS.work();
  APP.timer.totalSeconds = APP.timer.timeLeft;
  renderTimerDisplay();
  updateTimerStats();
}

function startTimer() {
  if (APP.timer.isRunning) return;
  APP.timer.isRunning = true;
  APP.timer.interval  = setInterval(tickTimer, 1000);
  const icon = document.getElementById('timer-play-icon');
  if (icon) icon.className = 'fas fa-pause';
}

function pauseTimer() {
  APP.timer.isRunning = false;
  clearInterval(APP.timer.interval);
  const icon = document.getElementById('timer-play-icon');
  if (icon) icon.className = 'fas fa-play';
}

function resetTimer() {
  pauseTimer();
  APP.timer.timeLeft     = TIMER_DURATIONS[APP.timer.mode]();
  APP.timer.totalSeconds = APP.timer.timeLeft;
  renderTimerDisplay();
}

function tickTimer() {
  if (APP.timer.timeLeft <= 0) {
    timerComplete();
    return;
  }
  APP.timer.timeLeft--;
  renderTimerDisplay();
}

function timerComplete() {
  pauseTimer();
  const mode = APP.timer.mode;

  if (mode === 'work') {
    const duration = APP.settings.pomoWork || 25;
    const subject  = document.getElementById('timer-subject-select')?.value || 'General Study';
    APP.sessions.push({
      id: uid(),
      date: todayStr(),
      subject,
      duration,
      mode: 'work'
    });
    APP.timer.sessionCount++;
    updateTimerStats();
    saveState();
    renderDashboardStats();
    renderProgressBar();
    toast(`🎉 Great job! Completed study session for ${subject}!`, 'success', 5000);
    updateSessionDots();

    if (APP.timer.sessionCount >= APP.timer.totalSessions) {
      APP.timer.sessionCount = 0;
      switchTimerMode('longBreak');
    } else {
      switchTimerMode('shortBreak');
    }
  } else {
    toast('Break over! Time to get back to studying. 💪', 'info', 3000);
    switchTimerMode('work');
  }
}

function switchTimerMode(mode) {
  pauseTimer();
  APP.timer.mode         = mode;
  APP.timer.timeLeft     = TIMER_DURATIONS[mode]();
  APP.timer.totalSeconds = APP.timer.timeLeft;

  document.querySelectorAll('.timer-mode-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === mode);
  });
  const labels = { work: 'Focus Time', shortBreak: 'Short Break', longBreak: 'Long Break' };
  setInner('timer-mode-label', labels[mode] || 'Focus Time');
  renderTimerDisplay();
}

function renderTimerDisplay() {
  const m = Math.floor(APP.timer.timeLeft / 60);
  const s = APP.timer.timeLeft % 60;
  setInner('timer-display', `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);

  const circumference = 2 * Math.PI * 96;
  const ring = document.getElementById('ring-progress');
  if (ring) {
    const fraction = APP.timer.timeLeft / (APP.timer.totalSeconds || 1);
    const offset   = circumference * (1 - fraction);
    ring.style.strokeDasharray  = `${circumference}`;
    ring.style.strokeDashoffset = `${offset}`;
    const colors = { work: 'var(--primary)', shortBreak: 'var(--success)', longBreak: 'var(--blue)' };
    ring.style.stroke = colors[APP.timer.mode] || 'var(--primary)';
  }
}

function updateSessionDots() {
  const dots = document.querySelectorAll('.session-dot');
  const num  = document.getElementById('timer-session-num');
  dots.forEach((dot, i) => {
    dot.classList.toggle('done', i < APP.timer.sessionCount);
  });
  if (num) num.textContent = Math.min(APP.timer.sessionCount + 1, APP.timer.totalSessions);
}

function updateTimerStats() {
  const today = todayStr();
  const todaySess = APP.sessions.filter(s => s.date === today && s.mode === 'work');
  setInner('ts-sessions', todaySess.length);
  setInner('ts-minutes', todaySess.reduce((a, s) => a + (s.duration || 0), 0));
}

function renderTimerSubjectSelect() {
  const sel = document.getElementById('timer-subject-select');
  if (!sel) return;
  const prev = sel.value;
  sel.innerHTML = '<option value="">— Select a subject —</option>';
  APP.subjects.forEach(sub => {
    sel.innerHTML += `<option value="${escHtml(sub.name)}">${escHtml(sub.name)}</option>`;
  });
  if (prev && APP.subjects.some(s => s.name === prev)) {
    sel.value = prev;
  }
}

function applyPomoSettings() {
  const w = parseInt(getVal('pomo-work'))  || 25;
  const s = parseInt(getVal('pomo-short')) || 5;
  const l = parseInt(getVal('pomo-long'))  || 15;
  if (w < 1 || w > 120) { toast('Study duration must be 1–120 min.', 'error'); return; }
  if (s < 1 || s > 60)  { toast('Short break must be 1–60 min.', 'error'); return; }
  if (l < 1 || l > 120) { toast('Long break must be 1–120 min.', 'error'); return; }
  APP.settings.pomoWork  = w;
  APP.settings.pomoShort = s;
  APP.settings.pomoLong  = l;
  saveState();
  resetTimer();
  toast('Timer settings updated! ✅', 'success');
}

/* ═══════════════════════════════════════════════════════════
   16. PROGRESS TRACKER
═══════════════════════════════════════════════════════════ */
function renderProgress() {
  renderProgressStats();
  renderSubjectProgress();
  renderStudyHistory();
  renderStreakCalendar();
}

function calculateStreak() {
  if (APP.sessions.length === 0) return 0;
  const dates = [...new Set(APP.sessions.filter(s => s.mode === 'work').map(s => s.date))].sort().reverse();
  if (dates.length === 0) return 0;
  let streak = 0;
  let check  = todayStr();
  for (const d of dates) {
    if (d === check) {
      streak++;
      const prev = new Date(check);
      prev.setDate(prev.getDate() - 1);
      check = prev.toISOString().slice(0, 10);
    } else break;
  }
  return streak;
}

function renderProgressStats() {
  const sessions  = APP.sessions.filter(s => s.mode === 'work');
  const totalMins = sessions.reduce((a, s) => a + (s.duration || 0), 0);

  const today     = todayStr();
  const todayMins = sessions.filter(s => s.date === today).reduce((a, s) => a + (s.duration || 0), 0);
  const planned   = APP.subjects.reduce((a, s) => a + parseFloat(s.hours || 0), 0);
  const rate      = planned > 0 ? Math.min(100, Math.round((todayMins / 60 / planned) * 100)) : 0;

  setInner('prog-total-time',     fmtDuration(totalMins));
  setInner('prog-total-sessions', sessions.length);
  setInner('prog-streak',         calculateStreak());
  setInner('prog-rate',           `${rate}%`);
  setInner('calendar-streak',     `🔥 ${calculateStreak()} day streak`);
}

function renderSubjectProgress() {
  const list = document.getElementById('subject-progress-list');
  if (!list) return;

  const tally = {};
  APP.sessions.filter(s => s.mode === 'work' && s.subject).forEach(s => {
    tally[s.subject] = (tally[s.subject] || 0) + (s.duration || 0);
  });

  const entries = Object.entries(tally);
  if (entries.length === 0) {
    list.innerHTML = '<div class="empty-mini">Complete study sessions using the timer to see subject progress here</div>';
    return;
  }

  const maxMins = Math.max(...Object.values(tally), 1);
  const subColors = {};
  APP.subjects.forEach(s => { subColors[s.name] = s.color; });

  list.innerHTML = entries
    .sort((a, b) => b[1] - a[1])
    .map(([name, mins]) => {
      const pct   = Math.round((mins / maxMins) * 100);
      const color = subColors[name] || '#6c63ff';
      return `
        <div class="subject-progress-row">
          <div class="subject-progress-dot" style="background:${color}"></div>
          <div class="subject-progress-name">${escHtml(name)}</div>
          <div class="subject-progress-bar-wrap">
            <div class="subject-progress-bar" style="width:${pct}%;background:${color}"></div>
          </div>
          <div class="subject-progress-time">${fmtDuration(mins)}</div>
        </div>`;
    }).join('');
}

function renderStudyHistory() {
  const list   = document.getElementById('study-history-list');
  const filter = getVal('history-filter');
  if (!list) return;

  const sessions = APP.sessions.filter(s => s.mode === 'work');

  let cutoff;
  if (filter === 'all') {
    cutoff = '2000-01-01';
  } else {
    const days = parseInt(filter) || 7;
    cutoff = getDateStr(-(days - 1));
  }

  const byDate = {};
  sessions.filter(s => s.date >= cutoff).forEach(s => {
    byDate[s.date] = (byDate[s.date] || 0) + (s.duration || 0);
  });

  const dates = Object.keys(byDate).sort().reverse();
  if (dates.length === 0) {
    list.innerHTML = '<div class="empty-mini">No sessions recorded yet. Start studying with the timer!</div>';
    return;
  }

  const maxMins = Math.max(...Object.values(byDate), 1);
  list.innerHTML = dates.map(d => {
    const mins = byDate[d];
    const pct  = Math.round((mins / maxMins) * 100);
    const dateDisplay = new Date(d + 'T12:00').toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric'
    });
    const sessionCount = sessions.filter(s => s.date === d).length;
    return `
      <div class="history-entry">
        <div class="history-date">${dateDisplay}</div>
        <div class="history-bar-wrap"><div class="history-bar" style="width:${pct}%"></div></div>
        <div class="history-time">${fmtDuration(mins)}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);min-width:64px;text-align:right">
          ${sessionCount} session${sessionCount !== 1 ? 's' : ''}
        </div>
      </div>`;
  }).join('');
}

function renderStreakCalendar() {
  const cal = document.getElementById('streak-calendar');
  if (!cal) return;

  const studiedDates = new Set(APP.sessions.filter(s => s.mode === 'work').map(s => s.date));
  const today = todayStr();
  const cells = [];

  ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach(d => {
    cells.push(`<div class="cal-day-label">${d}</div>`);
  });

  const firstDay = new Date();
  firstDay.setDate(firstDay.getDate() - 34);
  const startPad = firstDay.getDay();
  for (let p = 0; p < startPad; p++) cells.push('<div></div>');

  for (let i = 0; i < 35; i++) {
    const d  = new Date();
    d.setDate(d.getDate() - 34 + i);
    const ds = d.toISOString().slice(0, 10);
    const isToday   = ds === today;
    const isStudied = studiedDates.has(ds);
    cells.push(`<div class="cal-day ${isStudied ? 'studied' : ''} ${isToday ? 'today' : ''}" title="${ds}">${d.getDate()}</div>`);
  }

  cal.innerHTML = cells.join('');
}

/* ═══════════════════════════════════════════════════════════
   17. RESET ALL DATA
═══════════════════════════════════════════════════════════ */
function resetAll() {
  confirmAction('Are you sure you want to reset ALL data? This will clear all subjects, timetable, and study history. This action cannot be undone.', () => {
    APP.subjects  = [];
    APP.timetable = { daily: [] };
    APP.sessions  = [];
    saveState();
    renderSubjects();
    renderDashboard();
    renderTimerSubjectSelect();
    renderProgress();
    renderTimetableDisplay();
    switchSection('dashboard');
    toast('All data has been reset.', 'info');
  }, 'Reset All Data');
}

/* ═══════════════════════════════════════════════════════════
   18. MODAL LIVE SYNC LISTENERS
═══════════════════════════════════════════════════════════ */
function initModalListeners() {
  const startEl = document.getElementById('modal-sub-start');
  const endEl   = document.getElementById('modal-sub-end');
  const durEl   = document.getElementById('modal-sub-duration');
  const colEl   = document.getElementById('modal-sub-color');
  const prevEl  = document.getElementById('modal-sub-color-preview');

  function syncDur() {
    const s = startEl?.value, e = endEl?.value;
    if (s && e) {
      const diff = timeToMins(e) - timeToMins(s);
      if (diff > 0 && durEl) {
        durEl.value = diff;
        clearModalError();
      }
    }
  }

  startEl?.addEventListener('change', syncDur);
  endEl?.addEventListener('change', syncDur);

  durEl?.addEventListener('input', () => {
    const s = startEl?.value;
    const d = parseInt(durEl?.value);
    if (s && !isNaN(d) && d > 0 && endEl) {
      endEl.value = minsToTime(timeToMins(s) + d);
      clearModalError();
    }
  });

  colEl?.addEventListener('input', e => {
    if (prevEl) prevEl.textContent = e.target.value;
  });

  // Enter key inside subject name triggers save
  document.getElementById('modal-sub-name')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveSubjectFromModal();
    }
  });

  // Modal save button
  document.getElementById('modal-save-subject-btn')?.addEventListener('click', saveSubjectFromModal);
}

/* ═══════════════════════════════════════════════════════════
   19. GLOBAL EVENT DELEGATION
═══════════════════════════════════════════════════════════ */
document.addEventListener('click', function(e) {
  // 1. Data-action buttons (edit-sub, del-sub)
  const actionBtn = e.target.closest('[data-action]');
  if (actionBtn) {
    const { action, id } = actionBtn.dataset;
    if (action === 'edit-sub') openEditSubjectModal(id);
    if (action === 'del-sub')  deleteSubject(id);
    return;
  }

  // 2. Sidebar Navigation links
  const navItem = e.target.closest('.nav-item[data-section]');
  if (navItem) {
    e.preventDefault();
    switchSection(navItem.dataset.section);
    return;
  }

  // 3. Buttons that navigate with data-section (e.g., Quick Actions, View All)
  const secBtn = e.target.closest('[data-section]:not(.nav-item)');
  if (secBtn) {
    const sec = secBtn.dataset.section;
    if (sec) switchSection(sec);
    return;
  }

  // 4. Modal close buttons
  const closeBtn = e.target.closest('[data-close]');
  if (closeBtn) {
    closeModal(closeBtn.dataset.close);
    return;
  }

  // 5. Close modal by clicking backdrop overlay
  if (e.target.classList.contains('modal-overlay')) {
    closeModal(e.target.id);
    return;
  }
});

/* ═══════════════════════════════════════════════════════════
   20. DOM READY INITIALIZATION
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Load saved state from LocalStorage
  loadState();
  applyTheme(APP.theme);

  // 2. Initial render of all modules
  renderDashboard();
  renderSubjects();
  renderTimerSubjectSelect();
  initTimer();

  if (APP.timetable.daily && APP.timetable.daily.length > 0) {
    renderTimetableDisplay();
  }

  // 3. Live clock
  updateClock();
  setInterval(updateClock, 1000);

  // 4. Daily Quote
  APP.quoteIndex = new Date().getDate() % QUOTES.length;
  renderQuote();

  // 5. Explicit Button Event Listeners

  // Sidebar / Mobile Drawer
  document.getElementById('hamburger-btn')?.addEventListener('click', openSidebar);
  document.getElementById('sidebar-close-btn')?.addEventListener('click', closeSidebar);
  document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);

  // Theme toggles
  document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);
  document.getElementById('theme-toggle-icon')?.addEventListener('click', toggleTheme);

  // Reset All
  document.getElementById('reset-all-btn')?.addEventListener('click', resetAll);

  // Quotes
  document.getElementById('new-quote-btn')?.addEventListener('click', () => renderQuote(true));

  // Add Subject Buttons
  document.getElementById('add-subject-btn')?.addEventListener('click', openAddSubjectModal);
  document.getElementById('add-subject-empty-btn')?.addEventListener('click', openAddSubjectModal);
  document.getElementById('dash-add-subject-btn')?.addEventListener('click', () => {
    switchSection('subjects');
    openAddSubjectModal();
  });
  document.getElementById('dash-quick-add-sub')?.addEventListener('click', () => {
    switchSection('subjects');
    openAddSubjectModal();
  });

  // Subjects Search Filter
  document.getElementById('subject-search')?.addEventListener('input', renderSubjects);

  // Generate Timetable from Subjects Page
  document.getElementById('generate-from-subjects-btn')?.addEventListener('click', () => {
    generateTimetable(true);
    switchSection('timetable');
  });

  // Timetable Page Buttons
  document.getElementById('generate-btn')?.addEventListener('click', () => generateTimetable(true));
  document.getElementById('reset-tt-btn')?.addEventListener('click', resetTimetable);
  document.getElementById('print-btn')?.addEventListener('click', () => window.print());
  document.getElementById('tt-goto-subjects-btn')?.addEventListener('click', () => switchSection('subjects'));

  // Timetable View Tabs (Table / Timeline)
  document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn[data-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      APP.timetableMode = btn.dataset.tab;
      renderTimetableDisplay();
    });
  });

  // Timer Buttons
  document.getElementById('timer-start-btn')?.addEventListener('click', () => {
    if (APP.timer.isRunning) pauseTimer();
    else startTimer();
  });
  document.getElementById('timer-reset-btn')?.addEventListener('click', resetTimer);
  document.getElementById('timer-skip-btn')?.addEventListener('click', () => {
    const modes = ['work', 'shortBreak', 'longBreak'];
    const next  = modes[(modes.indexOf(APP.timer.mode) + 1) % modes.length];
    pauseTimer();
    switchTimerMode(next);
  });
  document.querySelectorAll('.timer-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      pauseTimer();
      switchTimerMode(btn.dataset.mode);
    });
  });
  document.getElementById('apply-pomo-btn')?.addEventListener('click', applyPomoSettings);

  // Progress History Filter
  document.getElementById('history-filter')?.addEventListener('change', renderStudyHistory);

  // Confirm Modal Button
  document.getElementById('confirm-ok-btn')?.addEventListener('click', () => {
    closeModal('confirm-modal');
    if (typeof _confirmCb === 'function') {
      _confirmCb();
      _confirmCb = null;
    }
  });

  // Initialize Modal input listeners
  initModalListeners();

  // Show default section
  switchSection('dashboard');

  console.log('✅ StudyFlow initialized successfully. All pages and buttons active.');
});

/* ── Window resize: redraw calendar/progress on window resize ── */
let _resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(() => {
    const active = document.querySelector('.page-section.active-page');
    if (active?.id === 'section-progress') renderProgress();
  }, 250);
});
