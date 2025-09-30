import React, { useState } from 'react';
import Modal from '../Modal';
import { useAppStore, App } from '../../lib/state';
import { useLiveAPIContext } from '../../contexts/LiveAPIContext';

interface AddAppModalProps {
  onClose: () => void;
}

const AddAppModal: React.FC<AddAppModalProps> = ({ onClose }) => {
  const { user } = useLiveAPIContext();
  const addApp = useAppStore(state => state.addApp);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [appUrl, setAppUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    const newApp: App = {
      name,
      description,
      logo_url: logoUrl,
      app_url: appUrl,
    };

    try {
      await addApp(newApp, user.id);
      onClose();
    } catch (error) {
      // Error is handled in the store
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit} className="add-app-modal">
        <h2>Add New App</h2>
        <div className="form-field">
          <label htmlFor="app-name">App Name</label>
          <input id="app-name" type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-field">
          <label htmlFor="app-desc">Description</label>
          <textarea id="app-desc" value={description} onChange={e => setDescription(e.target.value)} rows={3} required />
        </div>
        <div className="form-field">
          <label htmlFor="app-logo">Logo URL</label>
          <input id="app-logo" type="url" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" required />
        </div>
        <div className="form-field">
          <label htmlFor="app-url">App URL</label>
          <input id="app-url" type="url" value={appUrl} onChange={e => setAppUrl(e.target.value)} placeholder="https://example.com/app" required />
        </div>
        <div className="modal-actions">
          <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
          <button type="submit" className="save-button" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Add App'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAppModal;
