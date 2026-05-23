import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { FaTrash } from "react-icons/fa";

function ConfirmDialog({
  children,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-70 bg-black/45 backdrop-blur-sm" />

        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-80 w-[92vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl outline-none dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <FaTrash />
          </div>

          <AlertDialog.Title className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </AlertDialog.Title>

          <AlertDialog.Description className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {description}
          </AlertDialog.Description>

          <div className="mt-5 flex gap-3">
            <AlertDialog.Cancel asChild>
              <button
                onClick={onCancel}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
              >
                {cancelText}
              </button>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
              <button
                onClick={onConfirm}
                className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                {confirmText}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export default ConfirmDialog;