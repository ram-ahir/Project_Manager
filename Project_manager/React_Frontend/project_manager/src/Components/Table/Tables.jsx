import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Tables = ({ project }) => {
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState('');
  const [formData, setFormData] = useState({ table_name: '', table_description: '' });
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false); // ⬅️ new state

  const fetchTables = () => {
    if (!project?.project_id) return;

    axios.get(`http://localhost:3000/api/tables?project_id=${project.project_id}`)
      .then(res => setTables(res.data))
      .catch(err => console.error('Failed to fetch tables:', err));
  };

  useEffect(() => {
    fetchTables();
  }, [project]);

  const handleTableSelect = (e) => {
    const tableId = e.target.value;
    setSelectedTableId(tableId);
    const selected = tables.find(t => t.table_id === parseInt(tableId));
    if (selected) {
      setFormData({
        table_name: selected.table_name,
        table_description: selected.table_description || ''
      });
      setEditing(true);
      setShowForm(true); // ⬅️ show form if table selected
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing && selectedTableId) {
        await axios.put(`http://localhost:3000/api/tables/${selectedTableId}`, formData);
      } else {
        await axios.post(`http://localhost:3000/api/tables`, { ...formData, project_id: project.project_id });
      }
      fetchTables();
      resetForm();
    } catch (err) {
      console.error('Error saving table:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedTableId) return;
    try {
      await axios.delete(`http://localhost:3000/api/tables/${selectedTableId}`);
      fetchTables();
      resetForm();
    } catch (err) {
      console.error('Error deleting table:', err);
    }
  };

  const resetForm = () => {
    setFormData({ table_name: '', table_description: '' });
    setSelectedTableId('');
    setEditing(false);
    setShowForm(false); // ⬅️ hide form after reset
  };

  return (
    <div className="card p-4">
      <h5 className="mb-3">Manage Tables for Project: {project?.project_name}</h5>

      <select className="form-select mb-3" value={selectedTableId} onChange={handleTableSelect}>
        <option value="">Select a table</option>
        {tables.map((table) => (
          <option key={table.table_id} value={table.table_id}>
            {table.table_name}
          </option>
        ))}
      </select>

      {/* Toggle Show/Hide */}
      <div className="mb-3 text-center">
        <button className="btn btn-link p-0" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Show Less ▲' : 'Show More ▼'}
        </button>
      </div>

      {/* Conditionally render the form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-3">
          <input
            className="form-control mb-2"
            name="table_name"
            placeholder="Table Name"
            value={formData.table_name}
            onChange={handleChange}
            required
          />
          <textarea
            className="form-control mb-2"
            name="table_description"
            placeholder="Table Description"
            value={formData.table_description}
            onChange={handleChange}
          />
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              {editing ? 'Update Table' : 'Add Table'}
            </button>
            {editing && (
              <button type="button" className="btn btn-danger" onClick={handleDelete}>
                Delete Table
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Clear
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Tables;
