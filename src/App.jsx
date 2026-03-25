import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import SongDetails from './pages/SongDetails.jsx'
import MainLayout from './layout/MainLayout.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/song/:id" element={<SongDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
