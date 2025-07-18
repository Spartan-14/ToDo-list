"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faExclamationTriangle, faTimes } from "@fortawesome/free-solid-svg-icons"

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, taskName, loading }) => {
    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-icon-container">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="modal-warning-icon" />
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="modal-content">
                    <h3 className="modal-title">Delete Task</h3>
                    <p className="modal-message">
                        Are you sure you want to delete <strong>"{taskName}"</strong>?
                    </p>
                    <p className="modal-submessage">This task will be moved to trash and can be restored within 30 days.</p>
                </div>

                <div className="modal-actions">
                    <button className="modal-btn cancel-btn" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                    <button className="modal-btn delete-btn" onClick={onConfirm} disabled={loading}>
                        <FontAwesomeIcon icon={faTrash} className="btn-icon" />
                        {loading ? "Deleting..." : "Delete Task"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmModal
