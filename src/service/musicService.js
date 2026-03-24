import { supabase } from '../supabase'



const normalizeTrack = (track, index) => ({
  id: track.id ?? index + 1,
  title: track.title ?? track.name ?? `Track ${index + 1}`,
  artist: track.artist ?? track.artist_name ?? 'Unknown Artist',
  album: track.album ?? track.album_name ?? 'Single',
  duration: track.duration ?? '3:00',
  plays: Number(track.plays ?? 0),
})

export const getTracks = async () => {
  const { data, error } = await supabase
    .from('audios')
    .select('*')
    console.log('Supabase response:', { data, error })

  if (error) {
    return {
      data,
      usedFallback: true,
      errorMessage:
        'Could not read "tracks" from Supabase yet. Showing demo tracks for now.',
    }
  }

  return {
    data: (data ?? []).map(normalizeTrack),
    usedFallback: false,
    errorMessage: '',
  }
}
