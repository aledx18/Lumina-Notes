import { inferRouterOutputs } from '@trpc/server'
import { ImageIcon, SmileIcon, X } from 'lucide-react'
import { ComponentRef, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import IconPicker from '@/components/icon-picker'
import { Button } from '@/components/ui/button'
import {
  useUpdateDocumentIcon,
  useUpdateDocumentName
} from '@/features/documents/hooks/use-suspense-document'
import { useCoverImage } from '@/hooks/use-cover-image'
import { AppRouter } from '@/trpc/routers/_app'

type RouterOutputs = inferRouterOutputs<AppRouter>
type DocumentType = RouterOutputs['documents']['getOne']

type EditorDocumentProps = {
  initialData: DocumentType
  preview?: boolean
}

export default function Toolbar({ initialData, preview }: EditorDocumentProps) {
  const inputRef = useRef<ComponentRef<'textarea'>>(null)
  const updateName = useUpdateDocumentName()
  const updateIcon = useUpdateDocumentIcon()
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialData.name)
  const coverImage = useCoverImage()

  const enableInput = () => {
    if (preview) return

    setIsEditing(true)
    setTimeout(() => {
      setValue(initialData.name)
      inputRef.current?.focus()
    }, 0)
  }

  const disableInput = () => setIsEditing(false)

  const handleSave = async () => {
    await updateName.mutateAsync({
      id: initialData.id,
      name: value || 'Untitled'
    })
  }

  const onInput = (value: string) => {
    setValue(value)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
      disableInput()
    }
  }

  const onIconSelect = (icon: string | undefined) => {
    updateIcon.mutateAsync({
      id: initialData.id,
      icon
    })
  }
  console.log('icon:', initialData.icon)

  return (
    <div>
      <div className='group'>
        {!!initialData.icon && !preview && (
          <div className='flex items-center gap-x-2 group/icon mt-4'>
            <IconPicker onChange={onIconSelect}>
              <p className='text-6xl hover:opacity-65 transition'>
                {initialData.icon}
              </p>
            </IconPicker>
            <Button
              className='opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs'
              onClick={() => onIconSelect(undefined)}
              size='xs'
              variant='outline'
            >
              <X />
            </Button>
          </div>
        )}
        {!!initialData.icon && preview && (
          <p className='text-6xl '>{initialData.icon}</p>
        )}
        <div className='opacity-10 group-hover:opacity-100 flex items-center gap-x-1 mt-4'>
          {!initialData.icon && !preview && (
            <IconPicker asChild onChange={onIconSelect}>
              <Button variant='outline' size='sm'>
                <SmileIcon className='size-4' />
                Add icon
              </Button>
            </IconPicker>
          )}
          {!initialData.coverImage && !preview && (
            <Button onClick={coverImage.onOpen} variant='outline' size='sm'>
              <ImageIcon className='size-4' />
              Add cover image
            </Button>
          )}
        </div>
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className='text-6xl bg-transparent font-bold  outline-none resize-none '
        />
      ) : (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <need to use onClick to enable input>
        // biome-ignore lint/a11y/noStaticElementInteractions: <need to use onClick to enable input>
        <div
          onClick={enableInput}
          className='pb-[11.5px] text-6xl font-bold outline-none'
        >
          {initialData.name}
        </div>
      )}
    </div>
  )
}
