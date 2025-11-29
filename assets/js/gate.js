/* ============================================
   THE ASYLUM — Gate Animation Controller
   The signature entrance experience
   ============================================ */

/**
 * Gate Animation Controller
 * Manages the entrance gate animation sequence
 * 
 * Timeline (first-time visitor):
 * 0-0.5s    - Void with floating particles
 * 0.5-1.5s  - Gates fade in from darkness
 * 1.5-2s    - Pause, skip button appears
 * 2-3.5s    - Gates swing open
 * 3.5-5s    - "Welcome to the Asylum" typewriter
 * 5-5.5s    - Hold
 * 5.5-6.5s  - Transition to main site
 * 
 * Returning visitors: Abbreviated 1.5s version
 * Reduced motion: Skip directly to main site
 */

function gateController() {
  return {
    // State machine
    state: 'init', // init, void, reveal, pause, opening, typing, hold, complete
    
    // UI states
    showSkip: false,
    gatesVisible: false,
    gatesOpening: false,
    welcomeVisible: false,
    welcomeTyping: false,
    
    // Timers
    timers: [],
    
    // Initialize
    init() {
      // Check for reduced motion preference
      if (window.Asylum?.prefersReducedMotion()) {
        this.skipToComplete();
        return;
      }
      
      // Check for returning visitor
      if (window.Asylum?.isReturningVisitor()) {
        this.runAbbreviatedSequence();
        return;
      }
      
      // First-time visitor: full sequence
      this.runFullSequence();
      
      // Keyboard skip listeners
      this.setupKeyboardListeners();
    },
    
    // Full animation sequence for first-time visitors
    runFullSequence() {
      this.state = 'void';
      
      // Phase 1: Void (0-0.5s) - particles already animating via CSS
      this.addTimer(() => {
        this.state = 'reveal';
        this.gatesVisible = true;
      }, 500);
      
      // Phase 2: Gates visible (0.5-1.5s)
      // Phase 3: Pause (1.5-2s) - show skip button
      this.addTimer(() => {
        this.state = 'pause';
        this.showSkip = true;
      }, 1500);
      
      // Phase 4: Gates open (2-3.5s)
      this.addTimer(() => {
        this.state = 'opening';
        this.gatesOpening = true;
      }, 2000);
      
      // Phase 5: Welcome text (3.5-5s)
      this.addTimer(() => {
        this.state = 'typing';
        this.welcomeVisible = true;
        this.welcomeTyping = true;
      }, 3500);
      
      // Phase 6: Hold (5-5.5s)
      this.addTimer(() => {
        this.state = 'hold';
      }, 5000);
      
      // Phase 7: Complete (5.5s+)
      this.addTimer(() => {
        this.complete();
      }, 5500);
    },
    
    // Abbreviated sequence for returning visitors
    runAbbreviatedSequence() {
      this.state = 'reveal';
      this.gatesVisible = true;
      this.showSkip = true;
      
      // Quick gate open
      this.addTimer(() => {
        this.state = 'opening';
        this.gatesOpening = true;
      }, 300);
      
      // Brief welcome
      this.addTimer(() => {
        this.welcomeVisible = true;
      }, 800);
      
      // Complete
      this.addTimer(() => {
        this.complete();
      }, 1500);
    },
    
    // Skip to complete immediately
    skipToComplete() {
      this.clearTimers();
      this.complete();
    },
    
    // Skip button handler
    skip() {
      this.clearTimers();
      
      // Quick transition
      this.gatesOpening = true;
      this.welcomeVisible = true;
      
      this.addTimer(() => {
        this.complete();
      }, 500);
    },
    
    // Complete the gate sequence
    complete() {
      this.state = 'complete';
      this.showSkip = false;
      
      // Mark as visited
      if (window.Asylum?.markAsVisited) {
        window.Asylum.markAsVisited();
      }
      
      // Show header
      const header = document.querySelector('.site-header');
      if (header) {
        header.classList.add('visible');
      }
      
      // Show main content
      const main = document.querySelector('.main-content');
      if (main) {
        main.classList.add('visible');
      }
      
      // Dispatch custom event
      document.dispatchEvent(new CustomEvent('gate:complete'));
    },
    
    // Timer management
    addTimer(callback, delay) {
      const id = setTimeout(callback, delay);
      this.timers.push(id);
      return id;
    },
    
    clearTimers() {
      this.timers.forEach(id => clearTimeout(id));
      this.timers = [];
    },
    
    // Keyboard listeners
    setupKeyboardListeners() {
      const handleKeydown = (e) => {
        if (this.state === 'complete') {
          document.removeEventListener('keydown', handleKeydown);
          return;
        }
        
        if (['Escape', ' ', 'Enter'].includes(e.key)) {
          e.preventDefault();
          this.skip();
          document.removeEventListener('keydown', handleKeydown);
        }
      };
      
      document.addEventListener('keydown', handleKeydown);
    },
    
    // Cleanup on destroy
    destroy() {
      this.clearTimers();
    }
  };
}

// Make available globally for Alpine.js
window.gateController = gateController;
