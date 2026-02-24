import { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ children, hover = false, padding = 'md', className = '', ...props }: CardProps) {
  const baseStyles = 'bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-800/50'
  
  const hoverStyles = hover 
    ? 'transition-all duration-200 hover:shadow-lg hover:scale-[1.01] cursor-pointer active:scale-[0.99]' 
    : ''
  
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  return (
    <div 
      className={`${baseStyles} ${hoverStyles} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
