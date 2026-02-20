/* Sneaking cats — pipi and ollie alternate peeking from 4 edges */
import { useState, useEffect } from 'react'

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

export default function CatRunner() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)

  const catIdx = step % 2
  const spotIdx = Math.floor(step / 2) % 4
  const spot = spots[catIdx][spotIdx]

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    let timeout
    const cycle = () => {
      setVisible(true)
      timeout = setTimeout(() => {
        setVisible(false)
        timeout = setTimeout(() => {
          setStep(s => s + 1)
          cycle()
        }, 10000)
      }, 5000)
    }

    // start immediately on mount
    timeout = setTimeout(cycle, 0)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <img
      src={cats[catIdx].src}
      alt={cats[catIdx].alt}
      className={`cat-sneak cat-${spot} ${visible ? 'cat-visible' : ''}`}
    />
  )
}
