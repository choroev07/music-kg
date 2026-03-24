import { useEffect, useMemo, useState } from 'react'
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Home,
  Library,
  PauseCircle,
  PlayCircle,
  PlusCircle,
  Search,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react'
import { getTracks } from './service/musicService'

const formatPlays = (plays) => new Intl.NumberFormat().format(plays)

function App() {
  const [tracks, setTracks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [currentTrackId, setCurrentTrackId] = useState(null)

  useEffect(() => {
    const loadTracks = async () => {
      setIsLoading(true)
      const { data, errorMessage: serviceMessage } = await getTracks()
      setTracks(data)
      console.log('Fetched tracks:', data)
      setErrorMessage(serviceMessage)
      setCurrentTrackId(data[0]?.id ?? null)
      setIsLoading(false)
    }

    loadTracks()
  }, [])

  const nowPlaying = useMemo(
    () => tracks.find((track) => track.id === currentTrackId) ?? tracks[0],
    [tracks, currentTrackId],
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-zinc-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-zinc-800 bg-zinc-950/70 p-6 lg:border-b-0 lg:border-r">
          <h1 className="mb-8 text-2xl font-extrabold tracking-tight text-green-500">Spotify Clone</h1>
          <nav className="space-y-3">
            <button className="flex w-full items-center gap-3 rounded-lg bg-zinc-900 p-3 font-medium text-white transition hover:bg-zinc-800">
              <Home size={18} />
              Home
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg p-3 font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white">
              <Search size={18} />
              Search
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg p-3 font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white">
              <Library size={18} />
              Your Library
            </button>
          </nav>
          <div className="mt-10 rounded-xl bg-zinc-900 p-4">
            <div className="mb-2 flex items-center gap-2 text-zinc-200">
              <PlusCircle size={16} />
              <p className="text-sm font-semibold">Create your first playlist</p>
            </div>
            <p className="text-xs text-zinc-400">Save your favorite songs and albums in one place.</p>
          </div>
        </aside>

        <main className="p-6 pb-28 md:p-8 md:pb-32">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button className="rounded-full bg-black/60 p-2 text-zinc-200 hover:text-white">
                <ChevronLeft size={18} />
              </button>
              <button className="rounded-full bg-black/60 p-2 text-zinc-200 hover:text-white">
                <ChevronRight size={18} />
              </button>
            </div>
            <button className="flex items-center gap-2 rounded-full bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-700">
              <Bell size={16} />
              Notifications
            </button>
          </header>

          {errorMessage ? (
            <p className="mb-4 rounded-lg border border-amber-700/40 bg-amber-900/20 px-4 py-3 text-sm text-amber-200">
              {errorMessage}
            </p>
          ) : null}

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Top Tracks</h2>
              <p className="text-sm text-zinc-400">Synced from Supabase</p>
            </div>

            {isLoading ? (
              <p className="py-10 text-center text-zinc-400">Loading music...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] table-auto border-collapse text-left">
                  <thead>
                    <tr className="border-b border-zinc-800 text-xs uppercase text-zinc-400">
                      <th className="py-3 pr-3">#</th>
                      <th className="py-3 pr-3">Title</th>
                      <th className="py-3 pr-3">Album</th>
                      <th className="py-3 pr-3">Plays</th>
                      <th className="py-3 text-right">
                        <Clock3 size={14} className="ml-auto" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tracks.map((track, index) => {
                      const isActive = track.id === currentTrackId
                      return (
                        <tr
                          key={track.id}
                          className={`cursor-pointer border-b border-zinc-900 text-sm transition ${
                            isActive ? 'bg-zinc-800/70 text-white' : 'text-zinc-300 hover:bg-zinc-800/40'
                          }`}
                          onClick={() => setCurrentTrackId(track.id)}
                        >
                          <td className="py-3 pr-3">{index + 1}</td>
                          <td className="py-3 pr-3">
                            <p className="font-medium">{track.title}</p>
                            <p className="text-xs text-zinc-400">{track.artist}</p>
                          </td>
                          <td className="py-3 pr-3 text-zinc-400">{track.album}</td>
                          <td className="py-3 pr-3 text-zinc-400">{formatPlays(track.plays)}</td>
                          <td className="py-3 text-right text-zinc-400">{track.duration}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-950/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
          <div>
            <p className="text-sm font-semibold text-zinc-100">{nowPlaying?.title ?? 'No song selected'}</p>
            <p className="text-xs text-zinc-400">{nowPlaying?.artist ?? 'Pick a track to start'}</p>
          </div>
          <div className="flex items-center justify-center gap-4 text-zinc-200">
            <SkipBack size={20} />
            <PlayCircle size={34} className="text-white" />
            <PauseCircle size={34} className="hidden text-white md:block" />
            <SkipForward size={20} />
          </div>
          <div className="flex items-center justify-start gap-2 md:justify-end">
            <Volume2 size={18} className="text-zinc-300" />
            <div className="h-1.5 w-32 rounded-full bg-zinc-700">
              <div className="h-1.5 w-20 rounded-full bg-zinc-200" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
