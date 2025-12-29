import Lenis from '@studio-freight/lenis'

let lenisInstance = null
let _rafRunning = false
let _fallbackToNative = false
let _wheelWatcher = null
let _watchdogTimer = null
let _suspended = false

export function initLenis() {
  if (!lenisInstance && typeof window !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Lenis removed: provide native-only fallbacks so existing imports keep working.

      export function initLenis() {
        // no-op: Lenis removed. Keep for compatibility.
        return null
      }

      export function getLenis() {
        return null
      }

      export function subscribeToScroll(handler) {
        // native scroll subscription; returns unsubscribe
        const wrapped = () => handler(window.scrollY)
        window.addEventListener('scroll', wrapped, { passive: true })
        return () => window.removeEventListener('scroll', wrapped)
      }

      export function scrollToTop(options = {}) {
        window.scrollTo(0, 0)
      }

      export function suspendFallback() { /* no-op */ }
      export function resumeFallback() { /* no-op */ }
      export function isLowEndDevice() { return false }

      export default { initLenis, getLenis, scrollToTop }
        lastWheelAt = now
