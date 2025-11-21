"use client";

import React from "react";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({ open, title = "Confirmar", message = "Tem certeza?", confirmLabel = "Confirmar", cancelLabel = "Cancelar", onConfirm, onCancel }: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal card p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">{title}</h5>
        </div>
        <div className="mb-3">
          {message}
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary btn-sm" onClick={onCancel}>{cancelLabel}</button>
          <button className="btn btn-danger btn-sm" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
