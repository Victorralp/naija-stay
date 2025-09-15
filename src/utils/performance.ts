// Simple performance monitoring utility
// In a real application, this would integrate with tools like Sentry, New Relic, or similar

class PerformanceMonitor {
  private metrics: Record<string, number[]> = {};

  // Measure component render time
  measureRender(componentName: string, renderTime: number) {
    if (!this.metrics[componentName]) {
      this.metrics[componentName] = [];
    }
    this.metrics[componentName].push(renderTime);
    
    // Log if render time is too high
    if (renderTime > 100) { // 100ms threshold
      console.warn(`Slow render detected: ${componentName} took ${renderTime}ms`);
    }
  }

  // Measure API call time
  measureAPICall(apiName: string, callTime: number) {
    if (!this.metrics[apiName]) {
      this.metrics[apiName] = [];
    }
    this.metrics[apiName].push(callTime);
    
    // Log if API call is too slow
    if (callTime > 2000) { // 2s threshold
      console.warn(`Slow API call detected: ${apiName} took ${callTime}ms`);
    }
  }

  // Measure page load time
  measurePageLoad(pageName: string, loadTime: number) {
    if (!this.metrics[pageName]) {
      this.metrics[pageName] = [];
    }
    this.metrics[pageName].push(loadTime);
    
    // Log if page load is too slow
    if (loadTime > 3000) { // 3s threshold
      console.warn(`Slow page load detected: ${pageName} took ${loadTime}ms`);
    }
  }

  // Get average metric value
  getAverage(metricName: string): number {
    const values = this.metrics[metricName] || [];
    if (values.length === 0) return 0;
    
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }

  // Get all metrics
  getAllMetrics(): Record<string, { average: number; count: number }> {
    const result: Record<string, { average: number; count: number }> = {};
    
    for (const [metricName, values] of Object.entries(this.metrics)) {
      if (values.length > 0) {
        const sum = values.reduce((acc, val) => acc + val, 0);
        result[metricName] = {
          average: sum / values.length,
          count: values.length
        };
      }
    }
    
    return result;
  }

  // Log all metrics
  logMetrics() {
    console.log('Performance Metrics:', this.getAllMetrics());
  }

  // Clear metrics
  clearMetrics() {
    this.metrics = {};
  }
}

// Create a singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Log metrics on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    performanceMonitor.logMetrics();
  });
}