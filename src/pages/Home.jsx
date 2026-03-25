import { useEffect, useState } from 'react'
import { Music } from 'lucide-react'
import { fetchSongs } from '../services/supabaseClient'
import SongCard from '../components/SongCard'

export default function Home() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchSongs()
        setSongs(data)
      } catch (e) {
        setError(e?.message ?? 'Failed to fetch songs from Supabase.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">All Songs</h2>
          <p className="mt-1 text-sm text-zinc-400">Click a track to open details & lyrics</p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/30 px-4 py-2">
          <Music size={16} className="text-emerald-300" />
          <span className="text-sm font-semibold text-zinc-100">
            {loading ? 'Syncing...' : `${songs.length} tracks`}
          </span>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-amber-700/40 bg-amber-900/20 px-4 py-3 text-sm text-amber-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4"
            >
              <div className="h-11 w-11 rounded-xl bg-white/5" />
              <div className="mt-3 h-4 w-3/4 rounded bg-white/5" />
              <div className="mt-2 h-3 w-1/2 rounded bg-white/5" />
            </div>
          ))}
        </div>
      ) : songs.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-sm text-zinc-400">
          No songs found in your Supabase table. Check `VITE_SONGS_TABLE` / schema columns.
        </div>
      )}
    </div>
  )
}

