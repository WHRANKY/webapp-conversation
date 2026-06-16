'use client'

import type { FC } from 'react'
import React from 'react'
import cn from 'classnames'

export interface TopicPillProps {
  label: string
  onClick?: (label: string) => void
  className?: string
  disabled?: boolean
}

const TopicPill: FC<TopicPillProps> = ({ label, onClick, className, disabled = false }) => {
  const Tag = onClick ? 'button' : 'span'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      disabled={onClick ? disabled : undefined}
      className={cn(
        'inline-flex items-center shrink-0 px-3 py-1.5 rounded-full text-xs text-gray-700 bg-gray-100 border border-gray-200',
        onClick && !disabled && 'cursor-pointer hover:bg-gray-200 transition-colors',
        disabled && 'opacity-60 cursor-not-allowed',
        className,
      )}
      onClick={onClick && !disabled ? () => onClick(label) : undefined}
    >
      {label}
    </Tag>
  )
}

export default React.memo(TopicPill)
