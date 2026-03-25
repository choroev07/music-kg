import { Link } from 'react-router-dom'
import { Music, Play } from 'lucide-react'

export default function SongCard({ song }) {
  const id = song?.id ?? song?.song_id ?? song?.audio_id
  const title = song?.title ?? song?.song_title ?? song?.name ?? `Song ${id ?? ''}`
  const artist = song?.artist ?? song?.artist_name ?? song?.artistTitle ?? ''

  return (
    <Link
      to={`/song/${id}`}
      className="group block rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/60"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-emerald-300">
          <Music size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{title}</p>
          {artist ? <p className="truncate text-xs text-zinc-400">{artist}</p> : null}
        </div>

        <div className="mt-1 hidden items-center justify-center rounded-full bg-emerald-500/10 p-2 text-emerald-300 transition group-hover:flex">
          <Play size={16} />
        </div>
      </div>
    </Link>
  )
}

