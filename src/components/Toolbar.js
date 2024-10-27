import React, { useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import './Toolbar.css';

const Toolbar = ({ onAddNode, onSearchSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearchSubmit(inputValue.trim());
    }
  };

  return (
    <div className="toolbar">
      <img src="/logo.svg" alt="Logo" className="toolbar-logo" width={80} height={80} />
      <input
        type="text"
        placeholder="Cautǎ ierarhia..."
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="search-input"
      />
      <button onClick={onAddNode} className="add-node-button">
      <FaPlusCircle />
      </button>
    </div>
  );
};

export default Toolbar;