import type { AppInfo } from '@/types/app'
import { UI_CONFIG } from '@/config/ui'

export const APP_ID = `${process.env.NEXT_PUBLIC_APP_ID}`
export const API_KEY = `${process.env.NEXT_PUBLIC_APP_KEY}`
export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`
export const APP_INFO: AppInfo = {
  title: '钛虎机器人售后客服助手「钛宝」',
  description: '钛虎机器人售后客服助手「钛宝」— 专业解答产品使用、故障排查与售后服务',
  copyright: '钛虎机器人',
  privacy_policy: '',
  default_language: 'zh-Hans',
  disable_session_same_site: false, // set it to true if you want to embed the chatbot in an iframe
  icon: UI_CONFIG.appIcon,
  icon_background: UI_CONFIG.appIconBackground,
}

export const isShowPrompt = false
export const promptTemplate = 'I want you to act as a javascript console.'

export const API_PREFIX = '/api'

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48
