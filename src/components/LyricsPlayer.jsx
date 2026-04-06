import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function LyricsPlayer({
  lyricsLines,
  intervalMs = 2800,
}) {
  const { t } = useTranslation()
  const lines = useMemo(
    () => (Array.isArray(lyricsLines) ? lyricsLines.filter(Boolean) : []),
    [lyricsLines],
  )
  const [index, setIndex] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const fadeTimerRef = useRef(null)

  useEffect(() => {
    const resetTimeout = setTimeout(() => {
      setIndex(0)
      setOpacity(1)
    }, 0)

    if (!lines.length) {
      return () => clearTimeout(resetTimeout)
    }

    const id = setInterval(() => {
      setOpacity(0)
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
      fadeTimerRef.current = setTimeout(() => {
        setIndex((i) => (i + 1) % lines.length)
        setOpacity(1)
      }, 260)
    }, intervalMs)

    return () => {
      clearInterval(id)
      clearTimeout(resetTimeout)
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
    }
  }, [lines, intervalMs])

  if (!lines.length) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <p className="text-sm text-zinc-400">{t('noLyrics')}</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white/90">{t('lyrics')}</p>
        <p className="text-xs text-zinc-400">{t('karaokeMode')}</p>
      </div>

      <div className="mt-4 flex min-h-[84px] items-end justify-center">
        <div
          key={index}
          className="w-full text-center"
          style={{ opacity }}
        >
          <p className="px-2 text-base font-semibold text-zinc-50 transition-opacity duration-300">
            {lines[index]}
          </p>
        </div>
      </div>
    </div>
  )
}

