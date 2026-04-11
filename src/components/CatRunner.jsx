/* Sneaking cats — pipi and ollie alternate peeking from 4 edges */
import { useEffect, useRef, useState } from 'react'

const cats = [
  { src: '/img/pipi_cat.webp', alt: 'Pipi the cat' },
  { src: '/img/ollie_cat.webp', alt: 'Ollie the cat' },
]

// 4 edge positions: bottom, right, top, left
// pipi: bottom → right → top → left
// ollie: top → left → bottom → right
const spots = {
  0: ['bottom', 'right', 'top', 'left'],
  1: ['top', 'left', 'bottom', 'right'],
}

const VISIBLE_MS = 5000
const PAUSE_MS = 10000
const FLY_AWAY_MS = 1800

export default function CatRunner() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)
  const [isFlying, setIsFlying] = useState(false)
  const timeoutRef = useRef([])
  const revealFrameRef = useRef(null)

  const catIdx = step % 2
  const spotIdx = Math.floor(step / 2) % 4
  const spot = spots[catIdx][spotIdx]

  const clearTimers = () => {
    timeoutRef.current.forEach(timeoutId => window.clearTimeout(timeoutId))
    timeoutRef.current = []
  }

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return undefined

    clearTimers()
    if (revealFrameRef.current !== null) {
      window.cancelAnimationFrame(revealFrameRef.current)
    }

    setVisible(false)
    setIsFlying(false)
    revealFrameRef.current = window.requestAnimationFrame(() => {
      setVisible(true)
    })

    timeoutRef.current = [
      window.setTimeout(() => setVisible(false), VISIBLE_MS),
      window.setTimeout(() => setStep(currentStep => currentStep + 1), VISIBLE_MS + PAUSE_MS),
    ]

    return () => {
      clearTimers()
      if (revealFrameRef.current !== null) {
        window.cancelAnimationFrame(revealFrameRef.current)
        revealFrameRef.current = null
      }
    }
  }, [step])

  const handleDismiss = () => {
    if (!visible || isFlying) return

    clearTimers()
    setIsFlying(true)
    timeoutRef.current = [
      window.setTimeout(() => {
        setVisible(false)
        setIsFlying(false)
      }, FLY_AWAY_MS),
      window.setTimeout(() => setStep(currentStep => currentStep + 1), FLY_AWAY_MS + PAUSE_MS),
    ]
  }

  return (
    <button
      type="button"
      className={`cat-sneak cat-${spot} ${visible ? 'cat-visible' : ''} ${isFlying ? 'cat-flying' : ''} ${visible && !isFlying ? 'cat-clickable' : ''}`}
      onClick={handleDismiss}
      aria-label={`${cats[catIdx].alt}. Click to make this cat spin away.`}
      tabIndex={visible && !isFlying ? 0 : -1}
    >
      <img src={cats[catIdx].src} alt="" aria-hidden="true" />
    </button>
  )
}
