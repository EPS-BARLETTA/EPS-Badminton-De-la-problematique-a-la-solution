import { useEffect, useMemo, useState } from 'react'

const DEFAULT_COUNTDOWN_MINUTES = 3

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds)
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function TimerWidget() {
  const [mode, setMode] = useState('countup')
  const [isRunning, setIsRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [countdownMinutes, setCountdownMinutes] = useState(DEFAULT_COUNTDOWN_MINUTES)
  const [remaining, setRemaining] = useState(DEFAULT_COUNTDOWN_MINUTES * 60)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      if (mode === 'countup') {
        setElapsed((prev) => prev + 1)
      } else {
        setRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, mode])

  useEffect(() => {
    if (mode === 'countdown') {
      setRemaining(Math.max(1, countdownMinutes) * 60)
    }
  }, [countdownMinutes, mode])

  const displayTime = useMemo(() => {
    return mode === 'countup' ? formatTime(elapsed) : formatTime(remaining)
  }, [elapsed, remaining, mode])

  const toggleMode = (selectedMode) => {
    if (selectedMode === mode) return
    setIsRunning(false)

    if (selectedMode === 'countup') {
      setElapsed(0)
    } else {
      setRemaining(Math.max(1, countdownMinutes) * 60)
    }

    setMode(selectedMode)
  }

  const handleToggle = () => {
    setIsRunning((prev) => !prev)
  }

  const handleReset = () => {
    setIsRunning(false)
    setElapsed(0)
    setRemaining(Math.max(1, countdownMinutes) * 60)
  }

  return (
    <section className={`timer-widget ${isOpen ? 'open' : 'closed'}`} aria-live="polite">
      <button
        type="button"
        className="timer-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? 'Masquer le chrono' : `⏱ ${displayTime}`}
      </button>

      {isOpen && (
        <>
          <div className="timer-header">
            <p className="eyebrow">Timer</p>
            <strong>{displayTime}</strong>
          </div>

          <div className="timer-controls">
            <button
              type="button"
              className={mode === 'countup' ? 'chip active' : 'chip'}
              onClick={() => toggleMode('countup')}
            >
              Chrono
            </button>

            <button
              type="button"
              className={mode === 'countdown' ? 'chip active' : 'chip'}
              onClick={() => toggleMode('countdown')}
            >
              Compte à rebours
            </button>
          </div>

          {mode === 'countdown' && (
            <label className="timer-input">
              Durée (minutes)
              <input
                type="number"
                min="1"
                max="60"
                value={countdownMinutes}
                onChange={(event) => setCountdownMinutes(Number(event.target.value) || 1)}
              />
            </label>
          )}

          <div className="timer-actions">
            <button type="button" className="primary" onClick={handleToggle}>
              {isRunning ? 'Pause' : 'ON'}
            </button>

            <button type="button" className="ghost" onClick={handleReset}>
              Reset
            </button>
          </div>
        </>
      )}
    </section>
  )
}

export default TimerWidget
