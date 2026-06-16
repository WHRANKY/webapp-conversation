'use client'

import type { FC } from 'react'
import React, { useCallback, useEffect, useState } from 'react'
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  Bars3Icon,
  BellIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import AppIcon from '@/app/components/base/app-icon'
import Toast from '@/app/components/base/toast'
import type { AppInfo } from '@/types/app'

export interface IHeaderProps {
  title: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
  siteInfo?: AppInfo
}

const HeaderIconButton: FC<{ onClick?: () => void, children: React.ReactNode, ariaLabel?: string }> = ({
  onClick,
  children,
  ariaLabel,
}) => (
  <button
    type="button"
    aria-label={ariaLabel}
    className="flex items-center justify-center h-8 w-8 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
    onClick={onClick}
  >
    {children}
  </button>
)

const Header: FC<IHeaderProps> = ({
  title,
  isMobile,
  onShowSideBar,
  onCreateNewChat,
  siteInfo,
}) => {
  const { notify } = Toast
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleToggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
      return
    }
    void document.documentElement.requestFullscreen().catch(() => {
      notify({ type: 'info', message: 'Fullscreen is not available in this browser.' })
    })
  }, [notify])

  const handleBellClick = useCallback(() => {
    notify({ type: 'info', message: 'No new notifications.' })
  }, [notify])

  const handleClose = useCallback(() => {
    if (window.opener) {
      window.close()
      return
    }
    if (window.history.length > 1) {
      window.history.back()
      return
    }
    notify({ type: 'info', message: 'Close is not available in this context.' })
  }, [notify])

  return (
    <div className="sticky top-0 z-[60] shrink-0 flex items-center justify-between h-14 px-4 bg-white border-b border-gray-100">
      <div className="flex items-center gap-1">
        <HeaderIconButton
          ariaLabel="Open menu"
          onClick={() => onShowSideBar?.()}
        >
          <Bars3Icon className="h-5 w-5" />
        </HeaderIconButton>
      </div>
      <div className="flex items-center space-x-2 min-w-0">
        <AppIcon
          size="small"
          icon={siteInfo?.icon}
          background={siteInfo?.icon_background}
        />
        <div className="text-sm text-gray-900 font-semibold truncate">{title}</div>
      </div>
      <div className="flex items-center gap-1">
        {isMobile
          ? (
            <HeaderIconButton
              ariaLabel="New chat"
              onClick={() => onCreateNewChat?.()}
            >
              <PencilSquareIcon className="h-5 w-5" />
            </HeaderIconButton>
          )
          : (
            <>
              <HeaderIconButton
                ariaLabel="Toggle fullscreen"
                onClick={handleToggleFullscreen}
              >
                {isFullscreen
                  ? <ArrowsPointingInIcon className="h-5 w-5" />
                  : <ArrowsPointingOutIcon className="h-5 w-5" />}
              </HeaderIconButton>
              <HeaderIconButton
                ariaLabel="Notifications"
                onClick={handleBellClick}
              >
                <BellIcon className="h-5 w-5" />
              </HeaderIconButton>
              <HeaderIconButton
                ariaLabel="Close"
                onClick={handleClose}
              >
                <XMarkIcon className="h-5 w-5" />
              </HeaderIconButton>
            </>
          )}
      </div>
    </div>
  )
}

export default React.memo(Header)
