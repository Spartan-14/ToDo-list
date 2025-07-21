"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, taskName, loading }) => {
    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-icon">
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                    </div>
                </div>

                <div className="modal-content">
                    <h3 className="modal-title">Delete Task</h3>
                    <p className="modal-message">
                        Are you sure you want to delete <strong>"{taskName}"</strong>?
                    </p>
                    <p className="modal-submessage">This action cannot be undone.</p>
                </div>

                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                    <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
                        {loading ? <div className="loading-spinner"></div> : <FontAwesomeIcon icon={faTrash} />}
                        {loading ? "Deleting..." : "Delete Task"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmModal
