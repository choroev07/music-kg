import { useEffect, useMemo, useState } from 'react'
import { Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { fetchReviews, insertReview } from '../services/supabaseClient'

export default function ReviewSection({ songId }) {
  const { t } = useTranslation()
  const [reviews, setReviews] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitBusy, setSubmitBusy] = useState(false)

  const formatted = useMemo(
    () =>
      reviews.map((r) => ({
        id: r.id,
        text: r.text,
        time: r.createdAt ? new Date(r.createdAt) : null,
      })),
    [reviews],
  )

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchReviews(songId)
        setReviews(data)
      } catch (e) {
        setError(
          e?.message ??
            'Could not load reviews. If you just created the table, ensure RLS and column names match.',
        )
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [songId])

  const onSubmit = async (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return

    setSubmitBusy(true)
    setError('')
    try {
      await insertReview(songId, trimmed)
      setText('')
      const data = await fetchReviews(songId)
      setReviews(data)
    } catch (err) {
      setError(err?.message ?? 'Could not submit review.')
    } finally {
      setSubmitBusy(false)
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white">{t('reviews')}</p>
        <p className="text-xs text-zinc-400">{reviews.length ? `${reviews.length} ${t('total')}` : t('beFirst')}</p>
      </div>

      <form onSubmit={onSubmit} className="mt-4">
        <label className="text-xs text-zinc-400" htmlFor="reviewText">
          {t('writeComment')}
        </label>
        <textarea
          id="reviewText"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="mt-2 w-full resize-none rounded-xl border border-zinc-700 bg-black/30 p-3 text-sm outline-none ring-0 focus:border-emerald-500/60"
          placeholder={t('shareThoughts')}
        />

        <button
          type="submit"
          disabled={submitBusy}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={16} />
          {submitBusy ? t('posting') : t('postReview')}
        </button>

        {error ? (
          <p className="mt-3 rounded-lg border border-amber-700/40 bg-amber-900/20 px-3 py-2 text-sm text-amber-200">
            {error}
          </p>
        ) : null}
      </form>

      <div className="mt-5">
        {loading ? (
          <p className="text-sm text-zinc-400">{t('loadingReviews')}</p>
        ) : formatted.length ? (
          <ul className="space-y-3">
            {formatted.map((r) => (
              <li key={r.id} className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-3">
                <p className="text-sm text-zinc-100">{r.text}</p>
                <p className="mt-1 text-xs text-zinc-400">
                  {r.time ? r.time.toLocaleString() : t('unknownTime')}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-400">{t('noReviews')}</p>
        )}
      </div>
    </div>
  )
}

