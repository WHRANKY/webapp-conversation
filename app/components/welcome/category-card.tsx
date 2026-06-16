'use client'

import type { FC } from 'react'
import React from 'react'
import cn from 'classnames'
import type { CategoryCardMeta } from '@/config/categories'
import { CATEGORY_ICON_BG } from '@/config/categories'
import s from './category-card.module.css'

export interface CategoryCardProps {
  category: CategoryCardMeta
  highlighted?: boolean
  disabled?: boolean
  onClick: (label: string) => void
}

const CategoryCard: FC<CategoryCardProps> = ({
  category,
  highlighted = false,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        s.categoryCard,
        'w-full flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-white text-left cursor-pointer',
        highlighted && s.categoryCardHighlight,
        disabled && 'opacity-60 cursor-not-allowed',
      )}
      onClick={() => {
        if (!disabled) { onClick(category.label) }
      }}
    >
      <div
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-xl text-lg shrink-0',
          CATEGORY_ICON_BG[category.iconColor],
        )}
      >
        {category.emoji}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-gray-900">{category.title}</div>
        <div className="text-xs text-gray-500 mt-0.5 truncate">{category.subtitle}</div>
      </div>
    </button>
  )
}

export default React.memo(CategoryCard)
