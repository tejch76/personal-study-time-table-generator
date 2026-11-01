/**
 * Notification service supporting browser Web Notifications API
 * with automatic fallback to in-app alerts and synthetic audio chimes.
 */

// Synthesize pleasant chime using Web Audio API (no external MP3 asset dependency!)
export function playChime(type: 'complete' | 'break' | 'alert' = 'complete') {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()

    const now = ctx.currentTime

    if (type === 'complete') {
      // Ascending triumphant chime (C5 -> E5 -> G5 -> C6)
      const freqs = [523.25, 659.25, 783.99, 1046.50]
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + idx * 0.12)
        gain.gain.setValueAtTime(0, now + idx * 0.12)
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.12 + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.4)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + idx * 0.12)
        osc.stop(now + idx * 0.12 + 0.45)
      })
    } else if (type === 'break') {
      // Relaxing dual chime (A4 -> F#4)
      const freqs = [440, 370]
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + idx * 0.2)
        gain.gain.setValueAtTime(0.15, now + idx * 0.2)
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.2 + 0.6)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + idx * 0.2)
        osc.stop(now + idx * 0.2 + 0.65)
      })
    } else {
      // Soft ping
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, now)
      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.35)
    }
  } catch (err) {
    console.warn('Audio chime failed:', err)
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false
  }
  if (Notification.permission === 'granted') {
    return true
  }
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }
  return false
}

export function sendBrowserNotification(title: string, options?: NotificationOptions) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: '/logo.svg',
        badge: '/logo.svg',
        ...options,
      })
    } catch (e) {
      console.warn('Could not display system notification:', e)
    }
  }
}
