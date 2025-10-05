import React from 'react'
import { BookOpenIcon } from 'lucide-react'
const BookstoreLogo = ({ size = 'default' }) => {
  const sizeClasses = {
    small: 'text-xl',
    default: 'text-3xl',
    large: 'text-4xl',
  }
  return (
    <div className="flex items-center gap-2">
      <BookOpenIcon
        className="text-emerald-600"
        size={size === 'small' ? 20 : size === 'large' ? 32 : 24}
      />
      <span className={`font-bold ${sizeClasses[size]} text-emerald-700`}>
        BookHaven
      </span>
    </div>
  )
}
export default BookstoreLogo
