import { useState } from 'react'
import { FALLBACK_IMAGE, getActivityMeta } from '../../config/activityImages'

interface ActivityImageProps {
  type: string
  className?: string
}

export function ActivityImage({ type, className = '' }: ActivityImageProps) {
  const meta = getActivityMeta(type)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  // If this image failed to load, show the fallback instead
  const showFallback = failedSrc === meta.image
  const src = showFallback ? FALLBACK_IMAGE : meta.image

  return (
    <img
      src={src}
      alt={showFallback ? 'Fitness' : meta.alt}
      width={800}
      height={450}
      loading="lazy"
      onError={() => setFailedSrc(meta.image)}
      className={`aspect-video w-full object-cover ${className}`}
    />
  )
}