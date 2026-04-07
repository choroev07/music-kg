import { useEffect, useState } from 'react'
import { Music } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useOutletContext } from 'react-router-dom' // Добавили для связи с плеером
import { fetchSongs } from '../services/supabaseClient'
import SongCard from '../components/SongCard'

export default function Home() {
  const { t } = useTranslation()
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Получаем функцию управления из MainLayout
  const { setIsPlaying, currentSong } = useOutletContext()

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
    <div className="animate-in fade-in duration-700">
      {/* Заголовок в стиле неонового терминала */}
      <div className="mb-8 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white neon-text">
            {t('allSongs')}
          </h2>
          <p className="mt-1 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            {t('clickTrack')}
          </p>
        </div>

        {/* Счетчик треков с эффектом стекла (как на image_c4a490.png) */}
        <div className="flex items-center gap-2 rounded-lg border border-[#00f2ff]/20 bg-[#00f2ff]/5 px-4 py-2 backdrop-blur-md">
          <Music size={16} className="text-[#00f2ff] animate-pulse" />
          <span className="text-xs font-mono font-bold text-[#00f2ff]">
            {loading ? 'SYNCING...' : `${songs.length} ${t('tracks').toUpperCase()}`}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-mono text-red-400">
          {error}
        </div>
      )}

      {/* Сетка песен */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-white/5 bg-white/5 p-4 h-24"
            />
          ))
        ) : songs.length ? (
          songs.map((song) => (
            <div 
              key={song.id} 
              className={`transition-all duration-300 transform hover:scale-[1.02] active:scale-95 cursor-pointer ${
                currentSong?.id === song.id ? 'ring-1 ring-[#00f2ff] shadow-[0_0_20px_rgba(0,242,255,0.1)]' : ''
              }`}
            >
              <SongCard song={song} />
            </div>
          ))
        ) : (
          <div className="col-span-full rounded-xl border border-white/5 bg-white/5 p-10 text-center font-mono text-zinc-500 uppercase tracking-widest">
            {t('noSongsFound')}
          </div>
        )}
      </div>
    </div>
  )
}