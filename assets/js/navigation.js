/* ============================================
   THE ASYLUM — Navigation Controller
   Mobile menu and navigation functionality
   ============================================ */

function navigationController() {
  return {
    isOpen: false,
    
    init() {
      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
      
      // Close menu on resize to desktop
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && this.isOpen) {
          this.close();
        }
      });
    },
    
    toggle() {
      this.isOpen ? this.close() : this.open();
    },
    
    open() {
      this.isOpen = true;
      document.body.style.overflow = 'hidden';
      
      // Focus first link in menu
      this.$nextTick(() => {
        const firstLink = document.querySelector('.nav-mobile__link');
        if (firstLink) firstLink.focus();
      });
    },
    
    close() {
      this.isOpen = false;
      document.body.style.overflow = '';
      
      // Return focus to toggle button
      const toggle = document.querySelector('.nav-toggle');
      if (toggle) toggle.focus();
    }
  };
}

// Make available globally for Alpine.js
window.navigationController = navigationController;
