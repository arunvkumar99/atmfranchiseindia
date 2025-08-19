import { useToast } from "@/hooks/use-toast"
import { useTranslation } from 'react-i18next';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] w-[calc(100%-2rem)] max-w-md shadow-2xl">
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-wrap break-words">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-md flex-col-reverse p-4 sm:top-auto sm:right-4 sm:bottom-4 sm:left-auto sm:flex-col md:max-w-[420px]" />
    </ToastProvider>
  )
}
