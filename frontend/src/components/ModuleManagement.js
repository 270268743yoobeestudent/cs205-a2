// frontend/src/components/ModuleManagement.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/styles.css';

function ModuleManagement() {
  // For new module creation
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newSections, setNewSections] = useState([]); // array of { header, content }
  const [newSectionHeader, setNewSectionHeader] = useState('');
  const [newSectionContent, setNewSectionContent] = useState('');

  // For editing an existing module
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [editModuleTitle, setEditModuleTitle] = useState('');
  const [editSections, setEditSections] = useState([]); // current sections array for module
  const [editSectionHeader, setEditSectionHeader] = useState('');
  const [editSectionContent, setEditSectionContent] = useState('');

  // For storing the list of modules and any messages
  const [modules, setModules] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchModules();
  }, []);

  // Fetch all modules from the backend
  const fetchModules = async () => {
    try {
      const res = await axios.get('/api/admin/modules', { withCredentials: true });
      setModules(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Error fetching modules');
    }
  };

  // CREATE NEW MODULE
  const handleCreateModule = async (e) => {
    e.preventDefault();
    try {
      // Prepare payload with title and sections (even if sections is empty)
      const payload = { title: newModuleTitle, sections: newSections };
      await axios.post('/api/admin/modules', payload, { withCredentials: true });
      setMessage('Module created successfully!');
      setNewModuleTitle('');
      setNewSections([]);
      setNewSectionHeader('');
      setNewSectionContent('');
      fetchModules();
    } catch (err) {
      console.error(err);
      setMessage('Error creating module');
    }
  };

  // Add a new section to the new module
  const addNewSection = () => {
    if (newSectionHeader.trim() && newSectionContent.trim()) {
      setNewSections([...newSections, { header: newSectionHeader, content: newSectionContent }]);
      setNewSectionHeader('');
      setNewSectionContent('');
    }
  };

  // EDIT MODULE: start editing, pre-fill the edit state with module data
  const handleEditClick = (module) => {
    setEditingModuleId(module._id);
    setEditModuleTitle(module.title);
    setEditSections(module.contentSections || []);
    setMessage('');
  };

  // Update an existing module
  const handleUpdateModule = async (e) => {
    e.preventDefault();
    try {
      const payload = { title: editModuleTitle, sections: editSections };
      await axios.put(`/api/admin/modules/${editingModuleId}`, payload, { withCredentials: true });
      setMessage('Module updated successfully!');
      setEditingModuleId(null);
      fetchModules();
    } catch (err) {
      console.error(err);
      setMessage('Error updating module');
    }
  };

  // Delete a module
  const handleDeleteModule = async (id) => {
    try {
      await axios.delete(`/api/admin/modules/${id}`, { withCredentials: true });
      setMessage('Module deleted successfully!');
      fetchModules();
    } catch (err) {
      console.error(err);
      setMessage('Error deleting module');
    }
  };

  // In edit mode, delete a specific section
  const deleteEditSection = (index) => {
    const updatedSections = editSections.filter((_, i) => i !== index);
    setEditSections(updatedSections);
  };

  // In edit mode, add a new section
  const addEditSection = () => {
    if (editSectionHeader.trim() && editSectionContent.trim()) {
      setEditSections([...editSections, { header: editSectionHeader, content: editSectionContent }]);
      setEditSectionHeader('');
      setEditSectionContent('');
    }
  };

  return (
    <div>
      <h3>Module Management</h3>
      {message && <p>{message}</p>}

      {/* Create New Module Section */}
      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h4>Create New Module</h4>
        <form onSubmit={handleCreateModule}>
          <input
            type="text"
            placeholder="Module Title"
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            required
          />
          <div style={{ marginTop: '10px' }}>
            <h5>Add Section</h5>
            <input
              type="text"
              placeholder="Section Header"
              value={newSectionHeader}
              onChange={(e) => setNewSectionHeader(e.target.value)}
            />
            <textarea
              placeholder="Section Content"
              value={newSectionContent}
              onChange={(e) => setNewSectionContent(e.target.value)}
            />
            <button type="button" onClick={addNewSection} style={{ marginTop: '5px' }}>
              Add Section
            </button>
          </div>
          {newSections.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <h5>Sections Added:</h5>
              <ul>
                {newSections.map((sec, idx) => (
                  <li key={idx}><strong>{sec.header}</strong>: {sec.content}</li>
                ))}
              </ul>
            </div>
          )}
          <button type="submit" style={{ marginTop: '10px' }}>Create Module</button>
        </form>
      </div>

      {/* Minimal List of Existing Modules */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {modules.map(module => (
          <li
            key={module._id}
            style={{
              marginBottom: '8px',
              borderBottom: '1px solid #ccc',
              paddingBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            {editingModuleId === module._id ? (
              // Editing Mode: show inline form for module title and sections editing
              <div style={{ width: '100%' }}>
                <form onSubmit={handleUpdateModule}>
                  <input
                    type="text"
                    value={editModuleTitle}
                    onChange={(e) => setEditModuleTitle(e.target.value)}
                    required
                  />
                  <div style={{ marginTop: '10px' }}>
                    <h5>Edit Sections</h5>
                    {editSections.map((sec, idx) => (
                      <div key={idx} style={{ border: '1px solid #aaa', padding: '5px', marginBottom: '5px' }}>
                        <strong>{sec.header}</strong>: {sec.content}
                        <button type="button" onClick={() => deleteEditSection(idx)} style={{ marginLeft: '5px' }}>
                          Delete Section
                        </button>
                      </div>
                    ))}
                    <div style={{ marginTop: '10px' }}>
                      <input
                        type="text"
                        placeholder="New Section Header"
                        value={editSectionHeader}
                        onChange={(e) => setEditSectionHeader(e.target.value)}
                      />
                      <textarea
                        placeholder="New Section Content"
                        value={editSectionContent}
                        onChange={(e) => setEditSectionContent(e.target.value)}
                      />
                      <button type="button" onClick={addEditSection} style={{ marginTop: '5px' }}>
                        Add New Section
                      </button>
                    </div>
                  </div>
                  <button type="submit" style={{ marginTop: '10px' }}>Save</button>
                  <button type="button" onClick={() => setEditingModuleId(null)} style={{ marginLeft: '5px' }}>
                    Cancel
                  </button>
                </form>
              </div>
            ) : (
              // Minimal view: show only the title and Edit/Delete buttons
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span>{module.title}</span>
                <span>
                  <button onClick={() => handleEditClick(module)}>Edit</button>
                  <button onClick={() => handleDeleteModule(module._id)} style={{ marginLeft: '5px' }}>
                    Delete
                  </button>
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ModuleManagement;
