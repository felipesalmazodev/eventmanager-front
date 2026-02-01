"use client";

type Props = {
    show: boolean;
    title: string;
    body: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: string;
    busy?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
};

export function ConfirmModal({
    show,
    title,
    body,
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmVariant = "danger",
    busy = false,
    onCancel,
    onConfirm,
}: Props) {
    if (!show) return null;

    return (
        <>
            <div className="modal-backdrop show" />

            <div
                className="modal show"
                style={{ display: "block" }}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={onCancel}
                                disabled={busy}
                            />
                        </div>

                        <div className="modal-body">{body}</div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={onCancel}
                                disabled={busy}
                            >
                                {cancelText}
                            </button>
                            <button
                                type="button"
                                className={`btn btn-${confirmVariant}`}
                                onClick={onConfirm}
                                disabled={busy}
                            >
                                {busy ? "Deleting..." : confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
