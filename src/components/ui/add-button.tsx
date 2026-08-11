"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";

export function AddButton({
  label,
  modalTitle,
  render,
}: {
  label: string;
  modalTitle: string;
  render: (onDone: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-8 items-center gap-1.5 rounded-md bg-[var(--color-primary)] px-3 text-[12.5px] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
      >
        <Plus size={14} />
        {label}
      </button>
      {open && (
        <Modal title={modalTitle} onClose={() => setOpen(false)}>
          {render(() => setOpen(false))}
        </Modal>
      )}
    </>
  );
}
