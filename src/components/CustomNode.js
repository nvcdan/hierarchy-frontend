import React, { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { FaEdit, FaTrash, FaPlusCircle } from 'react-icons/fa';
import AddChildModal from './AddChildModal';
import EditNodeModal from './EditNodeModal';
import './CustomNode.css';

const CustomNode = ({ data }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const nodeClassName = `custom-node ${data.isDeleted ? 'deleted' : ''} ${
    !data.isActive ? 'inactive' : ''
  }`;

  const handleAddChild = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleEditNode = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);

  return (
    <>
      <div className={nodeClassName}>
        <div className="node-label">{data.label}</div>
        <div className="node-buttons">
          <button onClick={handleEditNode} title="Edit">
            <FaEdit />
          </button>
          {!data.isDeleted && (
          <button onClick={() => data.onDelete(data.id)} title="Delete">
            <FaTrash />
          </button>
          )}
          <button onClick={handleAddChild} title="Add Child">
            <FaPlusCircle />
          </button>
        </div>
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>
      {showAddModal && (
        <AddChildModal
          parentId={data.id}
          onClose={handleCloseAddModal}
          onAddChild={data.onAddChild}
        />
      )}
      {showEditModal && (
        <EditNodeModal
          nodeData={data} 
          onClose={handleCloseEditModal}
          onEditNode={data.onEdit} 
        />
      )}
    </>
  );
};

export default CustomNode;