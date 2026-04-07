import { Music, Play, Pause } from 'lucide-react'
import { useOutletContext, useNavigate } from 'react-router-dom'

export default function SongCard({ song }) {
  const navigate = useNavigate()
  
  // Достаем onSelectSong из контекста Outlet (который мы передали в MainLayout)
  const { currentSong, isPlaying, setIsPlaying, onSelectSong } = useOutletContext()

  const id = song?.id ?? song?.song_id ?? song?.audio_id
  const title = song?.title ?? song?.song_title ?? song?.name ?? `Song ${id ?? ''}`
  const artist = song?.artist ?? song?.artist_name ?? song?.artistTitle ?? 'Unknown Artist'
  
  const isThisSongActive = currentSong?.id === id
  const isThisSongPlaying = isThisSongActive && isPlaying

  // Функция обработки клика
  const handlePlayClick = (e) => {
    // Останавливаем всплытие, чтобы не срабатывал редирект navigate
    e.stopPropagation()
    
    if (isThisSongActive) {
      // Если песня уже выбрана — просто ставим на паузу или плей
      setIsPlaying(!isPlaying)
    } else {
      // Если песня новая — вызываем функцию выбора из App.jsx
      onSelectSong(song)
    }
  }

  return (
    <div
      onClick={() => navigate(`/song/${id}`)}
      className={`group relative block rounded-xl border p-4 transition-all duration-300 cursor-pointer
        ${isThisSongActive 
          ? 'bg-white/10 border-[#00f2ff]/50 shadow-[0_0_20px_rgba(0,242,255,0.1)]' 
          : 'bg-[#ffffff03] border-white/5 hover:border-[#ff007f]/50 hover:bg-white/5'
        } backdrop-blur-md`}
    >
      {/* Акцентная полоска слева */}
      <div className={`absolute left-0 top-1/4 bottom-1/4 w-[2px] transition-all duration-300
        ${isThisSongActive ? 'bg-[#00f2ff] shadow-[0_0_10px_#00f2ff]' : 'bg-[#ff007f] opacity-50 group-hover:opacity-100'}
      `} />

      <div className="flex items-center gap-4">
        {/* Превью / Иконка */}
        <div 
          onClick={handlePlayClick}
          className={`relative flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300
          ${isThisSongActive ? 'bg-[#00f2ff]/20 text-[#00f2ff]' : 'bg-white/5 text-zinc-500 group-hover:text-white'}
        `}>
          {isThisSongPlaying ? (
            <Pause size={20} fill="currentColor" className="animate-pulse" />
          ) : (
            <Music size={20} className={isThisSongActive ? "animate-pulse" : ""} />
          )}
          
          {/* Оверлей Play при наведении на иконку */}
          {!isThisSongActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <Play size={16} fill="white" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm font-bold uppercase tracking-tight transition-colors
            ${isThisSongActive ? 'text-[#00f2ff]' : 'text-white'}
          `}>
            {title}
          </p>
          <p className="truncate text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
            {artist}
          </p>
        </div>

        {/* Кнопка Play справа */}
        <button 
          onClick={handlePlayClick}
          className={`flex items-center justify-center rounded-full p-2 transition-all duration-300
            ${isThisSongActive 
              ? 'bg-[#00f2ff] text-black shadow-[0_0_15px_rgba(0,242,255,0.5)] opacity-100' 
              : 'bg-white text-black opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
            }
          `}
        >
          {isThisSongPlaying ? (
            <Pause size={16} fill="black" />
          ) : (
            <Play size={16} fill="black" className="ml-0.5" />
          )}
        </button>
      </div>
    </div>
  )
}