'use client'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import Textarea from 'rc-textarea'
import s from './style.module.css'
import Answer from './answer'
import Question from './question'
import TopicPill from './topic-pill'
import type { FeedbackFunc } from './type'
import type { ChatItem, VisionFile, VisionSettings } from '@/types/app'
import { TransferMethod } from '@/types/app'
import Tooltip from '@/app/components/base/tooltip'
import Toast from '@/app/components/base/toast'
import ChatImageUploader from '@/app/components/base/image-uploader/chat-image-uploader'
import ImageList from '@/app/components/base/image-uploader/image-list'
import { useImageFiles } from '@/app/components/base/image-uploader/hooks'
import FileUploaderInAttachmentWrapper from '@/app/components/base/file-uploader-in-attachment'
import type { FileEntity, FileUpload } from '@/app/components/base/file-uploader-in-attachment/types'
import { getProcessedFiles } from '@/app/components/base/file-uploader-in-attachment/utils'
import { APP_INFO } from '@/config'

export interface IChatProps {
  chatList: ChatItem[]
  feedbackDisabled?: boolean
  isHideSendInput?: boolean
  onFeedback?: FeedbackFunc
  checkCanSend?: () => boolean
  onSend?: (message: string, files: VisionFile[]) => void
  useCurrentUserAvatar?: boolean
  isResponding?: boolean
  controlClearQuery?: number
  visionConfig?: VisionSettings
  fileConfig?: FileUpload
  suggestedQuestions?: string[]
  showLanding?: boolean
  onCategorySelect?: (label: string) => void
}

