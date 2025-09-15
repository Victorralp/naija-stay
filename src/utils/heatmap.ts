// Simple heatmap tracking utility
// In a real application, this would integrate with tools like Hotjar, FullStory, or similar

interface HeatmapEvent {
  type: 'click' | 'scroll' | 'hover' | 'focus';
  x: number;
  y: number;
  timestamp: number;
  element?: string;
  url: string;
}

class HeatmapTracker {
  private events: HeatmapEvent[] = [];
  private isInitialized = false;

  // Initialize heatmap tracking
  init() {
    if (this.isInitialized) return;
    
    this.isInitialized = true;
    
    // Track clicks
    document.addEventListener('click', (e) => {
      this.trackEvent('click', e.clientX, e.clientY, e.target as HTMLElement);
    });
    
    // Track scrolls (throttled)
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackEvent('scroll', window.scrollX, window.scrollY);
      }, 100);
    });
    
    console.log('Heatmap tracking initialized');
  }

  // Track an event
  private trackEvent(
    type: HeatmapEvent['type'], 
    x: number, 
    y: number, 
    element?: HTMLElement
  ) {
    if (!this.isInitialized) return;
    
    const event: HeatmapEvent = {
      type,
      x,
      y,
      timestamp: Date.now(),
      url: window.location.href
    };
    
    if (element) {
      event.element = this.getElementSelector(element);
    }
    
    this.events.push(event);
    
    // Limit events to prevent memory issues
    if (this.events.length > 1000) {
      this.events = this.events.slice(-500);
    }
  }

  // Get a simple selector for an element
  private getElementSelector(element: HTMLElement): string {
    if (element.id) {
      return `#${element.id}`;
    }
    
    if (element.className) {
      return `.${element.className.split(' ').join('.')}`;
    }
    
    return element.tagName.toLowerCase();
  }

  // Get all tracked events
  getEvents(): HeatmapEvent[] {
    return [...this.events];
  }

  // Clear events
  clearEvents() {
    this.events = [];
  }

  // Send events to server (in a real app)
  sendEvents() {
    if (!this.isInitialized || this.events.length === 0) return;
    
    // In a real implementation, this would send to your analytics backend
    console.log(`Sending ${this.events.length} heatmap events`);
    console.log(this.events);
    
    // Clear events after sending
    this.clearEvents();
  }
}

// Create a singleton instance
export const heatmapTracker = new HeatmapTracker();

// Initialize on app load
heatmapTracker.init();

// Send events periodically
if (typeof window !== 'undefined') {
  setInterval(() => {
    heatmapTracker.sendEvents();
  }, 30000); // Send every 30 seconds
}