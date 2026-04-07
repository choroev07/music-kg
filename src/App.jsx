import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home.jsx'
import SongDetails from './pages/SongDetails.jsx'
import MainLayout from './layout/MainLayout.jsx'
import { fetchSongs } from './services/supabaseClient' // Импорт твоей функции Supabase

export default function App() {
  const [songs, setSongs] = useState([]); // Все песни из базы
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 1. Загружаем песни из Supabase один раз при старте
  useEffect(() => {
    const loadSongs = async () => {
      try {
        const data = await fetchSongs();
        setSongs(data || []);
      } catch (err) {
        console.error("Error loading songs:", err);
      }
    };
    loadSongs();
  }, []);

  // 2. Функция выбора песни
  const handleSelectSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  // 3. Логика переключения "Вперед"
  const handleNext = () => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
  };

  // 4. Логика переключения "Назад"
  const handlePrev = () => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
    setIsPlaying(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={
          <MainLayout 
            currentSong={currentSong} 
            isPlaying={isPlaying} 
            setIsPlaying={setIsPlaying}
            onNext={handleNext} // Передаем кнопку Вперед
            onPrev={handlePrev} // Передаем кнопку Назад
          />
        }>
          {/* Передаем handleSelectSong в Home через пропсы */}
          <Route path="/" element={<Home onSelectSong={handleSelectSong} songs={songs} />} />
          <Route path="/song/:id" element={<SongDetails onSelectSong={handleSelectSong} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}