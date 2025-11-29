/* ============================================
   THE ASYLUM — Main JavaScript
   Core functionality and utilities
   ============================================ */

// Storage keys
const STORAGE_KEYS = {
  HAS_VISITED: 'asylum_has_visited',
  VISIT_COUNT: 'asylum_visit_count',
  FIRST_VISIT: 'asylum_first_visit',
  LAST_VISIT: 'asylum_last_visit',
  THEME: 'asylum_theme',
  REDUCED_MOTION: 'asylum_reduced_motion',
  PARTICLES: 'asylum_particles',
  BOOKMARKS: 'asylum_bookmarks',
};

// Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Safe localStorage access
function getStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn('localStorage not available:', e);
    return null;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn('localStorage not available:', e);
  }
}

// Track visits
function trackVisit() {
  const now = new Date().toISOString();
  const visitCount = parseInt(getStorage(STORAGE_KEYS.VISIT_COUNT) || '0', 10);
  
  if (!getStorage(STORAGE_KEYS.FIRST_VISIT)) {
    setStorage(STORAGE_KEYS.FIRST_VISIT, now);
  }
  
  setStorage(STORAGE_KEYS.LAST_VISIT, now);
  setStorage(STORAGE_KEYS.VISIT_COUNT, String(visitCount + 1));
}

// Check if returning visitor
function isReturningVisitor() {
  return getStorage(STORAGE_KEYS.HAS_VISITED) === 'true';
}

// Mark as visited
function markAsVisited() {
  setStorage(STORAGE_KEYS.HAS_VISITED, 'true');
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  trackVisit();
  
  // Remove no-js class if present
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');
});

// Export for use in other modules
window.Asylum = {
  STORAGE_KEYS,
  prefersReducedMotion,
  getStorage,
  setStorage,
  isReturningVisitor,
  markAsVisited,
  trackVisit,
};
