import { Link, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { fetchSongDetails } from '../services/supabaseClient'
import LyricsPlayer from '../components/LyricsPlayer'
import Player from '../components/Player'
import ReviewSection from '../components/ReviewSection'

const pickFirstId = (song, idParam) => {
  if (song?.id) return song.id
  return idParam
}

export default function SongDetails() {
  const { id } = useParams()
  const [song, setSong] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchSongDetails(id)
        setSong(data)
      } catch (e) {
        setError(e?.message ?? 'Failed to load song details.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const songId = useMemo(() => pickFirstId(song, id), [song, id])

  const title = song?.title ?? 'Loading...'
  const artist = song?.artist ?? ''
  const audioSrc = song?.audioUrl ?? ''
  const lyricsLines = song?.lyrics ?? []

  return (
    <div className="min-h-[70vh]">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/30 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-900/60"
        >
          <ChevronLeft size={16} />
          Back
        </Link>
        <span className="text-xs text-zinc-400">Song ID: {songId}</span>
      </div>

      {error ? (
        <div className="rounded-2xl border border-amber-700/40 bg-amber-900/20 px-4 py-3 text-sm text-amber-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-4">
          <div className="h-10 w-2/3 animate-pulse rounded bg-white/5" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-white/5" />
          <div className="h-52 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/30" />
          <div className="h-52 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/30" />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h2 className="text-4xl font-extrabold tracking-tight">{title}</h2>
              {artist ? <p className="mt-2 text-zinc-400">{artist}</p> : null}

              <div className="mt-5">
                {audioSrc ? (
                  <Player src={audioSrc} title={title} />
                ) : (
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 text-sm text-zinc-400">
                    No audio URL found for this song. Make sure your details table has `audio_url`
                    (or `audio_src` / `url` / `stream_url` / `file_url`).
                  </div>
                )}
              </div>

              <div className="mt-5">
                <LyricsPlayer lyricsLines={lyricsLines} />
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <ReviewSection songId={songId} />
          </aside>
        </div>
      )}
    </div>
  )
}

