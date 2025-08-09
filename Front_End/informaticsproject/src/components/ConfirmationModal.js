import React from "react";
import '../styles/css/ConfirmationModal.css'

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title="Confirm Action",
    message="Changes may be permanent. Proceed with this action?",
    confirmText="Proceed",
    cancelText="Cancel"}) => {
    if(!isOpen) return null;

    return (
        <div className="=modal-overlay">
            <div className="modal-content">
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onConfirm} className="confirm-button">{confirmText}</button>
                    <button onClick={onClose} className="cancel-button">{cancelText}</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;