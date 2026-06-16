import type { FC } from 'react'
import classNames from 'classnames'
import style from './style.module.css'
import { APP_INFO } from '@/config'

export interface AppIconProps {
  size?: 'xs' | 'tiny' | 'small' | 'medium' | 'large'
  rounded?: boolean
  icon?: string
  background?: string
  className?: string
}

const AppIcon: FC<AppIconProps> = ({
  size = 'medium',
  rounded = false,
  icon = APP_INFO.icon,
  background = APP_INFO.icon_background,
  className,
}) => {
  return (
    <span
      className={classNames(
        style.appIcon,
        size !== 'medium' && style[size],
        rounded && style.rounded,
        className ?? '',
      )}
      style={{
        background: background || undefined,
      }}
    >
      {icon || '🤖'}
    </span>
  )
}

export default AppIcon
