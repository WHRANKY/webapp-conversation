export type CategoryIconColor = 'blue' | 'green' | 'orange' | 'pink' | 'purple' | 'yellow' | 'gray'

export interface CategoryCardMeta {
  label: string
  title: string
  subtitle: string
  iconColor: CategoryIconColor
  emoji: string
}

/**
 * Presentation metadata for DSL suggested_questions labels.
 * Clicking a card still sends the full `label` string to Dify.
 */
export const CATEGORY_CARDS: CategoryCardMeta[] = [
  {
    label: '📖 使用说明',
    title: '使用说明',
    subtitle: '产品操作、安装与日常使用方法',
    iconColor: 'blue',
    emoji: '📖',
  },
  {
    label: '🔧 故障排查',
    title: '故障排查',
    subtitle: '异常现象诊断与处理步骤',
    iconColor: 'green',
    emoji: '🔧',
  },
  {
    label: '📋 规格参数',
    title: '规格参数',
    subtitle: '型号、性能与技术参数查询',
    iconColor: 'orange',
    emoji: '📋',
  },
  {
    label: '🎯 选型搭配',
    title: '选型搭配',
    subtitle: '根据场景推荐合适产品组合',
    iconColor: 'pink',
    emoji: '🎯',
  },
  {
    label: '🔌 通讯线材',
    title: '通讯线材',
    subtitle: '接口、线缆与连接方案',
    iconColor: 'purple',
    emoji: '🔌',
  },
  {
    label: '🛡️ 售后服务',
    title: '售后服务',
    subtitle: '保修、维修与售后政策',
    iconColor: 'yellow',
    emoji: '🛡️',
  },
  {
    label: '💬 其他',
    title: '其他',
    subtitle: '未归类问题与综合咨询',
    iconColor: 'gray',
    emoji: '💬',
  },
]

export const CATEGORY_ICON_BG: Record<CategoryIconColor, string> = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  orange: 'bg-orange-50 text-orange-600',
  pink: 'bg-pink-50 text-pink-600',
  purple: 'bg-purple-50 text-purple-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  gray: 'bg-gray-100 text-gray-600',
}
