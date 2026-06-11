'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Pin, Check, X, Loader2, StickyNote, Pencil, Trash2 } from 'lucide-react'
import { createDynamicClient } from '@/lib/supabase/client'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import EmptyState from '@/components/admin/ui/EmptyState'
import { SkeletonCard } from '@/components/admin/ui/Skeleton'

const TAGS = ['Cliente', 'Lembrete', 'Trabalho', 'Pessoal', 'Importante'] as const
const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  Cliente:    { bg: '#EFF6FF', text: '#2563EB' },
  Lembrete:   { bg: '#FFFBEB', text: '#D97706' },
  Trabalho:   { bg: '#F3F4F6', text: '#4B5563' },
  Pessoal:    { bg: '#F5F3FF', text: '#7C3AED' },
  Importante: { bg: '#FEE2E2', text: '#DC2626' },
}

interface Note {
  id: string
  title: string | null
  content: string
  tags: string[]
  is_pinned: boolean
  is_completed: boolean
  created_at: string
  updated_at: string
}

type EditingNote = Partial<Note> & { id?: string }

export default function AnotacoesPage() {
  const [notes, setNotes]         = useState<Note[]>([])
  const [loading, setLoading]     = useState(true)
  const [tableError, setTableError] = useState(false)
  const [search, setSearch]       = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [modal, setModal]         = useState(false)
  const [editing, setEditing]     = useState<EditingNote>({})
  const [saving, setSaving]       = useState(false)
  const [deleting, setDeleting]   = useState<string | null>(null)

  async function loadNotes() {
    const supabase = createDynamicClient()
    const { data, error } = await supabase
      .from('notes')
      .select('id,title,content,tags,is_pinned,is_completed,created_at,updated_at')
      .order('is_pinned', { ascending: false })
      .order('updated_at', { ascending: false })
    if (error) { setTableError(true); setLoading(false); return }
    setNotes((data ?? []) as Note[])
    setLoading(false)
  }

  useEffect(() => { loadNotes() }, [])

  const filtered = useMemo(() => {
    return notes.filter(n => {
      const matchSearch = !search ||
        (n.title ?? '').toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase())
      const matchTag = !activeTag || n.tags.includes(activeTag)
      return matchSearch && matchTag
    })
  }, [notes, search, activeTag])

  function openNew() {
    setEditing({ title: '', content: '', tags: [], is_pinned: false })
    setModal(true)
  }

  function openEdit(note: Note) {
    setEditing({ ...note })
    setModal(true)
  }

  async function handleSave() {
    if (!editing.content?.trim()) return
    setSaving(true)
    const supabase = createDynamicClient()

    if (editing.id) {
      await supabase.from('notes').update({
        title: editing.title?.trim() || null,
        content: editing.content.trim(),
        tags: editing.tags ?? [],
        is_pinned: editing.is_pinned ?? false,
      }).eq('id', editing.id)
    } else {
      await supabase.from('notes').insert({
        title: editing.title?.trim() || null,
        content: editing.content.trim(),
        tags: editing.tags ?? [],
        is_pinned: editing.is_pinned ?? false,
      })
    }

    setSaving(false)
    setModal(false)
    loadNotes()
  }

  async function togglePin(note: Note) {
    const supabase = createDynamicClient()
    await supabase.from('notes').update({ is_pinned: !note.is_pinned }).eq('id', note.id)
    setNotes(prev => prev.map(n => n.id === note.id ? { ...n, is_pinned: !n.is_pinned } : n)
      .sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0)))
  }

  async function toggleDone(note: Note) {
    const supabase = createDynamicClient()
    await supabase.from('notes').update({ is_completed: !note.is_completed }).eq('id', note.id)
    setNotes(prev => prev.map(n => n.id === note.id ? { ...n, is_completed: !n.is_completed } : n))
  }

  async function deleteNote(id: string) {
    setDeleting(id)
    const supabase = createDynamicClient()
    await supabase.from('notes').delete().eq('id', id)
    setNotes(prev => prev.filter(n => n.id !== id))
    setDeleting(null)
  }

  function toggleEditTag(tag: string) {
    setEditing(prev => ({
      ...prev,
      tags: prev.tags?.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...(prev.tags ?? []), tag],
    }))
  }

  if (tableError) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center p-8 text-center">
        <StickyNote size={48} className="mb-4 text-amber-400" />
        <h2 className="text-[20px] font-bold text-marine-900" style={{ fontFamily: 'var(--font-oswald)' }}>
          Tabela não encontrada
        </h2>
        <p className="mt-2 max-w-sm text-[13px] text-marine-500">
          Execute o SQL abaixo no Supabase SQL Editor para criar a tabela <code className="rounded bg-marine-50 px-1 font-mono">notes</code>.
        </p>
        <pre className="mt-4 max-w-lg overflow-x-auto rounded-xl bg-marine-900 p-4 text-left text-[11px] text-marine-200">
{`CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notes_auth" ON notes
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();`}
        </pre>
      </div>
    )
  }

  return (
    <div className="min-h-full p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-marine-500">Ferramentas</p>
          <h1
            className="mt-1 text-[26px] font-bold text-marine-900"
            style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.01em' }}
          >
            Anotações
          </h1>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
          style={{ boxShadow: '0 4px 12px rgba(227,30,36,0.25)' }}
        >
          <Plus size={15} />
          Nova Anotação
        </button>
      </div>

      {/* Search + tag filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-marine-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar anotações…"
            className="w-full rounded-xl border border-marine-100 bg-white py-2.5 pl-10 pr-4 text-[13px] outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TAGS.map(tag => {
            const c = TAG_COLORS[tag]
            const active = activeTag === tag
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(active ? null : tag)}
                className="rounded-full px-3 py-1 text-[11px] font-bold transition-all"
                style={active
                  ? { background: c.text, color: '#fff' }
                  : { background: c.bg, color: c.text }
                }
              >
                {tag}
              </button>
            )
          })}
        </div>
      </div>

      {/* Notes grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title={search || activeTag ? 'Nenhuma anotação encontrada' : 'Nenhuma anotação ainda'}
          description={!search && !activeTag ? 'Organize lembretes, ideias e tarefas em um só lugar.' : undefined}
          action={!search && !activeTag ? (
            <button
              onClick={openNew}
              className="rounded-xl bg-accent px-5 py-2.5 text-[13px] font-bold text-white hover:opacity-90"
            >
              + Nova Anotação
            </button>
          ) : undefined}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((note, i) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.28), ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(13,13,15,0.09)' }}
              className={`group relative flex flex-col rounded-2xl bg-white p-5 transition-shadow ${
                note.is_pinned ? 'ring-1 ring-accent/25' : ''
              }`}
              style={{ border: '1px solid #E4E7EB', boxShadow: '0 2px 8px rgba(13,13,15,0.06)' }}
            >
              {/* Pin indicator */}
              {note.is_pinned && (
                <span className="absolute right-3 top-3 text-accent">
                  <Pin size={12} />
                </span>
              )}

              {/* Title */}
              <p className={`pr-5 text-[14px] font-semibold text-marine-900 ${note.is_completed ? 'line-through opacity-50' : ''}`}>
                {note.title || <span className="italic text-marine-400">Sem título</span>}
              </p>

              {/* Content */}
              <p className={`mt-1.5 line-clamp-3 flex-1 text-[12px] leading-relaxed text-marine-600 ${note.is_completed ? 'opacity-50' : ''}`}>
                {note.content}
              </p>

              {/* Tags */}
              {note.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {note.tags.map(tag => {
                    const c = TAG_COLORS[tag] ?? { bg: '#F3F4F6', text: '#4B5563' }
                    return (
                      <span
                        key={tag}
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{ background: c.bg, color: c.text }}
                      >
                        {tag}
                      </span>
                    )
                  })}
                </div>
              )}

              {/* Footer */}
              <div className="mt-3 flex items-center justify-between border-t border-marine-50 pt-3">
                <span className="text-[10px] text-marine-400">
                  {formatDistanceToNow(parseISO(note.updated_at), { addSuffix: true, locale: ptBR })}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleDone(note)}
                    title={note.is_completed ? 'Desmarcar' : 'Marcar como feita'}
                    className={`rounded-lg p-1.5 transition-colors ${note.is_completed ? 'text-emerald-500' : 'text-marine-300 hover:text-emerald-500'}`}
                  >
                    <Check size={13} />
                  </button>
                  <button
                    onClick={() => togglePin(note)}
                    title={note.is_pinned ? 'Desafixar' : 'Fixar'}
                    className={`rounded-lg p-1.5 transition-colors ${note.is_pinned ? 'text-accent' : 'text-marine-300 hover:text-accent'}`}
                  >
                    <Pin size={13} />
                  </button>
                  <button
                    onClick={() => openEdit(note)}
                    className="rounded-lg p-1.5 text-marine-300 transition-colors hover:text-marine-700"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    disabled={deleting === note.id}
                    className="rounded-lg p-1.5 text-marine-300 transition-colors hover:text-accent"
                  >
                    {deleting === note.id
                      ? <Loader2 size={13} className="animate-spin" />
                      : <Trash2 size={13} />
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal criar/editar */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModal(false)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-2xl bg-white p-6 md:inset-0 md:m-auto md:h-fit md:rounded-2xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[18px] font-bold text-marine-900" style={{ fontFamily: 'var(--font-oswald)' }}>
                  {editing.id ? 'Editar Anotação' : 'Nova Anotação'}
                </h2>
                <button onClick={() => setModal(false)} className="text-marine-400 hover:text-marine-700">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <input
                  type="text"
                  value={editing.title ?? ''}
                  onChange={e => setEditing(p => ({ ...p, title: e.target.value }))}
                  placeholder="Título (opcional)"
                  className="w-full rounded-xl border border-marine-100 bg-marine-50 px-4 py-2.5 text-[14px] font-semibold text-marine-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
                />

                {/* Content */}
                <textarea
                  value={editing.content ?? ''}
                  onChange={e => setEditing(p => ({ ...p, content: e.target.value }))}
                  rows={5}
                  placeholder="Escreva sua anotação aqui…"
                  className="w-full resize-none rounded-xl border border-marine-100 bg-white px-4 py-3 text-[14px] leading-relaxed text-marine-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
                  autoFocus
                />

                {/* Tags */}
                <div>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-marine-500">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {TAGS.map(tag => {
                      const c = TAG_COLORS[tag]
                      const active = (editing.tags ?? []).includes(tag)
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleEditTag(tag)}
                          className="rounded-full px-3 py-1 text-[11px] font-bold transition-all"
                          style={active
                            ? { background: c.text, color: '#fff' }
                            : { background: c.bg, color: c.text }
                          }
                        >
                          {tag}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Pin toggle */}
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={editing.is_pinned ?? false}
                    onChange={e => setEditing(p => ({ ...p, is_pinned: e.target.checked }))}
                    className="h-4 w-4 accent-accent"
                  />
                  <span className="text-[13px] font-medium text-marine-700">Fixar no topo</span>
                </label>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setModal(false)}
                    className="flex-1 rounded-xl border border-marine-200 py-2.5 text-[13px] font-semibold text-marine-700 hover:bg-marine-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !editing.content?.trim()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-[13px] font-bold text-white disabled:opacity-60"
                  >
                    {saving ? <><Loader2 size={14} className="animate-spin" /> Salvando…</> : 'Salvar'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
