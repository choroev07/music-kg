import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, PlayCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchSongDetails } from '../services/supabaseClient'
import LyricsPlayer from '../components/LyricsPlayer'
import ReviewSection from '../components/ReviewSection'

export default function SongDetails() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [song, setSong] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSongDetails(id)
        setSong(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="p-20 text-center animate-pulse">SYSTEM_LOADING...</div>

  return (
    <div className="max-w-6xl mx-auto">
      {/* Кнопка назад в стиле Glass */}
      <Link to="/" className="btn-glass mb-8 inline-flex hover:border-[#ff007f]">
        <ChevronLeft size={16} /> {t('back')}
      </Link>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10">
        <section>
          {/* Заголовок в стиле терминала */}
          <div className="relative p-10 rounded-3xl bg-[#0f0f1a] border border-white/5 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-zinc-700 uppercase tracking-widest">
              Audio_Unit_v4
            </div>
            
            <h2 className="text-6xl font-extrabold mb-4 tracking-tighter text-white">
              {song?.title}
            </h2>
            <p className="text-xl text-[#00f2ff] font-medium tracking-widest uppercase mb-10">
              {song?.artist}
            </p>

            {/* Главная кнопка Слушать */}
            <button className="btn-pink flex items-center gap-3">
              <PlayCircle size={24} /> {t('playNow') || 'Listen Now'}
            </button>

            {/* Тексты песен */}
            <div className="mt-16 bg-black/30 rounded-2xl p-6 border border-white/5 backdrop-blur-md">
              <h4 className="text-[10px] font-bold text-[#ff007f] tracking-[0.5em] mb-6 uppercase">Lyrics // Sync</h4>
              <LyricsPlayer lyricsLines={song?.lyrics || []} />
            </div>
          </div>
        </section>

        <aside>
          <div className="bg-[#0f0f1a]/50 rounded-3xl p-6 border border-white/5">
            <h4 className="text-xs font-bold text-zinc-500 mb-6 uppercase tracking-widest">Reviews</h4>
            <ReviewSection songId={id} />
          </div>
        </aside>
      </div>
    </div>
  )
}