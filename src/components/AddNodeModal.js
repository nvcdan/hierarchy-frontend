import React, { useState } from 'react';
import './Modal.css';

const AddNodeModal = ({ onClose, onAddNode }) => {
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    let flags = 0;
    if (isActive) flags |= 1;
    if (isDeleted) flags |= 2;
    if (isApproved) flags |= 4;

    onAddNode({ name, flags });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add Department</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Department Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group checkboxes">
            <label>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              Active
            </label>
            <label>
              <input
                type="checkbox"
                checked={isDeleted}
                onChange={(e) => setIsDeleted(e.target.checked)}
              />
              Deleted
            </label>
            <label>
              <input
                type="checkbox"
                checked={isApproved}
                onChange={(e) => setIsApproved(e.target.checked)}
              />
              Approved
            </label>
          </div>
          <div className="modal-buttons">
            <button type="submit">Add</button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNodeModal;