// frontend/src/components/ModuleManagement.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ModuleManagement() {
  const [modules, setModules] = useState([]);
  const [newModule, setNewModule] = useState({ title: '', content: '', duration: '' });
  const [editingModule, setEditingModule] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', duration: '' });
  const [message, setMessage] = useState('');

  // Fetch modules on component mount
  useEffect(() => {
    fetchModules();
  }, []);

  // Retrieve modules from backend
  const fetchModules = async () => {
    try {
      const res = await axios.get('/api/admin/modules');
      setModules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Create a new module
  const handleCreateModule = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/modules', newModule);
      setNewModule({ title: '', content: '', duration: '' });
      setMessage('Module created successfully!');
      fetchModules();
    } catch (err) {
      console.error(err);
      setMessage('Error creating module');
    }
  };

  // Start editing a module
  const handleEditClick = (module) => {
    setEditingModule(module._id);
    setEditForm({ title: module.title, content: module.content, duration: module.duration });
  };

  // Update an existing module
  const handleUpdateModule = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/modules/${editingModule}`, editForm);
      setMessage('Module updated successfully!');
      setEditingModule(null);
      fetchModules();
    } catch (err) {
      console.error(err);
      setMessage('Error updating module');
    }
  };

  // Delete a module
  const handleDeleteModule = async (id) => {
    try {
      await axios.delete(`/api/admin/modules/${id}`);
      setMessage('Module deleted successfully!');
      fetchModules();
    } catch (err) {
      console.error(err);
      setMessage('Error deleting module');
    }
  };

  return (
    <div>
      <h3>Create New Module</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleCreateModule}>
        <input
          type="text"
          placeholder="Title"
          value={newModule.title}
          onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Content"
          value={newModule.content}
          onChange={(e) => setNewModule({ ...newModule, content: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={newModule.duration}
          onChange={(e) => setNewModule({ ...newModule, duration: e.target.value })}
          required
        />
        <button type="submit">Create Module</button>
      </form>

      <h3>Existing Modules</h3>
      <ul>
        {modules.map((module) => (
          <li key={module._id}>
            {editingModule === module._id ? (
              <form onSubmit={handleUpdateModule}>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                />
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  required
                />
                <input
                  type="number"
                  value={editForm.duration}
                  onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                  required
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingModule(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <div>
                <h4>{module.title}</h4>
                <p>{module.content}</p>
                <p>Duration: {module.duration} minutes</p>
                <button onClick={() => handleEditClick(module)}>Edit</button>
                <button onClick={() => handleDeleteModule(module._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ModuleManagement;
