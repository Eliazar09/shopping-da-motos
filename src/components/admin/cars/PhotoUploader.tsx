'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Star, Loader2, ImageIcon } from 'lucide-react'
import { createDynamicClient } from '@/lib/supabase/client'
import { updateCar } from '@/app/(admin)/admin/carros/actions'

interface Props {
  carId: string
  initialImages: string[]
  initialCover: string
}

async function compressImage(file: File): Promise<Blob> {
  return new Promise(resolve => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const MAX = 1200
      const ratio = Math.min(1, MAX / Math.max(img.width, img.height))
      const w = Math.round(img.width * ratio)
      const h = Math.round(img.height * ratio)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)
      canvas.toBlob(blob => {
        URL.revokeObjectURL(url)
        resolve(blob!)
      }, 'image/jpeg', 0.85)
    }
    img.src = url
  })
}

export default function PhotoUploader({ carId, initialImages, initialCover }: Props) {
  const [images,   setImages]   = useState<string[]>(initialImages)
  const [cover,    setCover]    = useState(initialCover || initialImages[0] || '')
  const [uploading,setUploading]= useState(false)
  const [saving,   setSaving]   = useState(false)
  const [uploadErr,setUploadErr]= useState('')

  async function persistImages(imgs: string[], coverUrl: string) {
    setSaving(true)
    await updateCar(carId, { images: imgs, cover_image: coverUrl })
    setSaving(false)
  }

  async function handleFiles(files: File[]) {
    if (files.length === 0) return
    setUploading(true)
    setUploadErr('')

    const supabase = createDynamicClient()
    const newUrls: string[] = []

    for (const file of files) {
      const blob     = await compressImage(file)
      const fileName = `${crypto.randomUUID()}.jpg`
      const path     = `${carId}/${fileName}`

      const { error } = await supabase.storage
        .from('car-photos')
        .upload(path, blob, { contentType: 'image/jpeg', upsert: false })

      if (error) {
        setUploadErr(`Erro ao enviar ${file.name}: ${error.message}`)
        continue
      }

      const { data: { publicUrl } } = supabase.storage.from('car-photos').getPublicUrl(path)
      newUrls.push(publicUrl)
    }

    const updated  = [...images, ...newUrls]
    const newCover = cover || newUrls[0] || ''
    setImages(updated)
    setCover(newCover)
    await persistImages(updated, newCover)
    setUploading(false)
  }

  const onDrop = useCallback((accepted: File[]) => {
    handleFiles(accepted)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, cover])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    multiple: true,
    disabled: uploading,
  })

  async function removeImage(url: string) {
    const supabase = createDynamicClient()
    const parts = url.split('/car-photos/')
    if (parts[1]) {
      await supabase.storage.from('car-photos').remove([parts[1]])
    }
    const updated  = images.filter(u => u !== url)
    const newCover = cover === url ? (updated[0] ?? '') : cover
    setImages(updated)
    setCover(newCover)
    await persistImages(updated, newCover)
  }

  async function setCoverImage(url: string) {
    setCover(url)
    await persistImages(images, url)
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed py-10 text-center transition-colors ${
          isDragActive
            ? 'border-accent bg-red-50'
            : 'border-marine-200 bg-marine-50 hover:border-accent hover:bg-red-50'
        } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <>
            <Loader2 size={28} className="mb-2 animate-spin text-accent" />
            <p className="text-[13px] font-semibold text-marine-600">Enviando fotos…</p>
          </>
        ) : (
          <>
            <Upload size={28} className="mb-2 text-marine-300" />
            <p className="text-[13px] font-semibold text-marine-600">
              {isDragActive ? 'Solte as fotos aqui' : 'Arraste fotos ou clique para selecionar'}
            </p>
            <p className="text-[11px] text-marine-400">JPG, PNG ou WebP · compressão automática</p>
          </>
        )}
      </div>

      {uploadErr && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
          {uploadErr}
        </p>
      )}

      {saving && (
        <p className="flex items-center gap-1.5 text-[11px] text-marine-400">
          <Loader2 size={11} className="animate-spin" />
          Salvando…
        </p>
      )}

      {/* Photo grid */}
      {images.length > 0 ? (
        <>
          <p className="text-[11px] text-marine-400">
            {images.length} {images.length === 1 ? 'foto' : 'fotos'} ·{' '}
            Passe o mouse sobre uma foto para definir a capa ou remover.
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map(url => (
              <div key={url} className="group relative aspect-square overflow-hidden rounded-xl bg-marine-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />

                {/* Cover badge */}
                {url === cover && (
                  <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-md bg-accent px-1.5 py-0.5 text-[9px] font-bold text-white">
                    <Star size={8} />
                    Capa
                  </div>
                )}

                {/* Hover actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  {url !== cover && (
                    <button
                      type="button"
                      onClick={() => setCoverImage(url)}
                      className="rounded-lg bg-white/90 p-1.5 text-marine-800 hover:bg-white"
                      title="Definir como capa"
                    >
                      <Star size={12} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="rounded-lg bg-white/90 p-1.5 text-accent hover:bg-white"
                    title="Remover foto"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        !uploading && (
          <div className="flex items-center gap-2 text-[12px] text-marine-400">
            <ImageIcon size={14} />
            Nenhuma foto adicionada ainda.
          </div>
        )
      )}
    </div>
  )
}
