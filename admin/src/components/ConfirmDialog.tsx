import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { CircleCheck, Info, Trash2 } from "lucide-react";
import React from "react";

type DialogVariant = "destructive" | "success" | "default";

interface VariantStyles {
  icon: React.ReactNode;
  iconClass: string;
  buttonClass: string;
}

const dialogVariants: Record<DialogVariant, VariantStyles> = {
  destructive: {
    icon: <Trash2 />,
    iconClass: "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    buttonClass: "bg-red-600 text-white hover:bg-red-700",
  },
  success: {
    icon: <CircleCheck />,
    iconClass:
      "bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400",
    buttonClass: "bg-green-600 text-white hover:bg-green-700",
  },
  default: {
    icon: <Info />,
    iconClass:
      "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    buttonClass: "bg-blue-600 text-white hover:bg-blue-700",
  },
};

interface ConfirmDialogProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  variant?: DialogVariant;
}

function ConfirmDialog({
  children,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "destructive",
}: ConfirmDialogProps) {
  const styles = dialogVariants[variant] || dialogVariants.default;

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="admin-modal-overlay fixed inset-y-0 right-0 z-70 bg-black/45 backdrop-blur-sm" />

        <div className="admin-modal-overlay fixed inset-y-0 right-0 z-80 flex items-center justify-center px-4 pointer-events-none">
          <AlertDialog.Content className="admin-confirm-dialog-content pointer-events-auto w-[92vw] max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl outline-none dark:border-zinc-700 dark:bg-zinc-900">
            <div
              className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${styles.iconClass}`}
            >
              {styles.icon}
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
                  className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition ${styles.buttonClass}`}
                >
                  {confirmText}
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </div>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export default ConfirmDialog;
