"use client"

interface AdCategoryBadgeProps {
  category: 'earnable' | 'conditional' | 'view_only'
  className?: string
}

export default function AdCategoryBadge({ category, className = '' }: AdCategoryBadgeProps) {
  const getBadgeStyles = () => {
    switch (category) {
      case 'earnable':
        return {
          bg: 'bg-green-500/20',
          text: 'text-green-400',
          border: 'border-green-500/30',
          label: 'Earnable',
          icon: '💰'
        }
      case 'conditional':
        return {
          bg: 'bg-orange-500/20',
          text: 'text-orange-400',
          border: 'border-orange-500/30',
          label: 'Conditional',
          icon: '⚡'
        }
      case 'view_only':
        return {
          bg: 'bg-gray-500/20',
          text: 'text-gray-400',
          border: 'border-gray-500/30',
          label: 'View Only',
          icon: '👁️'
        }
      default:
        return {
          bg: 'bg-gray-500/20',
          text: 'text-gray-400',
          border: 'border-gray-500/30',
          label: 'Unknown',
          icon: '❓'
        }
    }
  }

  const styles = getBadgeStyles()

  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles.bg} ${styles.text} ${styles.border} ${className}`}
    >
      <span>{styles.icon}</span>
      <span>{styles.label}</span>
    </span>
  )
}

// Export helper function to get category description
export function getCategoryDescription(category: 'earnable' | 'conditional' | 'view_only'): string {
  switch (category) {
    case 'earnable':
      return 'Complete the task and earn money after admin approval'
    case 'conditional':
      return 'Complete specific conditions and submit proof for verification'
    case 'view_only':
      return 'View the ad - no earning, just for awareness'
    default:
      return 'Unknown category'
  }
}
