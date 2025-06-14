import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Form, Button } from 'react-bootstrap';
import { useTheme } from '../../Context/ThemeContext';


const TableField = ({ tableId, project }) => {

  const { gridHeaderStyle, selectedRowStyle } = useTheme();

  const [tablename, setTablename] = useState(" ")
  const [fields, setFields] = useState([]);
  const [editingFieldId, setEditingFieldId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    field_name: '',
    field_label: '',
    display_name: '',
    field_datatype_id: '',
    is_primary: false,
    is_auto_increment: false,
    is_foreign_key: false,
    reference_table_id: '',
    reference_table_field_id: ''
  });
  const [datatypes, setDatatypes] = useState([]);
  const [referenceTables, setReferenceTables] = useState([]);
  const [referenceFieldMap, setReferenceFieldMap] = useState({});

  const isNumericType = () => {
    const selected = datatypes.find(dt => dt.field_datatype_id === parseInt(formData.field_datatype_id));
    return selected && ['Number', 'Decimal Number', 'Primary Key'].includes(selected.display_name);
  };


  useEffect(() => {
    if (!tableId || !project?.project_id) return;
    fetchTableName();
    fetchFields();
    fetchDatatypes();
    fetchReferenceTables();
  }, [tableId, project]);

  useEffect(() => {
    if (formData.reference_table_id) {
      fetchReferenceFields(formData.reference_table_id);
    }
  }, [formData.reference_table_id]);

  const fetchTableName = async () => {
    const res = await axios.get(`http://localhost:3000/api/gettablename?table_id=${tableId}`);
    setTablename(res.data);
  };

  const fetchFields = async () => {
    const res = await axios.get(`http://localhost:3000/api/fields?table_id=${tableId}`);
    setFields(res.data);
    // console.log(res.data);
  };

  const fetchDatatypes = async () => {
    const res = await axios.get(`http://localhost:3000/api/datatype`);
    setDatatypes(res.data);
    console.log(res.data)
  };

  const fetchReferenceTables = async () => {
    const res = await axios.get(`http://localhost:3000/api/tables?project_id=${project.project_id}`);
    setReferenceTables(res.data);
    for (let table of res.data) {
      fetchReferenceFields(table.table_id);
    }
  };

  const fetchReferenceFields = async (refTableId) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/fields?table_id=${refTableId}`);
      setReferenceFieldMap(prev => ({ ...prev, [refTableId]: res.data }));
    } catch (err) {
      console.error(`Failed to fetch fields for table ${refTableId}:`, err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, table_id: tableId };
      if (editingFieldId) {
        await axios.put(`http://localhost:3000/api/fields/${editingFieldId}`, payload);
      } else {
        await axios.post(`http://localhost:3000/api/fields`, payload);
      }
      fetchFields();
      resetForm();
    } catch (err) {
      console.error('Error saving field:', err);
    }
  };

  const handleEdit = (field) => {
    setEditingFieldId(field.table_wise_field_id);
    setFormData({
      field_name: field.field_name,
      field_label: field.field_label || '',
      display_name: field.display_name || '',
      field_datatype_id: field.field_datatype_id,
      is_primary: field.is_primary,
      is_auto_increment: field.is_auto_increment,
      is_foreign_key: field.is_foreign_key,
      reference_table_id: field.reference_table_id || '',
      reference_table_field_id: field.reference_table_field_id || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this field?');
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:3000/api/fields/${id}`);
      fetchFields();
      if (editingFieldId === id) resetForm();
    } catch (err) {
      console.error('Error deleting field:', err);
    }
  };

  const resetForm = () => {
    setEditingFieldId(null);
    setShowForm(false);
    setFormData({
      field_name: '',
      field_label: '',
      display_name: '',
      field_datatype_id: '',
      is_primary: false,
      is_auto_increment: false,
      is_foreign_key: false,
      reference_table_id: '',
      reference_table_field_id: ''
    });
  };

  return (
    <div className="mt-4">
      <h4 className="mb-0 text-center">Fields for : {tablename.table_name}  </h4>

      <Button style={gridHeaderStyle} className="mb-3 float-end rounded-pill" onClick={() => { resetForm(); setShowForm(true); }}>
        Add Field
      </Button>

      <Table hover className='shadow'>
        <thead>
          <tr>
            <th style={gridHeaderStyle}>Field Name</th>
            <th style={gridHeaderStyle}>Label</th>
            <th style={gridHeaderStyle}>Display</th>
            <th style={gridHeaderStyle}>Datatype</th>
            <th style={gridHeaderStyle}>Primary</th>
            <th style={gridHeaderStyle}>Auto-Inc</th>
            <th style={gridHeaderStyle}>Foreign Key</th>
            <th style={gridHeaderStyle}>Reference Table</th>
            <th style={gridHeaderStyle}>Reference Field</th>
            <th style={gridHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fields.map(field => {
            const refField = referenceFieldMap[field.reference_table_id]?.find(
              f => f.table_wise_field_id === field.reference_table_field_id
            );
            return (
              <tr key={field.table_wise_field_id}>
                <td style={field.table_wise_field_id === editingFieldId ? selectedRowStyle : {}}>{field.field_name}</td>
                <td style={field.table_wise_field_id === editingFieldId ? selectedRowStyle : {}}>{field.field_label}</td>
                <td style={field.table_wise_field_id === editingFieldId ? selectedRowStyle : {}}>{field.display_name}</td>
                <td style={field.table_wise_field_id === editingFieldId ? selectedRowStyle : {}}>
                  {datatypes.find(dt => dt.field_datatype_id === field.field_datatype_id)?.display_name}
                </td>
                <td style={field.table_wise_field_id === editingFieldId ? selectedRowStyle : {}}>{field.is_primary ? 'Yes' : '-'}</td>
                <td style={field.table_wise_field_id === editingFieldId ? selectedRowStyle : {}}>{field.is_auto_increment ? 'Yes' : '-'}</td>
                <td style={field.table_wise_field_id === editingFieldId ? selectedRowStyle : {}}>{field.is_foreign_key ? 'Yes' : '-'}</td>
                <td style={field.table_wise_field_id === editingFieldId ? selectedRowStyle : {}}>{referenceTables.find(t => t.table_id === field.reference_table_id)?.table_name || ''}</td>
                <td style={field.table_wise_field_id === editingFieldId ? selectedRowStyle : {}}>{refField?.field_name || ''}</td>
                <td style={field.table_wise_field_id === editingFieldId ? selectedRowStyle : {}}>
                  <i class="fa-solid fa-pen-to-square fa-lg btn" onClick={() => handleEdit(field)}></i>
                  <i class="fa-solid fa-trash fa-lg btn" onClick={() => handleDelete(field.table_wise_field_id)}></i>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <div className='d-flex justify-content-center container-fluid pb-5'>
        {showForm && (
          <Form onSubmit={handleSubmit} className="border p-3 rounded bg-white shadow">
            <div className="row">
              <div className="col-md-4 mb-2">
                <Form.Label>Field Name</Form.Label>
                <Form.Control name="field_name" value={formData.field_name} onChange={handleChange} required />
              </div>
              <div className="col-md-4 mb-2">
                <Form.Label>Field Label</Form.Label>
                <Form.Control name="field_label" value={formData.field_label} onChange={handleChange} />
              </div>
              <div className="col-md-4 mb-2">
                <Form.Label>Display Name</Form.Label>
                <Form.Control name="display_name" value={formData.display_name} onChange={handleChange} />
              </div>
              <div className="col-md-4 mb-2">
                <Form.Label>Field Datatype</Form.Label>
                <Form.Select name="field_datatype_id" value={formData.field_datatype_id} onChange={handleChange} required>
                  <option value="">Select datatype</option>
                  {datatypes.map(dt => (
                    <option key={dt.field_datatype_id} value={dt.field_datatype_id}>
                      {dt.display_name}
                    </option>
                  ))}

                </Form.Select>
              </div>
            </div>

            {isNumericType() && (
              <>
                <hr />
                <div className="row mb-3">
                  <div className="col-md-4">
                    <Form.Label>Primary Key</Form.Label>
                    <div className="form-switch">
                      <Form.Check
                        type="switch"
                        id="is_primary"
                        name="is_primary"
                        checked={formData.is_primary}
                        onChange={handleChange}
                        label={formData.is_primary ? 'Yes' : 'No'}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <Form.Label>Auto Increment</Form.Label>
                    <div className="form-switch">
                      <Form.Check
                        type="switch"
                        id="is_auto_increment"
                        name="is_auto_increment"
                        checked={formData.is_auto_increment}
                        onChange={handleChange}
                        label={formData.is_auto_increment ? 'Yes' : 'No'}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <Form.Label>Foreign Key</Form.Label>
                    <div className="form-switch">
                      <Form.Check
                        type="switch"
                        id="is_foreign_key"
                        name="is_foreign_key"
                        checked={formData.is_foreign_key}
                        onChange={handleChange}
                        label={formData.is_foreign_key ? 'Yes' : 'No'}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {formData.is_foreign_key && (
              <div className="row">
                <hr />
                <div className="col-md-6 mb-2">
                  <Form.Label>Reference Table</Form.Label>
                  <Form.Select name="reference_table_id" value={formData.reference_table_id} onChange={handleChange}>
                    <option value="">Select table</option>
                    {referenceTables.map(tbl => (
                      <option key={tbl.table_id} value={tbl.table_id}>{tbl.table_name}</option>
                    ))}
                  </Form.Select>
                </div>
                <div className="col-md-6 mb-2">
                  <Form.Label>Reference Field</Form.Label>
                  <Form.Select name="reference_table_field_id" value={formData.reference_table_field_id} onChange={handleChange}>
                    <option value="">Select field</option>
                    {(referenceFieldMap[formData.reference_table_id] || []).map(f => (
                      <option key={f.table_wise_field_id} value={f.table_wise_field_id}>{f.field_name}</option>
                    ))}
                  </Form.Select>
                </div>
              </div>
            )}

            <div className="d-flex gap-2">
              <Button type="submit">{editingFieldId ? 'Update Field' : 'Add Field'}</Button>
              <Button variant="secondary" onClick={resetForm}>Clear</Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};

export default TableField;
