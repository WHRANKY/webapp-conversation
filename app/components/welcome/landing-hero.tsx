'use client'

import type { FC } from 'react'
import React, { useMemo } from 'react'
import cn from 'classnames'
import { CATEGORY_CARDS } from '@/config/categories'
import CategoryCard from './category-card'
import TopicPill from '@/app/components/chat/topic-pill'
import s from './category-card.module.css'

export interface LandingHeroProps {
  openingStatement?: string
  description?: string
  suggestedQuestions?: string[]
  onCategorySelect: (label: string) => void
  isResponding?: boolean
}

function parseOpeningStatement(statement: string): { headline: string, subtext: string } {
  const parts = statement.split('\n').map(line => line.trim()).filter(Boolean)
  if (parts.length === 0) {
    return { headline: '', subtext: '' }
  }
  if (parts.length === 1) {
    return { headline: parts[0], subtext: '' }
  }
  return {
    headline: parts[0],
    subtext: parts.slice(1).join(' '),
  }
}

const LandingHero: FC<LandingHeroProps> = ({
  openingStatement = '',
  description = '',
  suggestedQuestions = [],
  onCategorySelect,
  isResponding = false,
}) => {
  const { headline, subtext } = useMemo(
    () => parseOpeningStatement(openingStatement),
    [openingStatement],
  )

  const cards = useMemo(() => {
    if (suggestedQuestions.length === 0) {
      return CATEGORY_CARDS
    }
    const byLabel = new Map(CATEGORY_CARDS.map(card => [card.label, card]))
    return suggestedQuestions
      .map((label) => {
        const meta = byLabel.get(label)
        if (meta) {
          return meta
        }
        const emojiMatch = /^(\S+)\s+(.+)$/.exec(label)
        return {
          label,
          title: emojiMatch?.[2] || label,
          subtitle: '',
          iconColor: 'gray' as const,
          emoji: emojiMatch?.[1] || '💬',
        }
      })
  }, [suggestedQuestions])

  const pillTopics = useMemo(() => {
    if (suggestedQuestions.length <= 4) {
      return suggestedQuestions
    }
    return suggestedQuestions.slice(-4)
  }, [suggestedQuestions])

  const displayDescription = subtext || description

  return (
    <div className="relative z-10 px-4 pt-6 pb-4 max-w-2xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 leading-snug">
          {headline || description}
        </h1>
        {displayDescription && headline && (
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            {displayDescription}
          </p>
        )}
      </div>

      <div className="space-y-3 mb-5">
        {cards.map((category, index) => (
          <CategoryCard
            key={category.label}
            category={category}
            highlighted={index === 2}
            disabled={isResponding}
            onClick={onCategorySelect}
          />
        ))}
      </div>

      {pillTopics.length > 0 && (
        <div className={cn(s.pillRow, 'flex gap-2 overflow-x-auto pb-1')}>
          {pillTopics.map(topic => (
            <TopicPill
              key={topic}
              label={topic}
              disabled={isResponding}
              onClick={onCategorySelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default React.memo(LandingHero)
