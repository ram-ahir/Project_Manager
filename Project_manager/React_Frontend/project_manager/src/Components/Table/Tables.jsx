import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form } from 'react-bootstrap';
import TableField from '../Field/TableField';

const Tables = ({ project, onSelectTable }) => {
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [formData, setFormData] = useState({
    table_name: '',
    table_description: '',
    is_generated: false,
    generated_date: ''
  });
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Fetch tables when project changes
  useEffect(() => {
    const fetchTables = async () => {
      if (!project?.project_id) {
        setTables([]);
        return;
      }
      try {
        const res = await axios.get(
          `http://localhost:3000/api/tables?project_id=${project.project_id}`
        );
        setTables(res.data);
      } catch (err) {
        console.error('Failed to fetch tables:', err);
      }
    };
    fetchTables();
    resetForm();
  }, [project]);

  // Row click to select
  const handleRowClick = (tbl) => {
    setSelectedTableId(tbl.table_id);
    onSelectTable?.(tbl);
  };

  // Populate form for editing
  const handleEdit = (table) => {
    // Prevent row click from overriding form state:
    setSelectedTableId(table.table_id);
    setFormData({
      table_name: table.table_name,
      table_description: table.table_description || '',
      is_generated: table.is_generated,
      generated_date: table.generated_date
        ? table.generated_date.slice(0, 16)
        : ''
    });
    setEditing(true);
    setShowForm(true);
  };

  // Delete a table
  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this Table?');
    if (!confirmed) return;
    try {
      await axios.delete(`http://localhost:3000/api/tables/${id}`);
      setTables(tables.filter(t => t.table_id !== id));
      if (selectedTableId === id) resetForm();
    } catch (err) {
      console.error('Error deleting table:', err);
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Submit create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      project_id: project.project_id
    };
    try {
      if (editing) {
        await axios.put(
          `http://localhost:3000/api/tables/${selectedTableId}`,
          payload
        );
      } else {
        await axios.post(`http://localhost:3000/api/tables`, payload);
      }
      const res = await axios.get(
        `http://localhost:3000/api/tables?project_id=${project.project_id}`
      );
      setTables(res.data);
      resetForm();
    } catch (err) {
      console.error('Error saving table:', err);
    }
  };

  // Reset form state
  const resetForm = () => {
    setSelectedTableId(null);
    setFormData({
      table_name: '',
      table_description: '',
      is_generated: false,
      generated_date: ''
    });
    setEditing(false);
    setShowForm(false);
  };

  return (
    <div className='px-2'>
      <h5 className="mb-3 text-center">
        Tables for Project: {project?.project_name || '—'}
      </h5>

      <Button
        variant="primary"
        className="mb-3 float-end"
        onClick={() => {
          resetForm();
          setShowForm(true);
        }}
      >
        Add New Table
      </Button>
      <div className="shadow rounded">
        <Table hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Generated</th>
              <th>Generated Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tables.map(tbl => (
              <tr
                key={tbl.table_id}
                className={tbl.table_id === selectedTableId ? 'table-active' : ''}
                onClick={() => handleRowClick(tbl)}
                style={{ cursor: 'pointer' }}
              >
                <td>{tbl.table_name}</td>
                <td>{tbl.table_description}</td>
                <td>{tbl.is_generated ? 'Yes' : 'No'}</td>
                <td>
                  {tbl.generated_date
                    ? new Date(tbl.generated_date).toLocaleString()
                    : '-'}
                </td>
                <td className="d-flex gap-2">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent row click
                      handleEdit(tbl);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(tbl.table_id);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className='d-flex justify-content-center container-fluid'>
        {showForm && (
          <Form onSubmit={handleSubmit} className="border p-3 rounded w-50 bg-white shadow mb-5">
            <Form.Group className="mb-2">
              <Form.Label>Table Name</Form.Label>
              <Form.Control
                name="table_name"
                value={formData.table_name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="table_description"
                value={formData.table_description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="isGenerated">
              <Form.Check
                type="checkbox"
                label="Is Generated"
                name="is_generated"
                checked={formData.is_generated}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Generated Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="generated_date"
                value={formData.generated_date}
                onChange={handleChange}
                disabled={!formData.is_generated}
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit">
                {editing ? 'Update Table' : 'Create Table'}
              </Button>
              <Button variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </div>

      {selectedTableId && (
        <>
        <hr />
        <TableField tableId={selectedTableId} project={project} />
        </>
      )}

    </div>
  );
};

export default Tables;
