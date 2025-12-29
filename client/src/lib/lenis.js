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
      smooth: true,
      smoothWheel: true,
      smoothTouch: true,
      wheelMultiplier: 0.8,
      orientation: 'vertical',
      gestureOrientation: 'vertical'
    })
    _rafRunning = true

    const loop = (time) => {
      if (!_rafRunning) return
      try { lenisInstance.raf(time) } catch (e) { /* noop */ }
      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)

    // Wheel watchdog: detect repeated wheel events with little/no scroll progress
    try {
      let wheelCount = 0
      let lastWheelAt = 0
      let lastObservedScroll = typeof window !== 'undefined' ? window.scrollY : 0

      const wheelHandler = () => {
        const now = Date.now()
        if (now - lastWheelAt > 400) wheelCount = 0
        wheelCount += 1
        lastWheelAt = now
      }

      const watchdog = () => {
        const current = typeof window !== 'undefined' ? window.scrollY : 0
        const progress = Math.abs(current - lastObservedScroll)
        // If there are many wheel events recently but scroll didn't move much -> fallback
        if (wheelCount >= 3 && progress < 2) {
          // disable Lenis and fall back to native scrolling
          _fallbackToNative = true
          _rafRunning = false
          try { window.removeEventListener('wheel', wheelHandler, { passive: true }) } catch (e) { /* noop */ }
          if (_watchdogTimer) { clearInterval(_watchdogTimer); _watchdogTimer = null }
        }
        // reset state
        wheelCount = 0
        lastObservedScroll = current
      }

      window.addEventListener('wheel', wheelHandler, { passive: true })
      _watchdogTimer = setInterval(watchdog, 350)
      _wheelWatcher = wheelHandler
    } catch (e) {
      // noop
    }
  }
  return lenisInstance
}

// Temporarily suspend the watchdog/fallback so Lenis remains active
export function suspendFallback() {
  _suspended = true
  // clear any watchdog
  try { if (_watchdogTimer) { clearInterval(_watchdogTimer); _watchdogTimer = null } } catch (e) { }
  try { if (_wheelWatcher) { window.removeEventListener('wheel', _wheelWatcher, { passive: true }); _wheelWatcher = null } } catch (e) { }
  // re-enable RAF if needed
  _rafRunning = true
  _fallbackToNative = false
}

export function resumeFallback() {
  _suspended = false
  // if lenis exists and we don't already have a watchdog, try to recreate minimal watchdog
  if (lenisInstance && !_watchdogTimer) {
    try {
      let wheelCount = 0
      let lastWheelAt = 0
      let lastObservedScroll = typeof window !== 'undefined' ? window.scrollY : 0
      const wheelHandler = () => {
        const now = Date.now()
        if (now - lastWheelAt > 400) wheelCount = 0
        wheelCount += 1
        lastWheelAt = now
      }
      const watchdog = () => {
        if (_suspended) { wheelCount = 0; lastObservedScroll = typeof window !== 'undefined' ? window.scrollY : 0; return }
        const current = typeof window !== 'undefined' ? window.scrollY : 0
        const progress = Math.abs(current - lastObservedScroll)
        if (wheelCount >= 3 && progress < 2) {
          _fallbackToNative = true
          _rafRunning = false
          try { window.removeEventListener('wheel', wheelHandler, { passive: true }) } catch (e) { }
          if (_watchdogTimer) { clearInterval(_watchdogTimer); _watchdogTimer = null }
        }
        wheelCount = 0
        lastObservedScroll = current
      }
      window.addEventListener('wheel', wheelHandler, { passive: true })
      _watchdogTimer = setInterval(watchdog, 350)
      _wheelWatcher = wheelHandler
    } catch (e) { /* noop */ }
  }
}

export function getLenis() {
  if (_fallbackToNative) return null
  return lenisInstance
}

// Subscribe to scroll updates. Returns an unsubscribe function.
export function subscribeToScroll(handler) {
  // handler receives a single numeric argument: scrollY
  const lenis = getLenis()
  if (lenis && typeof lenis.on === 'function') {
    const cb = (e) => {
      try {
        handler(typeof e === 'object' && e !== null && 'scroll' in e ? e.scroll : window.scrollY)
      } catch (err) {
        // noop
      }
    }
    lenis.on('scroll', cb)
    return () => {
      try { lenis.off('scroll', cb) } catch (e) { /* noop */ }
    }
  }

  // Fallback to native scroll
  const wrapped = () => handler(window.scrollY)
  window.addEventListener('scroll', wrapped, { passive: true })
  return () => window.removeEventListener('scroll', wrapped)
}

export function scrollToTop(options = {}) {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(0, options)
  } else {
    window.scrollTo(0, 0)
  }
}

export default { initLenis, getLenis, scrollToTop }
