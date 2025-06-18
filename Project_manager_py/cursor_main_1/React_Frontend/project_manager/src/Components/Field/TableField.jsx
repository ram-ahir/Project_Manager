import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Key as KeyIcon,
  AutoFixHigh as AutoFixHighIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { useTheme } from '../../Context/ThemeContext';
import toast, { Toaster } from 'react-hot-toast';

const TableField = ({ tableId, project }) => {
  const { gridHeaderStyle, selectedRowStyle, primaryColor, secondaryColor } = useTheme();

  const [tablename, setTablename] = useState(" ")
  const [fields, setFields] = useState([]);
  const [editingFieldId, setEditingFieldId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, field: null });
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
    try {
    const res = await axios.get(`http://localhost:3000/api/gettablename?table_id=${tableId}`);
    setTablename(res.data);
    } catch (err) {
      console.error('Failed to fetch table name:', err);
      toast.error('Failed to fetch table name');
    }
  };

  const fetchFields = async () => {
    setLoading(true);
    try {
    const res = await axios.get(`http://localhost:3000/api/fields?table_id=${tableId}`);
    setFields(res.data);
    } catch (err) {
      console.error('Failed to fetch fields:', err);
      toast.error('Failed to fetch fields');
    } finally {
      setLoading(false);
    }
  };

  const fetchDatatypes = async () => {
    try {
    const res = await axios.get(`http://localhost:3000/api/datatype`);
    setDatatypes(res.data);
    } catch (err) {
      console.error('Failed to fetch datatypes:', err);
      toast.error('Failed to fetch datatypes');
    }
  };

  const fetchReferenceTables = async () => {
    try {
    const res = await axios.get(`http://localhost:3000/api/tables?project_id=${project.project_id}`);
    setReferenceTables(res.data);
    for (let table of res.data) {
      fetchReferenceFields(table.table_id);
      }
    } catch (err) {
      console.error('Failed to fetch reference tables:', err);
      toast.error('Failed to fetch reference tables');
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
    
    // Create the new form data
    let newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };

    // Handle foreign key toggle - clear reference fields when turned OFF
    if (name === 'is_foreign_key' && !checked) {
      newFormData = {
        ...newFormData,
        reference_table_id: '',
        reference_table_field_id: ''
      };
      toast.success('Reference fields cleared - Foreign Key disabled');
    }

    // Handle datatype change - reset field properties when switching away from numeric types
    if (name === 'field_datatype_id') {
      const selected = datatypes.find(dt => dt.field_datatype_id === parseInt(value));
      const isNumeric = selected && ['Number', 'Decimal Number', 'Primary Key'].includes(selected.display_name);
      
      if (!isNumeric) {
        newFormData = {
          ...newFormData,
          is_primary: false,
          is_auto_increment: false,
          is_foreign_key: false,
          reference_table_id: '',
          reference_table_field_id: ''
        };
        toast.success('Field properties reset - Non-numeric datatype selected');
      }
    }

    // Handle reference table change - clear reference field when table changes
    if (name === 'reference_table_id') {
      newFormData = {
        ...newFormData,
        reference_table_field_id: ''
      };
      if (value) {
        toast.success('Reference field cleared - Please select a new reference field');
      }
    }

    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, table_id: tableId };
      if (editingFieldId) {
        await axios.put(`http://localhost:3000/api/fields/${editingFieldId}`, payload);
        toast.success('Field updated successfully');
      } else {
        await axios.post(`http://localhost:3000/api/fields`, payload);
        toast.success('Field created successfully');
      }
      fetchFields();
      resetForm();
    } catch (err) {
      console.error('Error saving field:', err);
      toast.error('Failed to save field');
    } finally {
      setLoading(false);
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
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/fields/${id}`);
      fetchFields();
      if (editingFieldId === id) resetForm();
      toast.success('Field deleted successfully');
    } catch (err) {
      console.error('Error deleting field:', err);
      toast.error('Failed to delete field');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (field) => {
    setDeleteDialog({ open: true, field });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, field: null });
  };

  const confirmDelete = () => {
    if (deleteDialog.field) {
      handleDelete(deleteDialog.field.table_wise_field_id);
    }
    closeDeleteDialog();
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
    <Box sx={{ mt: 4 }}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
            fontSize: '14px',
          },
        }}
      />

      {/* Header Section */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" component="h2" gutterBottom sx={{ 
            fontWeight: 600,
            background: `linear-gradient(45deg, ${primaryColor} 30%, ${secondaryColor} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Fields for: {tablename.table_name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon fontSize="small" color="primary" />
            {fields.length} field{fields.length !== 1 ? 's' : ''} in this table
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          sx={{
            borderRadius: '25px',
            textTransform: 'none',
            px: 3,
            py: 1.5,
            background: `linear-gradient(45deg, ${primaryColor} 30%, ${secondaryColor} 90%)`,
            boxShadow: `0 3px 5px 2px ${alpha(secondaryColor, 0.3)}`,
            '&:hover': {
              background: `linear-gradient(45deg, ${primaryColor} 40%, ${secondaryColor} 100%)`,
              transform: 'translateY(-2px)',
              boxShadow: `0 6px 10px 2px ${alpha(secondaryColor, 0.4)}`,
            },
            transition: 'all 0.3s ease'
          }}
        >
        Add Field
      </Button>
      </Box>

      {/* Fields Table */}
      <Paper 
        elevation={3} 
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <TableContainer sx={{ overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: gridHeaderStyle.gradient || gridHeaderStyle.backgroundColor }}>
                <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600, fontSize: '0.9rem' }}>
                  Field Name
                </TableCell>
                <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600, fontSize: '0.9rem' }}>
                  Label
                </TableCell>
                <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600, fontSize: '0.9rem' }}>
                  Display
                </TableCell>
                <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600, fontSize: '0.9rem' }}>
                  Datatype
                </TableCell>
                <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>
                  Primary
                </TableCell>
                <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>
                  Auto-Inc
                </TableCell>
                <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>
                  Foreign Key
                </TableCell>
                <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600, fontSize: '0.9rem' }}>
                  Reference Table
                </TableCell>
                <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600, fontSize: '0.9rem' }}>
                  Reference Field
                </TableCell>
                <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress sx={{ color: primaryColor }} />
                  </TableCell>
                </TableRow>
              ) : fields.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No fields found for this table
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                fields.map(field => {
            const refField = referenceFieldMap[field.reference_table_id]?.find(
              f => f.table_wise_field_id === field.reference_table_field_id
            );
            return (
                    <TableRow
                      key={field.table_wise_field_id}
                      sx={{
                        transition: selectedRowStyle.transition || 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: selectedRowStyle.hoverBackgroundColor || alpha(primaryColor, 0.08),
                          transform: 'scale(1.01)',
                        },
                        backgroundColor: field.table_wise_field_id === editingFieldId ? selectedRowStyle.backgroundColor : 'transparent',
                        borderLeft: field.table_wise_field_id === editingFieldId ? selectedRowStyle.borderLeft : '4px solid transparent',
                        fontWeight: field.table_wise_field_id === editingFieldId ? selectedRowStyle.fontWeight : 'normal',
                        fontSize: field.table_wise_field_id === editingFieldId ? selectedRowStyle.fontSize : 'inherit',
                      }}
                    >
                      <TableCell sx={{ 
                        fontWeight: field.table_wise_field_id === editingFieldId ? selectedRowStyle.fontWeight : 600,
                        fontSize: field.table_wise_field_id === editingFieldId ? selectedRowStyle.fontSize : '1rem',
                        color: field.table_wise_field_id === editingFieldId ? selectedRowStyle.color : 'inherit'
                      }}>
                        {field.field_name}
                      </TableCell>
                      <TableCell sx={{ 
                        color: field.table_wise_field_id === editingFieldId ? selectedRowStyle.color : 'text.secondary'
                      }}>
                        {field.field_label || '-'}
                      </TableCell>
                      <TableCell sx={{ 
                        color: field.table_wise_field_id === editingFieldId ? selectedRowStyle.color : 'text.secondary'
                      }}>
                        {field.display_name || '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={datatypes.find(dt => dt.field_datatype_id === field.field_datatype_id)?.display_name || 'Unknown'}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {field.is_primary ? (
                          <Chip
                            icon={<KeyIcon />}
                            label="Yes"
                            size="small"
                            color="success"
                            variant="filled"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">-</Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {field.is_auto_increment ? (
                          <Chip
                            icon={<AutoFixHighIcon />}
                            label="Yes"
                            size="small"
                            color="info"
                            variant="filled"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">-</Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {field.is_foreign_key ? (
                          <Chip
                            icon={<LinkIcon />}
                            label="Yes"
                            size="small"
                            color="warning"
                            variant="filled"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">-</Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ 
                        color: field.table_wise_field_id === editingFieldId ? selectedRowStyle.color : 'text.secondary'
                      }}>
                        {referenceTables.find(t => t.table_id === field.reference_table_id)?.table_name || '-'}
                      </TableCell>
                      <TableCell sx={{ 
                        color: field.table_wise_field_id === editingFieldId ? selectedRowStyle.color : 'text.secondary'
                      }}>
                        {refField?.field_name || '-'}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="Edit Field" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(field)}
                              sx={{
                                backgroundColor: alpha(primaryColor, 0.1),
                                '&:hover': {
                                  backgroundColor: alpha(primaryColor, 0.2),
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <EditIcon fontSize="small" color="primary" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Field" arrow>
                            <IconButton
                              size="small"
                              onClick={() => openDeleteDialog(field)}
                              sx={{
                                backgroundColor: alpha('#f44336', 0.1),
                                '&:hover': {
                                  backgroundColor: alpha('#f44336', 0.2),
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <DeleteIcon fontSize="small" color="error" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
      </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Field Dialog */}
      <Dialog
        open={showForm}
        onClose={resetForm}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          background: `linear-gradient(45deg, ${primaryColor} 30%, ${secondaryColor} 90%)`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <AddIcon />
          {editingFieldId ? 'Edit Field' : 'Create New Field'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
              <TextField
                fullWidth
                label="Field Name"
                name="field_name"
                value={formData.field_name}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: primaryColor,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: primaryColor,
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Field Label"
                name="field_label"
                value={formData.field_label}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: primaryColor,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: primaryColor,
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Display Name"
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: primaryColor,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: primaryColor,
                    },
                  },
                }}
              />
              <FormControl fullWidth>
                <InputLabel>Field Datatype</InputLabel>
                <Select
                  name="field_datatype_id"
                  value={formData.field_datatype_id}
                  onChange={handleChange}
                  required
                  label="Field Datatype"
                  sx={{
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: primaryColor,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: primaryColor,
                    },
                  }}
                >
                  <MenuItem value="">Select datatype</MenuItem>
                  {datatypes.map(dt => (
                    <MenuItem key={dt.field_datatype_id} value={dt.field_datatype_id}>
                      {dt.display_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {isNumericType() && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                  Field Properties
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="is_primary"
                        checked={formData.is_primary}
                        onChange={handleChange}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: primaryColor,
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: primaryColor,
                          },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <KeyIcon fontSize="small" color="primary" />
                        Primary Key
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        name="is_auto_increment"
                        checked={formData.is_auto_increment}
                        onChange={handleChange}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: primaryColor,
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: primaryColor,
                          },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AutoFixHighIcon fontSize="small" color="info" />
                        Auto Increment
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        name="is_foreign_key"
                        checked={formData.is_foreign_key}
                        onChange={handleChange}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: primaryColor,
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: primaryColor,
                          },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinkIcon fontSize="small" color="warning" />
                        Foreign Key
                      </Box>
                    }
                  />
                </Box>
              </>
            )}

            {formData.is_foreign_key && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                  Foreign Key Reference
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Reference Table</InputLabel>
                    <Select
                      name="reference_table_id"
                      value={formData.reference_table_id}
                      onChange={handleChange}
                      label="Reference Table"
                      sx={{
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: primaryColor,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: primaryColor,
                        },
                      }}
                    >
                      <MenuItem value="">Select table</MenuItem>
                    {referenceTables.map(tbl => (
                        <MenuItem key={tbl.table_id} value={tbl.table_id}>
                          {tbl.table_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Reference Field</InputLabel>
                    <Select
                      name="reference_table_field_id"
                      value={formData.reference_table_field_id}
                      onChange={handleChange}
                      label="Reference Field"
                      disabled={!formData.reference_table_id}
                      sx={{
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: primaryColor,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: primaryColor,
                        },
                      }}
                    >
                      <MenuItem value="">Select field</MenuItem>
                    {(referenceFieldMap[formData.reference_table_id] || []).map(f => (
                        <MenuItem key={f.table_wise_field_id} value={f.table_wise_field_id}>
                          {f.field_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
            <Button 
              onClick={resetForm} 
              variant="outlined"
              sx={{
                borderRadius: '25px',
                textTransform: 'none',
                px: 3,
                py: 1.5,
                borderColor: primaryColor,
                color: primaryColor,
                '&:hover': {
                  borderColor: primaryColor,
                  backgroundColor: alpha(primaryColor, 0.08),
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: '25px',
                textTransform: 'none',
                px: 3,
                py: 1.5,
                background: `linear-gradient(45deg, ${primaryColor} 30%, ${secondaryColor} 90%)`,
                boxShadow: `0 3px 5px 2px ${alpha(secondaryColor, 0.3)}`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${primaryColor} 40%, ${secondaryColor} 100%)`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 6px 10px 2px ${alpha(secondaryColor, 0.4)}`,
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : (editingFieldId ? 'Update Field' : 'Create Field')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          background: 'linear-gradient(45deg, #f44336 30%, #ff5722 90%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <WarningIcon />
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. The field and all its data will be permanently deleted.
          </Alert>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete the field:
          </Typography>
          <Paper sx={{ p: 2, backgroundColor: alpha('#f44336', 0.1), border: '1px solid rgba(244, 67, 54, 0.3)' }}>
            <Typography variant="h6" color="error" sx={{ fontWeight: 600 }}>
              {deleteDialog.field?.field_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {deleteDialog.field?.field_label || 'No label'} • {datatypes.find(dt => dt.field_datatype_id === deleteDialog.field?.field_datatype_id)?.display_name || 'Unknown type'}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
          <Button 
            onClick={closeDeleteDialog} 
            variant="outlined"
            sx={{
              borderRadius: '25px',
              textTransform: 'none',
              px: 3,
              py: 1.5,
              borderColor: '#666',
              color: '#666',
              '&:hover': {
                borderColor: '#333',
                backgroundColor: alpha('#666', 0.08),
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            variant="contained"
            color="error"
            sx={{
              borderRadius: '25px',
              textTransform: 'none',
              px: 3,
              py: 1.5,
              background: 'linear-gradient(45deg, #f44336 30%, #ff5722 90%)',
              boxShadow: '0 3px 5px 2px rgba(244, 67, 54, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #d32f2f 30%, #e64a19 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 10px 2px rgba(244, 67, 54, .4)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Delete Field
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TableField;
