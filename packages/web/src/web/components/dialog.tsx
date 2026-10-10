import { useEffect, useRef } from "react";
import { X } from "lucide-react";
export function Dialog({
  children,
  onClose,
  title,
  wide = false,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  return (
    <dialog className={wide ? "dialog wide" : "dialog"} ref={ref} onCancel={onClose}>
      <div className="dialog-top">
        <h2>{title}</h2>
        <button className="icon-button" onClick={onClose} aria-label="Fermer / Fechar">
          <X />
        </button>
      </div>
      {children}
    </dialog>
  );
}
