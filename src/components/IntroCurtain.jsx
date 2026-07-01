/* Intro curtain — the reel plays full-screen on first visit, then flips up like a
   page to reveal the site. A folded "peel" corner replays it anytime.
   ponytail: intro shows once per session (sessionStorage), not every reload. */
import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const SEEN_KEY = 'introSeen'

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function IntroCurtain() {
  const [open, setOpen] = useState(() => {
    if (prefersReduced()) return false
    try { return sessionStorage.getItem(SEEN_KEY) !== '1' } catch { return true }
  })
  const videoRef = useRef(null)

  const dismiss = () => {
    try { sessionStorage.setItem(SEEN_KEY, '1') } catch { /* private mode */ }
    setOpen(false)
  }

  // On open: restart the reel, lock scroll behind it, allow Esc to skip.
  useEffect(() => {
    if (!open) return undefined
    const v = videoRef.current
    if (v) { v.currentTime = 0; const p = v.play(); if (p && p.catch) p.catch(() => {}) }
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key === 'Escape') dismiss() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const exitVars = prefersReduced()
    ? { opacity: 0, transition: { duration: 0.3 } }
    : { rotateX: -92, opacity: 0, transformPerspective: 1400, transition: { duration: 0.85, ease: [0.65, 0, 0.35, 1] } }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="curtain"
            className="intro-curtain"
            style={{ transformOrigin: 'top center' }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={exitVars}
          >
            <video
              ref={videoRef}
              className="intro-curtain-video"
              src="/video/brag.mp4"
              autoPlay muted playsInline
              onEnded={dismiss}
            />
            <button type="button" className="intro-skip" onClick={dismiss}>
              Skip intro <span aria-hidden="true">→</span>
            </button>
            {/* Portrait-phone only (CSS-gated): nudge to rotate for a bigger view */}
            <div className="intro-rotate-hint" aria-hidden="true">
              <span className="intro-rotate-icon">⤾</span>
              <span>Rotate for the full view</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Folded-corner peel tab — replays the intro */}
      {!open && (
        <button type="button" className="intro-peel" onClick={() => setOpen(true)} aria-label="Watch my intro again">
          <span className="intro-peel-label"><span className="intro-peel-icon">↺</span> Watch my intro</span>
        </button>
      )}
    </>
  )
}
