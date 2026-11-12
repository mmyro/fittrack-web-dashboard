import { ACTIVITY_TYPES, type ActivityType } from '../types'

export const FALLBACK_IMAGE = '/images/activities/fallback.svg'

interface ActivityMeta {
  label: string
  image: string
  alt: string
  badgeClass: string
  color: string
}

// The only place that knows the image path and colors of each category
export const activityConfig: Record<ActivityType, ActivityMeta> = {
  Cardio: {
    label: 'Cardio',
    image: '/images/activities/cardio.jpg',
    alt: 'Person running outdoors',
    badgeClass: 'bg-red-100 text-red-700',
    color: '#dc2626',
  },
  Gym: {
    label: 'Gym',
    image: '/images/activities/gym.jpg',
    alt: 'Weights in a gym',
    badgeClass: 'bg-indigo-100 text-indigo-700',
    color: '#4f46e5',
  },
  Football: {
    label: 'Football',
    image: '/images/activities/football.jpg',
    alt: 'Football on a pitch',
    badgeClass: 'bg-amber-100 text-amber-800',
    color: '#d97706',
  },
  Flexibility: {
    label: 'Flexibility',
    image: '/images/activities/flexibility.jpg',
    alt: 'Person doing yoga',
    badgeClass: 'bg-violet-100 text-violet-700',
    color: '#7c3aed',
  },
  Other: {
    label: 'Other',
    image: '/images/activities/other.jpg',
    alt: 'Fitness equipment',
    badgeClass: 'bg-slate-100 text-slate-700',
    color: '#64748b',
  },
}

function isActivityType(value: string): value is ActivityType {
  return (ACTIVITY_TYPES as readonly string[]).includes(value)
}

export function getActivityMeta(type: string): ActivityMeta {
  if (isActivityType(type)) {
    return activityConfig[type]
  }
  return {
    label: type,
    image: FALLBACK_IMAGE,
    alt: 'Fitness',
    badgeClass: 'bg-slate-100 text-slate-700',
    color: '#64748b',
  }
}

export function getActivityImage(type: string): string {
  return getActivityMeta(type).image
}