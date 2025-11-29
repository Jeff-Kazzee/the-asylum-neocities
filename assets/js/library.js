/* ============================================
   THE ASYLUM — Library Controller
   Resource filtering and display
   ============================================ */

function libraryController() {
  return {
    // State
    resources: [],
    categories: [],
    activeCategory: 'all',
    activePricing: 'all',
    searchQuery: '',
    loading: true,
    
    // Initialize
    async init() {
      await this.loadResources();
      this.loading = false;
    },
    
    // Load resources from JSON
    async loadResources() {
      try {
        const response = await fetch('../data/resources.json');
        const data = await response.json();
        this.resources = data.resources;
        this.categories = data.categories;
      } catch (error) {
        console.error('Failed to load resources:', error);
        // Fallback: resources are embedded in the page
        this.resources = window.ASYLUM_RESOURCES || [];
        this.categories = window.ASYLUM_CATEGORIES || [];
      }
    },
    
    // Filter resources
    get filteredResources() {
      return this.resources.filter(resource => {
        // Category filter
        if (this.activeCategory !== 'all' && resource.category !== this.activeCategory) {
          return false;
        }
        
        // Pricing filter
        if (this.activePricing !== 'all' && resource.pricing !== this.activePricing) {
          return false;
        }
        
        // Search filter
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase();
          const matchesName = resource.name.toLowerCase().includes(query);
          const matchesDescription = resource.description.toLowerCase().includes(query);
          if (!matchesName && !matchesDescription) {
            return false;
          }
        }
        
        return true;
      });
    },
    
    // Get resources by category
    getResourcesByCategory(categoryId) {
      return this.filteredResources.filter(r => r.category === categoryId);
    },
    
    // Get category info
    getCategory(categoryId) {
      return this.categories.find(c => c.id === categoryId);
    },
    
    // Count resources
    get resourceCount() {
      return this.filteredResources.length;
    },
    
    get totalCount() {
      return this.resources.length;
    },
    
    // Set filters
    setCategory(category) {
      this.activeCategory = category;
    },
    
    setPricing(pricing) {
      this.activePricing = pricing;
    },
    
    clearFilters() {
      this.activeCategory = 'all';
      this.activePricing = 'all';
      this.searchQuery = '';
    },
    
    // Get pricing badge class
    getPricingClass(pricing) {
      const classes = {
        free: 'resource-card__badge--free',
        freemium: 'resource-card__badge--freemium',
        paid: 'resource-card__badge--paid'
      };
      return classes[pricing] || '';
    },
    
    // Format pricing label
    getPricingLabel(pricing) {
      const labels = {
        free: 'Free',
        freemium: 'Freemium',
        paid: 'Paid'
      };
      return labels[pricing] || pricing;
    }
  };
}

// Make available globally
window.libraryController = libraryController;
