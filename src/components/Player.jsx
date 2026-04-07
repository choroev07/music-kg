import { PauseCircle, PlayCircle } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function Player({ src, title }) {
  const { t } = useTranslation()
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [durationSec, setDurationSec] = useState(0)
  const [currentSec, setCurrentSec] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  const progress = useMemo(() => {
    if (!durationSec) return 0
    return Math.min(100, Math.max(0, (currentSec / durationSec) * 100))
  }, [currentSec, durationSec])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onLoaded = () => setDurationSec(audio.duration || 0)
    const onTime = () => setCurrentSec(audio.currentTime || 0)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onError = () => setErrorMessage(t('audioFailed'))

    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('error', onError)
    }
  }, [t])

  useEffect(() => {
    const t = setTimeout(() => {
      setErrorMessage('')
      setIsPlaying(false)
      setDurationSec(0)
      setCurrentSec(0)
    }, 0)

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.load()
    }

    return () => clearTimeout(t)
  }, [src])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return
    try {
      if (audio.paused) {
        await audio.play()
      } else {
        audio.pause()
      }
    } catch {
      setErrorMessage(t('playbackError'))
    }
  }

  const formatTime = (sec) => {
    if (!sec && sec !== 0) return '0:00'
    const s = Math.max(0, Math.floor(sec))
    const m = Math.floor(s / 60)
    const r = s % 60
    return `${m}:${String(r).padStart(2, '0')}`
  }

  const seekToPct = (pct) => {
    const audio = audioRef.current
    if (!audio || !durationSec) return
    audio.currentTime = (pct / 100) * durationSec
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{title ?? t('nowPlaying')}</p>
          <p className="mt-1 text-xs text-zinc-400">{t('simpleProgress')}</p>
        </div>

        <button
          type="button"
          onClick={togglePlay}
          className="inline-flex items-center justify-center rounded-full bg-emerald-500/15 p-1 text-emerald-300 transition hover:bg-emerald-500/25"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <PauseCircle size={44} /> : <PlayCircle size={44} />}
        </button>
      </div>

      {errorMessage ? (
        <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>{formatTime(currentSec)}</span>
          <span>{formatTime(durationSec)}</span>
        </div>

        <div className="mt-2">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="relative h-2 w-full cursor-pointer rounded-full bg-zinc-800"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left
              const pct = (x / rect.width) * 100
              seekToPct(pct)
            }}
          >
            <div
              className="absolute left-0 top-0 h-2 rounded-full bg-emerald-400"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Audio element kept hidden; all controls are custom */}
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />
    </div>
  )
}

