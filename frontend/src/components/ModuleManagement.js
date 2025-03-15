// frontend/src/components/ModuleManagement.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ModuleManagement() {
  const [modules, setModules] = useState([]);
  // newModule now has title, header, and content
  const [newModule, setNewModule] = useState({ title: '', header: '', content: '' });
  const [editingModule, setEditingModule] = useState(null);
  // editForm now has title, header, and content
  const [editForm, setEditForm] = useState({ title: '', header: '', content: '' });
  const [message, setMessage] = useState('');

  // Fetch modules on component mount
  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await axios.get('/api/admin/modules');
      setModules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/modules', newModule);
      setNewModule({ title: '', header: '', content: '' });
      setMessage('Module created successfully!');
      fetchModules();
    } catch (err) {
      console.error(err);
      setMessage('Error creating module');
    }
  };

  const handleEditClick = (module) => {
    setEditingModule(module._id);
    // Assume the stored content is header and body separated by two newlines.
    const [header, ...rest] = module.content.split("\n\n");
    const body = rest.join("\n\n");
    setEditForm({ title: module.title, header: header || '', content: body || '' });
  };

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
        <input
          type="text"
          placeholder="Main Header"
          value={newModule.header}
          onChange={(e) => setNewModule({ ...newModule, header: e.target.value })}
          required
        />
        <textarea
          placeholder="Content Information"
          value={newModule.content}
          onChange={(e) => setNewModule({ ...newModule, content: e.target.value })}
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
                <input
                  type="text"
                  value={editForm.header}
                  onChange={(e) => setEditForm({ ...editForm, header: e.target.value })}
                  required
                />
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  required
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingModule(null)}>Cancel</button>
              </form>
            ) : (
              <div>
                <h4>{module.title}</h4>
                <h5>{module.content.split("\n\n")[0]}</h5>
                <p>{module.content.split("\n\n").slice(1).join("\n\n")}</p>
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
