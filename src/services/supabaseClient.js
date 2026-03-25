import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Missing Supabase env. Set VITE_SUPABASE_URL and VITE_SUPABASE_KEY in your Vite env (e.g. src/.env.local).',
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseKey ?? '')

const SONGS_TABLE = import.meta.env.VITE_SONGS_TABLE ?? 'audios' // FIRST table (default matches existing code)
const SONG_DETAILS_TABLE =
  import.meta.env.VITE_SONG_DETAILS_TABLE ?? 'audios' // SECOND table (override in env if different)

const REVIEWS_TABLE = import.meta.env.VITE_REVIEWS_TABLE ?? 'reviews'
const REVIEWS_SONG_ID_COLUMN =
  import.meta.env.VITE_REVIEWS_SONG_ID_COLUMN ?? 'song_id'
const REVIEWS_TEXT_COLUMN = import.meta.env.VITE_REVIEWS_TEXT_COLUMN ?? 'text'
const REVIEWS_CREATED_AT_COLUMN =
  import.meta.env.VITE_REVIEWS_CREATED_AT_COLUMN ?? 'created_at'

const pickFirstStringField = (row, candidates, fallback = '') => {
  for (const key of candidates) {
    const val = row?.[key]
    if (typeof val === 'string' && val.trim()) return val
  }
  return fallback
}

const pickFirstIdField = (row, candidates) => {
  for (const key of candidates) {
    const val = row?.[key]
    if (val !== undefined && val !== null && val !== '') return val
  }
  return undefined
}

export const fetchSongs = async () => {
  const { data, error } = await supabase.from(SONGS_TABLE).select('*')
  if (error) throw error

  // Schema may differ; we normalize for UI usage only.
  return (data ?? []).map((row, index) => {
    const id = pickFirstIdField(row, ['id', 'song_id', 'audio_id']) ?? index + 1
    const title = pickFirstStringField(row, ['title', 'song_title', 'name', 'audio_title'], `Song ${id}`)
    const artist = pickFirstStringField(
      row,
      ['artist', 'artist_name', 'artistTitle'],
      '',
    )
    return { ...row, id, title, artist }
  })
}

const parseLyrics = (row) => {
  const raw = row?.lyrics
  if (typeof raw === 'string') {
    return raw
      .split(/\r?\n/g)
      .map((l) => l.trim())
      .filter(Boolean)
  }

  const lines = row?.lyrics_lines
  if (Array.isArray(lines)) {
    return lines.map((l) => (typeof l === 'string' ? l.trim() : '')).filter(Boolean)
  }

  return []
}

export const fetchSongDetails = async (songId) => {
  const lookupKeys = ['id', 'song_id', 'audio_id']
  let lastError

  for (const key of lookupKeys) {
    const { data, error } = await supabase
      .from(SONG_DETAILS_TABLE)
      .select('*')
      .eq(key, songId)
      .single()

    if (!error && data) {
      const title = pickFirstStringField(data, ['title', 'song_title', 'name'], 'Unknown song')
      const artist = pickFirstStringField(data, ['artist', 'artist_name'], '')
      const audioUrl = pickFirstStringField(data, ['audio_url', 'audio_src', 'url', 'stream_url', 'file_url'], '')
      const lyrics = parseLyrics(data)

      return {
        ...data,
        id: songId,
        title,
        artist,
        audioUrl,
        lyrics,
      }
    }

    lastError = error
  }

  throw lastError ?? new Error('Could not load song details.')
}

export const fetchReviews = async (songId) => {
  const { data, error } = await supabase
    .from(REVIEWS_TABLE)
    .select('*')
    .eq(REVIEWS_SONG_ID_COLUMN, songId)
    .order(REVIEWS_CREATED_AT_COLUMN, { ascending: false })
    .limit(50)

  if (error) throw error

  return (data ?? []).map((row) => ({
    id: row.id ?? row[REVIEWS_CREATED_AT_COLUMN] ?? JSON.stringify(row),
    text: row[REVIEWS_TEXT_COLUMN] ?? '',
    createdAt: row[REVIEWS_CREATED_AT_COLUMN],
  }))
}

export const insertReview = async (songId, text) => {
  const payload = {
    [REVIEWS_SONG_ID_COLUMN]: songId,
    [REVIEWS_TEXT_COLUMN]: text,
  }

  const { data, error } = await supabase.from(REVIEWS_TABLE).insert(payload).select('*')
  if (error) throw error

  return data?.[0] ?? null
}