const Chat: FC<IChatProps> = ({
  chatList,
  feedbackDisabled = false,
  isHideSendInput = false,
  onFeedback,
  checkCanSend,
  onSend = () => { },
  useCurrentUserAvatar,
  isResponding,
  controlClearQuery,
  visionConfig,
  fileConfig,
  suggestedQuestions = [],
  showLanding = false,
  onCategorySelect,
}) => {
  const { t } = useTranslation()
  const { notify } = Toast
  const isUseInputMethod = useRef(false)
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)

  const [query, setQuery] = React.useState('')
  const queryRef = useRef('')

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setQuery(value)
    queryRef.current = value
  }

  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const valid = () => {
    const currentQuery = queryRef.current
    if (!currentQuery || currentQuery.trim() === '') {
      logError(t('app.errorMessage.valueOfVarRequired'))
      return false
    }
    return true
  }

  useEffect(() => {
    if (controlClearQuery) {
      setQuery('')
      queryRef.current = ''
    }
  }, [controlClearQuery])

  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLinkLoadError,
    onImageLinkLoadSuccess,
    onClear,
  } = useImageFiles()

  const [attachmentFiles, setAttachmentFiles] = React.useState<FileEntity[]>([])

  const handleSend = () => {
    if (!valid() || (checkCanSend && !checkCanSend())) { return }
    const hasPendingImageUploads = files.some(file => file.progress !== -1 && file.progress < 100)
    const hasPendingAttachmentUploads = attachmentFiles.some(file => file.progress !== -1 && file.progress < 100)
    if (hasPendingImageUploads || hasPendingAttachmentUploads) {
      logError(t('app.errorMessage.waitForFileUpload'))
      return
    }
    const imageFiles: VisionFile[] = files.filter(file => file.progress !== -1).map(fileItem => ({
      type: 'image',
      transfer_method: fileItem.type,
      url: fileItem.url,
      upload_file_id: fileItem.fileId,
    }))
    const docAndOtherFiles: VisionFile[] = getProcessedFiles(attachmentFiles)
    const combinedFiles: VisionFile[] = [...imageFiles, ...docAndOtherFiles]
    onSend(queryRef.current, combinedFiles)
    if (!files.find(item => item.type === TransferMethod.local_file && !item.fileId)) {
      if (files.length) { onClear() }
      if (!isResponding) {
        setQuery('')
        queryRef.current = ''
      }
    }
    if (!attachmentFiles.find(item => item.transferMethod === TransferMethod.local_file && !item.uploadedId)) { setAttachmentFiles([]) }
    setShowCategoryMenu(false)
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      if (!e.shiftKey && !isUseInputMethod.current) { handleSend() }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    isUseInputMethod.current = e.nativeEvent.isComposing
    if (e.code === 'Enter' && !e.shiftKey) {
      const result = query.replace(/\n$/, '')
      setQuery(result)
      queryRef.current = result
      e.preventDefault()
    }
  }

  const suggestionClick = (suggestion: string) => {
    if (onCategorySelect) {
      onCategorySelect(suggestion)
      return
    }
    setQuery(suggestion)
    queryRef.current = suggestion
    handleSend()
  }

  const handleFunctionSelect = () => {
    if (showLanding) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setShowCategoryMenu(prev => !prev)
  }

  const handleCategoryPick = (label: string) => {
    setShowCategoryMenu(false)
    if (onCategorySelect) {
      onCategorySelect(label)
    }
    else {
      suggestionClick(label)
    }
  }

  const composerPaddingLeft = visionConfig?.enabled ? 'pl-12' : 'pl-2'
  const hasUploadRow = visionConfig?.enabled || fileConfig?.enabled

  return (
    <div className={cn(!feedbackDisabled && !showLanding && 'px-4', !showLanding && 'h-full', 'max-w-2xl mx-auto w-full')}>
      {!showLanding && (
        <div className={cn('space-y-6', chatList.length > 0 && 'pt-4')}>
          {chatList.map((item) => {
            if (item.isAnswer) {
              const isLast = item.id === chatList[chatList.length - 1].id
              return (
                <Answer
                  key={item.id}
                  item={item}
                  feedbackDisabled={feedbackDisabled}
                  onFeedback={onFeedback}
                  isResponding={isResponding && isLast}
                  suggestionClick={suggestionClick}
                  appIcon={APP_INFO.icon}
                  appIconBackground={APP_INFO.icon_background}
                />
              )
            }
            return (
              <Question
                key={item.id}
                id={item.id}
                content={item.content}
                useCurrentUserAvatar={useCurrentUserAvatar}
                imgSrcs={(item.message_files && item.message_files?.length > 0) ? item.message_files.map(file => file.url) : []}
              />
            )
          })}
        </div>
      )}
      {
        !isHideSendInput && (
          <div
            className="fixed z-10 bottom-0 left-0 right-0 px-4 pb-4"
            style={{ boxShadow: 'var(--composer-shadow)' }}
          >
            <div className="max-w-2xl mx-auto w-full">
              {showCategoryMenu && suggestedQuestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 p-3 bg-white rounded-2xl border border-gray-100">
                  {suggestedQuestions.map(topic => (
                    <TopicPill
                      key={topic}
                      label={topic}
                      onClick={handleCategoryPick}
                    />
                  ))}
                </div>
              )}
              <div className="relative p-2 max-h-[160px] bg-white border border-gray-200 rounded-2xl shadow-sm overflow-y-auto">
                {
                  visionConfig?.enabled && (
                    <>
                      <div className="absolute bottom-14 left-3 flex items-center">
                        <ChatImageUploader
                          settings={visionConfig}
                          onUpload={onUpload}
                          disabled={files.length >= visionConfig.number_limits}
                        />
                        <div className="mx-1 w-px h-4 bg-black/5" />
                      </div>
                      <div className="pl-[52px]">
                        <ImageList
                          list={files}
                          onRemove={onRemove}
                          onReUpload={onReUpload}
                          onImageLinkLoadSuccess={onImageLinkLoadSuccess}
                          onImageLinkLoadError={onImageLinkLoadError}
                        />
                      </div>
                    </>
                  )
                }
                {
                  fileConfig?.enabled && (
                    <div className={`${visionConfig?.enabled ? 'pl-[52px]' : ''} mb-1`}>
                      <FileUploaderInAttachmentWrapper
                        fileConfig={fileConfig}
                        value={attachmentFiles}
                        onChange={setAttachmentFiles}
                      />
                    </div>
                  )
                }
                <Textarea
                  className={cn(
                    'block w-full pr-14 py-3 leading-5 max-h-none text-sm text-gray-700 outline-none appearance-none resize-none border-0',
                    composerPaddingLeft,
                    hasUploadRow && 'pb-10',
                  )}
                  placeholder={t('app.chat.inputPlaceholder') as string}
                  value={query}
                  onChange={handleContentChange}
                  onKeyUp={handleKeyUp}
                  onKeyDown={handleKeyDown}
                  autoSize
                />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-primary-600 border border-primary-200 rounded-full bg-white hover:bg-primary-50 transition-colors"
                    onClick={handleFunctionSelect}
                  >
                    <span>🗂️</span>
                    <span>{t('app.chat.functionSelect')}</span>
                  </button>
                  <Tooltip
                    selector="send-tip"
                    htmlContent={
                      <div>
                        <div>{t('common.operation.send')} Enter</div>
                        <div>{t('common.operation.lineBreak')} Shift Enter</div>
                      </div>
                    }
                  >
                    <button
                      type="button"
                      className={cn(s.sendBtn, 'w-9 h-9 cursor-pointer rounded-full shrink-0')}
                      onClick={handleSend}
                      aria-label={t('common.operation.send') as string}
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default React.memo(Chat)
