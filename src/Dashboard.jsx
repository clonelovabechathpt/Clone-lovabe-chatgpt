import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './Dashboard.css'

const BUCKET = 'dashboard-images'

export default function Dashboard({ session }) {
  const userId = session.user.id

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function loadItems() {
    setLoading(true)
    const { data, error } = await supabase
      .from('dashboard_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setItems(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadItems()
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    setError(null)

    let imagePath = null

    if (file) {
      const ext = file.name.split('.').pop()
      const path = `${userId}/${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file)

      if (uploadError) {
        setError(uploadError.message)
        setSaving(false)
        return
      }
      imagePath = path
    }

    const { error: insertError } = await supabase.from('dashboard_items').insert({
      user_id: userId,
      title: title.trim(),
      description: description.trim() || null,
      image_path: imagePath,
    })

    if (insertError) {
      setError(insertError.message)
    } else {
      setTitle('')
      setDescription('')
      setFile(null)
      await loadItems()
    }
    setSaving(false)
  }

  async function handleDelete(item) {
    if (item.image_path) {
      await supabase.storage.from(BUCKET).remove([item.image_path])
    }
    const { error } = await supabase.from('dashboard_items').delete().eq('id', item.id)
    if (error) {
      setError(error.message)
    } else {
      setItems((prev) => prev.filter((i) => i.id !== item.id))
    }
  }

  function imageUrl(path) {
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
  }

  return (
    <section className="dash">
      <p className="dash-eyebrow">Dashboard</p>
      <div className="dash-title-row">
        <h1 className="dash-title">My uploads</h1>
        {!loading && (
          <span className="dash-count-badge">
            {items.length} {items.length === 1 ? 'entry' : 'entries'}
          </span>
        )}
      </div>
      <p className="dash-sub">Add, view, and remove your own entries — synced to Supabase.</p>

      <form className="dash-form" onSubmit={handleAdd}>
        <div className="dash-form-row">
          <label className="field">
            <span>Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Inverter test log"
              required
            />
          </label>
          <label className="field">
            <span>Image (optional)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <label className="field">
          <span>Description</span>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional notes"
          />
        </label>

        {error && <p className="dash-error">{error}</p>}

        <button className="dash-submit" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Add entry'}
        </button>
      </form>

      <div className="dash-list">
        {loading && <p className="dash-empty">Loading…</p>}

        {!loading && items.length === 0 && (
          <p className="dash-empty">Nothing here yet — add your first entry above.</p>
        )}

        {items.map((item) => (
          <article key={item.id} className="dash-item">
            {item.image_path && (
              <img
                className="dash-item-img"
                src={imageUrl(item.image_path)}
                alt={item.title}
              />
            )}
            <div className="dash-item-body">
              <h3>{item.title}</h3>
              {item.description && <p>{item.description}</p>}
              <span className="dash-item-date">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            </div>
            <button className="dash-item-delete" onClick={() => handleDelete(item)}>
              Delete
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
