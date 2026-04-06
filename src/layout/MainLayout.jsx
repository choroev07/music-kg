import { useRef, useEffect, useState } from 'react' // Добавили useState для прогресса
import { NavLink, Outlet } from 'react-router-dom'
import { Library, Music, Search, SkipBack, SkipForward, Play, Pause } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LanguageSelector from '../components/LanguageSelector'

export default function MainLayout({ currentSong, isPlaying, setIsPlaying, onNext, onPrev, onSelectSong }) {
  const { t } = useTranslation()
  const audioRef = useRef(null)
  
  // Состояния для реального времени трека
  const [progress, setProgress] = useState(0)

  // 1. Управление воспроизведением
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && currentSong?.audio_url) {
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => setIsPlaying(false))
        }
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentSong, setIsPlaying])

  // 2. Обновление полоски прогресса
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const duration = audioRef.current.duration
      const currentTime = audioRef.current.currentTime
      if (duration) {
        setProgress((currentTime / duration) * 100)
      }
    }
  }

  // 3. Сброс прогресса при смене песни
  useEffect(() => {
    setProgress(0)
  }, [currentSong])

  const togglePlay = () => setIsPlaying(!isPlaying)

  const displayTitle = currentSong?.title || "Select a song..."
  const displayArtist = currentSong?.artist || "Music-KG System"

  return (
    <div className="min-h-screen bg-[#020205] text-white overflow-x-hidden selection:bg-[#ff007f]/30">
      
      {/* ДВИГАТЕЛЬ МУЗЫКИ */}
      <audio 
        ref={audioRef} 
        src={currentSong?.audio_url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={onNext}
        preload="auto"
      />

      {/* Фоновое неоновое свечение */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-[#ff007f]/10 blur-[130px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#00f2ff]/10 blur-[130px] rounded-full animate-pulse" />
      </div>

      <div className="relative mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] z-10">
        
        {/* САЙДБАР */}
        <aside className="h-screen sticky top-0 bg-[#080810]/80 border-r border-white/5 p-6 backdrop-blur-3xl flex flex-col">
          <div className="flex items-center gap-3 mb-10 group cursor-default">
            <div className="h-10 w-10 bg-gradient-to-tr from-[#ff007f] to-[#00f2ff] rounded-lg shadow-[0_0_20px_rgba(255,0,127,0.4)] group-hover:rotate-12 transition-transform duration-500" />
            <h1 className="text-xl font-black tracking-tighter uppercase italic text-white drop-shadow-md">
              {t('musicKg')}
            </h1>
          </div>

          <nav className="space-y-4 flex-1">
            <NavLink to="/" className={({isActive}) => `flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-300 ${isActive ? 'bg-white/10 text-[#00f2ff] shadow-[inset_0_0_15px_rgba(0,242,255,0.1)] border border-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
              <Music size={19} /> <span className="font-bold tracking-widest uppercase text-[10px]">{t('home') || 'HOME'}</span>
            </NavLink>
            <button className="w-full flex items-center gap-3 py-2.5 px-4 text-zinc-400 hover:text-white hover:bg-white/5 transition-all rounded-xl font-bold tracking-widest uppercase text-[10px]">
              <Search size={19} /> {t('search')}
            </button>
            <button className="w-full flex items-center gap-3 py-2.5 px-4 text-zinc-400 hover:text-white hover:bg-white/5 transition-all rounded-xl font-bold tracking-widest uppercase text-[10px]">
              <Library size={19} /> {t('yourLibrary')}
            </button>
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <LanguageSelector />
          </div>
        </aside>

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <main className="p-8 pb-32 min-h-screen">
          <Outlet context={{ isPlaying, currentSong, setIsPlaying, onSelectSong }} />
        </main>
      </div>

      {/* НИЖНИЙ ПЛЕЕР */}
      <footer className="fixed bottom-0 left-0 right-0 h-24 bg-[#05050a]/90 backdrop-blur-3xl border-t border-white/10 px-8 flex items-center justify-between z-50">
        
        {/* Инфо о песне */}
        <div className="flex items-center gap-4 w-1/4">
          <div className="relative h-14 w-14 rounded-xl bg-gradient-to-br from-[#ff007f] to-[#00f2ff] p-[1.5px] shadow-[0_0_20px_rgba(0,242,255,0.15)] group">
            <div className="h-full w-full bg-[#030308] rounded-[10px] flex items-center justify-center overflow-hidden">
               <Music size={22} className={isPlaying ? "text-[#00f2ff] animate-pulse" : "text-white/20"} />
            </div>
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-black text-white truncate uppercase tracking-tight leading-tight">{displayTitle}</h4>
            <p className="text-[9px] text-zinc-500 truncate font-mono uppercase tracking-wider mt-1.5 opacity-70">{displayArtist}</p>
          </div>
        </div>

        {/* Управление */}
        <div className="flex flex-col items-center gap-4 flex-1 max-w-2xl">
          <div className="flex items-center gap-8">
            <button onClick={onPrev} className="text-zinc-500 hover:text-[#ff007f] transition-colors active:scale-90">
              <SkipBack size={22} fill="currentColor" />
            </button>
            
            <button 
              onClick={togglePlay}
              className="h-12 w-12 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              {isPlaying ? <Pause size={24} fill="black" strokeWidth={2.5} /> : <Play size={24} fill="black" strokeWidth={2.5} className="ml-1" />}
            </button>

            <button onClick={onNext} className="text-zinc-500 hover:text-[#00f2ff] transition-colors active:scale-90">
              <SkipForward size={22} fill="currentColor" />
            </button>
          </div>

          {/* Реальный прогресс-бар */}
          <div className="w-full h-1 bg-white/5 rounded-full relative overflow-hidden group cursor-pointer">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#ff007f] via-[#00f2ff] to-[#00f2ff] shadow-[0_0_15px_#00f2ff] transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        {/* Статус системы */}
        <div className="w-1/4 flex flex-col items-end pointer-events-none">
          <div className="flex items-center gap-2">
            <div className={`h-1 w-1 rounded-full ${isPlaying ? 'bg-[#00f2ff] animate-ping' : 'bg-zinc-600'}`} />
            <span className={`text-[9px] font-black tracking-[0.3em] font-mono ${isPlaying ? 'text-[#00f2ff]' : 'text-zinc-600'}`}>
              {isPlaying ? 'SYSTEM_ACTIVE' : 'SYSTEM_IDLE'}
            </span>
          </div>
          <div className="text-zinc-600 text-[8px] font-mono mt-1 tracking-tighter opacity-50">
            ENC_TYPE // 24_BIT_LOSSLESS // 44.1KHZ
          </div>
        </div>
      </footer>
    </div>
  )
}