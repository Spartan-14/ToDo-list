"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faExclamationTriangle, faTimes } from "@fortawesome/free-solid-svg-icons"
import SuperheroButton from "./SuperheroButton"

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
                    <h3 className="modal-title">ABORT MISSION</h3>
                    <p className="modal-message">
                        Are you sure you want to abort <strong>"{taskName}"</strong>?
                    </p>
                    <p className="modal-submessage">
                        This mission will be moved to the archive and can be restored within 30 days.
                    </p>
                </div>

                <div className="modal-actions">
                    <SuperheroButton variant="secondary" size="medium" onClick={onClose} disabled={loading}>
                        CANCEL
                    </SuperheroButton>
                    <SuperheroButton
                        variant="danger"
                        size="medium"
                        onClick={onConfirm}
                        disabled={loading}
                        loading={loading}
                        icon={faTrash}
                    >
                        {loading ? "ABORTING..." : "ABORT MISSION"}
                    </SuperheroButton>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmModal
