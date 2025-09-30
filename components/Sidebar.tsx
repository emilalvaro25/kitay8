

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { FunctionCall, useSettings, useUI, useTools, useSnackbarStore } from '../lib/state';
import c from 'classnames';
import { AVAILABLE_VOICES, VOICE_NAME_MAP } from '../lib/constants';
import { useLiveAPIContext } from '../contexts/LiveAPIContext';
import { useState } from 'react';
import ToolEditorModal from './ToolEditorModal';
import { supabase } from '../lib/supabase';
import ToolIcon from './ToolIcon';
import AppsTab from './apps/AppsTab';

type SettingsTab = 'persona' | 'tools' | 'integrations' | 'apps';

export default function SettingsPage() {
  const { isSettingsOpen, toggleSettings, setIsAddingApp } = useUI();
  const { systemPrompt, voice, personaName, setSystemPrompt, setVoice, setPersonaName } = useSettings();
  const { tools, toggleTool, addTool, removeTool, updateTool } = useTools();
  const { connected, user } = useLiveAPIContext();
  const { showSnackbar } = useSnackbarStore();

  const [activeTab, setActiveTab] = useState<SettingsTab>('persona');
  const [editingTool, setEditingTool] = useState<FunctionCall | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveTool = (updatedTool: FunctionCall) => {
    if (editingTool) {
      updateTool(editingTool.name, updatedTool);
    }
    setEditingTool(null);
  };

  const handleToolWebhookChange = (
    toolName: string,
    field: 'postWebhookUrl' | 'getStatusWebhookUrl',
    value: string
  ) => {
    const toolToUpdate = tools.find(t => t.name === toolName);
    if (toolToUpdate) {
      updateTool(toolName, { ...toolToUpdate, [field]: value });
    }
  };

  const handleSaveChanges = async () => {
    if (!user) {
      showSnackbar('You must be logged in to save settings.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const settingsToSave = {
        personaName: useSettings.getState().personaName,
        systemPrompt: useSettings.getState().systemPrompt,
        voice: useSettings.getState().voice,
        template: useTools.getState().template,
        tools: useTools.getState().tools,
      };

      const { error } = await supabase
        .from('user_settings')
        .upsert({ id: user.id, ...settingsToSave });

      if (error) throw error;

      showSnackbar('Settings saved successfully!', 'success');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      showSnackbar(`Failed to save settings: ${error.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const ADMIN_ONLY_TOOLS = ['write_code_snippet', 'generate_video'];
  const displayedTools = user?.email === 'masterdee@aiteksoftware.site'
    ? tools
    : tools.filter(tool => !ADMIN_ONLY_TOOLS.includes(tool.name));
  
  const webhookTools = tools.filter(tool => 'postWebhookUrl' in tool);
  const authorizedSystemPromptEditors = ['masterdee@aiteksoftware.site', 'emil@aiteksoftware.site'];

  return (
    <>
      <div className={c('settings-view', { open: isSettingsOpen })}>
        <div className="settings-header">
          <h3>Settings</h3>
          <div className="settings-header-actions">
            {activeTab === 'apps' && (
              <button onClick={() => setIsAddingApp(true)} className="action-button" title="Add New App">
                  <span className="icon">add</span>
              </button>
            )}
            <button onClick={toggleSettings} className="close-button action-button" title="Close settings">
              <span className="icon">close</span>
            </button>
          </div>
        </div>

        <div className="settings-tabs">
          <button className={c('tab-button', { active: activeTab === 'persona' })} onClick={() => setActiveTab('persona')}>Persona</button>
          <button className={c('tab-button', { active: activeTab === 'tools' })} onClick={() => setActiveTab('tools')}>Tools</button>
          <button className={c('tab-button', { active: activeTab === 'integrations' })} onClick={() => setActiveTab('integrations')}>Integrations</button>
          <button className={c('tab-button', { active: activeTab === 'apps' })} onClick={() => setActiveTab('apps')}>Apps</button>
        </div>

        
          {activeTab === 'persona' && (
            <>
            <div className="settings-content">
              <div className="settings-section">
                <fieldset disabled={connected}>
                  <div className="persona-name-field">
                    <label htmlFor="persona-name-input">Persona Name</label>
                    <input
                      id="persona-name-input"
                      type="text"
                      value={personaName}
                      onChange={(e) => setPersonaName(e.target.value)}
                      placeholder="Give your assistant a name..."
                    />
                  </div>
                  {authorizedSystemPromptEditors.includes(user?.email || '') && (
                    <details className="collapsible-setting" open>
                      <summary>Roles &amp; Description</summary>
                      <textarea
                        value={systemPrompt}
                        onChange={e => setSystemPrompt(e.target.value)}
                        rows={15}
                        placeholder="Describe the role and personality of the AI..."
                        aria-label="Roles & Description"
                      />
                    </details>
                  )}
                  <label>
                    Voice
                    <select value={voice} onChange={e => setVoice(e.target.value)} disabled={connected} aria-label="Select voice">
                      {AVAILABLE_VOICES.map(v => (
                        <option key={v} value={v}>
                          {VOICE_NAME_MAP[v] || v}
                        </option>
                      ))}
                    </select>
                  </label>
                </fieldset>
              </div>
            </div>
            <div className="settings-footer">
                <button
                  className={c('save-changes-button', { saving: isSaving })}
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  title="Save your persona and tool settings"
                >
                  {isSaving ? (
                    <><span className="icon sync">sync</span> Saving...</>
                  ) : (
                    'Save Persona'
                  )}
                </button>
              </div>
            </>
          )}

          {activeTab === 'tools' && (
            <>
            <div className="settings-content">
              <div className="settings-section">
                <fieldset disabled={connected}>
                  <div className="tools-list">
                    {displayedTools.map(tool => (
                      <details key={tool.name} className="tool-item">
                        <summary className="tool-item-summary">
                          <div className="tool-item-summary-left">
                            <div className="tool-icon-wrapper">
                              <ToolIcon icon={tool.icon} />
                            </div>
                            <span className="tool-name-text" title={tool.description}>{tool.name}</span>
                          </div>
                          <div className="tool-item-summary-right">
                            <label className="toggle-switch" title={`Enable/disable ${tool.name}`}>
                              <input
                                type="checkbox"
                                checked={tool.isEnabled}
                                onChange={() => toggleTool(tool.name)}
                              />
                              <span className="slider"></span>
                            </label>
                          </div>
                        </summary>
                        <div className="tool-item-details">
                          <div className="tool-actions">
                            <button onClick={() => setEditingTool(tool)} aria-label={`Edit ${tool.name}`} title={`Edit ${tool.name}`}>
                              <span className="icon">edit</span> Edit Definition
                            </button>
                            <button onClick={() => removeTool(tool.name)} aria-label={`Remove ${tool.name}`} title={`Remove ${tool.name}`}>
                              <span className="icon">delete</span>
                            </button>
                          </div>
                        </div>
                      </details>
                    ))}
                  </div>
                  <button onClick={addTool} className="add-tool-button" disabled={connected} title="Add a new custom tool">
                    <span className="icon">add</span> Add New Tool
                  </button>
                </fieldset>
              </div>
            </div>
             <div className="settings-footer">
              <button
                className={c('save-changes-button', { saving: isSaving })}
                onClick={handleSaveChanges}
                disabled={isSaving}
                title="Save your persona and tool settings"
              >
                {isSaving ? (
                  <><span className="icon sync">sync</span> Saving...</>
                ) : (
                  'Save Tools'
                )}
              </button>
            </div>
            </>
          )}

          {activeTab === 'integrations' && (
             <>
             <div className="settings-content">
              <div className="settings-section">
                <p className="setting-description">Connect tools to third-party services like Zapier or n8n by providing webhook URLs. These URLs are triggered when the tool is used.</p>
                <fieldset disabled={connected}>
                  <div className="integrations-list">
                    {webhookTools.map(tool => (
                      <div key={tool.name} className="integration-item">
                        <div className="integration-item-header">
                          <div className="tool-icon-wrapper">
                            <ToolIcon icon={tool.icon} />
                          </div>
                          <span className="tool-name-text">{tool.name}</span>
                        </div>
                        <div className="integration-item-fields">
                          <div className="webhook-field">
                            <label htmlFor={`${tool.name}-post-url`}>Execute Action (POST)</label>
                            <p className="field-description">Triggered when the tool is called. Sends tool parameters to this URL.</p>
                            <input
                              type="url"
                              id={`${tool.name}-post-url`}
                              placeholder="Paste webhook URL from Zapier, n8n, etc..."
                              value={tool.postWebhookUrl || ''}
                              onChange={(e) => handleToolWebhookChange(tool.name, 'postWebhookUrl', e.target.value)}
                            />
                          </div>
                          <div className="webhook-field">
                            <label htmlFor={`${tool.name}-get-url`}>Get Status (GET)</label>
                            <p className="field-description">Optional. Polls this URL to get the status of a long-running task.</p>
                            <input
                              type="url"
                              id={`${tool.name}-get-url`}
                              placeholder="Optional: Paste GET webhook URL..."
                              value={tool.getStatusWebhookUrl || ''}
                              onChange={(e) => handleToolWebhookChange(tool.name, 'getStatusWebhookUrl', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="settings-footer">
              <button
                className={c('save-changes-button', { saving: isSaving })}
                onClick={handleSaveChanges}
                disabled={isSaving}
                title="Save your persona and tool settings"
              >
                {isSaving ? (
                  <><span className="icon sync">sync</span> Saving...</>
                ) : (
                  'Save Integrations'
                )}
              </button>
            </div>
            </>
          )}

          {activeTab === 'apps' && (
            <AppsTab />
          )}
        

      </div>
      {editingTool && (
        <ToolEditorModal
          tool={editingTool}
          user={user}
          onClose={() => setEditingTool(null)}
          onSave={handleSaveTool}
        />
      )}
    </>
  );
}