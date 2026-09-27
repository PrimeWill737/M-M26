"use client";
import { useEffect, useId, useRef } from "react";
import { lockPageScroll } from "@/utils/scrollLock";
export function Modal({
  title,
  onClose,
  children,
  eyebrow = "A little love, in words",
  className = "",
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  eyebrow?: string;
  className?: string;
}) {
  const titleId = useId();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    const unlock = lockPageScroll();
    return () => {
      dialog?.close();
      unlock();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      className={`modal ${className}`}
      ref={ref}
      aria-labelledby={titleId}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          ×
        </button>
        <span className="eyebrow">{eyebrow}</span>
        <h2 id={titleId}>{title}</h2>
        {children}
      </div>
    </dialog>
  );
}
