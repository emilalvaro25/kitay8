/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { useUI, useTools } from '../lib/state';
import Modal from './Modal';
import ToolIcon from './ToolIcon';

const ConfirmationModal: React.FC = () => {
  const { pendingToolCall, toolConfirmationCallback, clearToolConfirmation } = useUI();
  const { tools } = useTools();

  if (!pendingToolCall || !toolConfirmationCallback) {
    return null;
  }

  const toolDefinition = tools.find(t => t.name === pendingToolCall.name);

  const handleConfirm = () => {
    toolConfirmationCallback(true);
    clearToolConfirmation();
  };

  const handleCancel = () => {
    toolConfirmationCallback(false);
    clearToolConfirmation();
  };

  return (
    <Modal onClose={handleCancel}>
      <div className="confirmation-modal">
        <div className="confirmation-header">
          {toolDefinition?.icon ? <ToolIcon icon={toolDefinition.icon} /> : <span className="icon">touch_app</span>}
          <h2>Confirm Action</h2>
        </div>
        <p className="confirmation-prompt">
          Please confirm you want to execute the following action: <strong>{pendingToolCall.name}</strong>
        </p>

        <div className="confirmation-details">
          <h4>Parameters:</h4>
          <ul>
            {Object.entries(pendingToolCall.args).map(([key, value]) => (
              <li key={key}>
                <span className="param-key">{key}:</span>
                <span className="param-value">{String(value)}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="modal-actions">
          <button onClick={handleCancel} className="cancel-button" title="Cancel this action">
            Cancel
          </button>
          <button onClick={handleConfirm} className="save-button confirm-button" title="Confirm and execute action">
            <span className="icon">check</span> Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;