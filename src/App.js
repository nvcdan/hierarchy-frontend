import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { Controls, Background, useNodesState, useEdgesState } from 'react-flow-renderer';
import dagre from 'dagre';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import CustomNode from './components/CustomNode';
import Toolbar from './components/Toolbar';
import { processData, getLayoutedElements } from './utils/graphUtils';
import AddNodeModal from './components/AddNodeModal';

import 'react-flow-renderer/dist/style.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const nodeTypes = {
  customNode: CustomNode,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const Legend = () => (
  <div className="legend">
    <div className="legend-item">
      <span className="color-box approved"></span> Approved
    </div>
    <div className="legend-item">
      <span className="color-box not-approved"></span> Not Approved
    </div>
    <div className="legend-item">
      <span className="color-box deleted"></span> Deleted
    </div>
    <div className="legend-item">
      <span className="color-box inactive"></span> Inactive
    </div>
  </div>
);

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [token] = useState(process.env.REACT_APP_BACKEND_SECRET);
  const [reloadCount, setReloadCount] = useState(0); 
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);

  const triggerReload = () => setReloadCount((count) => count + 1);

  const handleAddNodeSubmit = useCallback(
    async ({ name, flags }) => {
      try {
        const payload = { name, flags };
        await axios.post('http://localhost:8080/api/departments/create', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(`Department "${name}" added successfully`);
        triggerReload();
      } catch (error) {
        const errorMessage = error.response?.data?.error?.message || 'Failed to add department';
        console.error('Error adding department:', errorMessage);
        toast.error(`Failed to add department: ${errorMessage}`);
      }
    },
    [token]
  );

  const handleEdit = useCallback(
    async ({ id, parent_id, name, flags }) => {
      try {
        const payload = { id, parent_id, name, flags };
        await axios.put(`http://localhost:8080/api/departments/${id}/update`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(`Node "${name}" updated successfully`);
        triggerReload(); 
      } catch (error) {
        const errorMessage = error.response?.data?.error?.message || 'Failed to update node';
        console.error('Error updating node:', errorMessage);
        toast.error(`Failed to update node: ${errorMessage}`);
      }
    },
    [token]
  );

  const handleDelete = useCallback(async (id) => {
    console.log(`Deleting node with ID ${id}`);
    try {
      await axios.delete(`http://localhost:8080/api/departments/${id}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Node ${id} deleted successfully`);
      triggerReload();
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || `Failed to delete node ${id}`;
      console.error(`Error deleting node ${id}:`, errorMessage);
      toast.error(`Failed to delete node ${id}: ${errorMessage}`);
    }
  }, [token]);

  const handleAddChild = useCallback(
    async ({ name, parentId, flags }) => {
      try {
        const payload = { name, parent_id: parentId, flags };
        await axios.post('http://localhost:8080/api/departments/create', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(`Child department "${name}" added successfully`);
        triggerReload();
      } catch (error) {
        const errorMessage = error.response?.data?.error?.message || 'Failed to add child department';
        console.error('Error adding child department:', errorMessage);
        toast.error(`Failed to add child department: ${errorMessage}`);
      }
    },
    [token]
  );

  const loadData = useCallback(async () => {
    try {
      const url = searchQuery
        ? `http://localhost:8080/api/departments/hierarchy?name=${encodeURIComponent(searchQuery)}`
        : 'http://localhost:8080/api/departments/hierarchy/all';

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data.data;

      if (!data || data.length === 0) {
        setNodes([]);
        setEdges([]);
        toast.info('No results found');
        return;
      }

      const { nodes: flowNodes, edges: flowEdges } = processData(
        data,
        handleEdit,
        handleDelete,
        handleAddChild
      );
      const layoutedElements = getLayoutedElements(flowNodes, flowEdges, dagreGraph);

      setNodes(layoutedElements.nodes);
      setEdges(layoutedElements.edges);
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to load data from backend';
      if (error.response && error.response.status === 404) {
        toast.error(`No results found for your search: ${errorMessage}`);
      } else {
        toast.error(errorMessage);
      }
    }
  }, [searchQuery, token, handleEdit, handleDelete, handleAddChild]);

  useEffect(() => {
    loadData();
  }, [loadData, reloadCount]); 

  const handleAddNode = () => {
    setShowAddNodeModal(true);
  };

  const handleSearchSubmit = (value) => {
    setSearchQuery(value);
  };

  return (
    <div className="app">
      <Toolbar onAddNode={handleAddNode} onSearchSubmit={handleSearchSubmit} />
      <div className="reactflow-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      {showAddNodeModal && (
        <AddNodeModal
          onClose={() => setShowAddNodeModal(false)}
          onAddNode={handleAddNodeSubmit}
        />
      )}
       <Legend />
    </div>
  );
}

export default App;