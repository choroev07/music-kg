import { NavLink, Outlet } from 'react-router-dom'
import { Library, Music, Search } from 'lucide-react'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-zinc-100">
      <div className="mx-auto grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-zinc-800 bg-zinc-950/70 p-6 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
              <Music size={20} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold leading-tight tracking-tight">Music-kg</h1>
              <p className="text-xs text-zinc-400">Modern Supabase music UI</p>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                [
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive ? 'bg-zinc-900 text-white' : 'text-zinc-300 hover:bg-zinc-900 hover:text-white',
                ].join(' ')
              }
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                <Music size={16} />
              </span>
              Home
            </NavLink>

            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                <Search size={16} />
              </span>
              Search
            </button>

            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                <Library size={16} />
              </span>
              Your Library
            </button>
          </nav>

          <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <p className="text-sm font-semibold text-zinc-100">Karaoke-ready lyrics</p>
            <p className="mt-1 text-xs text-zinc-400">Supabase-powered songs, player, reviews.</p>
          </div>
        </aside>

        <main className="p-6 pb-24 md:p-8 md:pb-32">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

