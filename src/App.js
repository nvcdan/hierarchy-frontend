import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, useNodesState, useEdgesState } from 'react-flow-renderer';
import dagre from 'dagre';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import CustomNode from './components/CustomNode';
import Toolbar from './components/Toolbar';
import { processData, getLayoutedElements } from './utils/graphUtils';
import AddNodeModal from './components/AddNodeModal';
import Login from './components/Login';

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
  const token = localStorage.getItem('token');  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [reloadCount, setReloadCount] = useState(0); 
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    }
  }, [token]);

  const axiosInstanceRef = useRef(
    axios.create({
      baseURL: 'http://localhost:8080/api',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );

  const axiosInstance = axiosInstanceRef.current;

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        handleLogout(); 
        toast.error('Session expired. Please log in again.');
      }
      return Promise.reject(error);
    }
  );

  const triggerReload = useCallback(() => setReloadCount((count) => count + 1), []);

  const handleAddNodeSubmit = useCallback(
    async ({ name, flags }) => {
      try {
        const payload = { name, flags };
        await axiosInstance.post('/departments/create', payload);
        toast.success(`Department "${name}" added successfully`);
        triggerReload();
      } catch (error) {
        const errorMessage = error.response?.data?.error?.message || 'Failed to add department';
        toast.error(`Failed to add department: ${errorMessage}`);
      }
    },
    [axiosInstance, triggerReload]
  );

  const handleEdit = useCallback(
    async ({ id, parent_id, name, flags }) => {
      try {
        const payload = { id, parent_id, name, flags };
        await axiosInstance.put(`/departments/${id}/update`, payload);
        toast.success(`Node "${name}" updated successfully`);
        triggerReload(); 
      } catch (error) {
        const errorMessage = error.response?.data?.error?.message || 'Failed to update node';
        toast.error(`Failed to update node: ${errorMessage}`);
      }
    },
    [axiosInstance, triggerReload]
  );

  const handleDelete = useCallback(async (id) => {
    try {
      await axiosInstance.delete(`/departments/${id}/delete`);
      toast.success(`Node ${id} deleted successfully`);
      triggerReload();
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || `Failed to delete node ${id}`;
      toast.error(`Failed to delete node ${id}: ${errorMessage}`);
    }
  }, [axiosInstance, triggerReload]);

  const handleAddChild = useCallback(
    async ({ name, parentId, flags }) => {
      try {
        const payload = { name, parent_id: parentId, flags };
        await axiosInstance.post('/departments/create', payload);
        toast.success(`Child department "${name}" added successfully`);
        triggerReload();
      } catch (error) {
        const errorMessage = error.response?.data?.error?.message || 'Failed to add child department';

        toast.error(`Failed to add child department: ${errorMessage}`);
      }
    },
    [axiosInstance, triggerReload]
  );

  const loadData = useCallback(async () => {
    try {
      const url = searchQuery
        ? `/departments/hierarchy?name=${encodeURIComponent(searchQuery)}`
        : '/departments/hierarchy/all';

      const response = await axiosInstance.get(url);
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
  }, [searchQuery, handleEdit, handleDelete, handleAddChild]);

  useEffect(() => {
    loadData();
  }, [loadData, reloadCount]);

  const handleAddNode = () => {
    setShowAddNodeModal(true);
  };

  const handleSearchSubmit = (value) => {
    setSearchQuery(value);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Toolbar onAddNode={handleAddNode} onSearchSubmit={handleSearchSubmit} onLogout={handleLogout} />
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