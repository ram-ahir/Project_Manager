import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
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
  Snackbar,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Code as CodeIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useTheme } from '../../Context/ThemeContext';
import toast, { Toaster } from 'react-hot-toast';
import TableField from '../Field/TableField';

const Tables = ({ project, onSelectTable }) => {
  const { gridHeaderStyle, selectedRowStyle, primaryColor, secondaryColor } = useTheme();

  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    table_name: '',
    table_description: '',
    is_generated: false,
    generated_date: ''
  });
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, table: null });

  // Fetch tables when project changes
  useEffect(() => {
    const fetchTables = async () => {
      if (!project?.project_id) {
        setTables([]);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/api/tables?project_id=${project.project_id}`
        );
        setTables(res.data);
      } catch (err) {
        console.error('Failed to fetch tables:', err);
        toast.error('Failed to fetch tables');
      } finally {
        setLoading(false);
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
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/tables/${id}`);
      setTables(tables.filter(t => t.table_id !== id));
      if (selectedTableId === id) resetForm();
      toast.success('Table deleted successfully');
    } catch (err) {
      console.error('Error deleting table:', err);
      toast.error('Failed to delete table');
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (table) => {
    setDeleteDialog({ open: true, table });
  };

  // Close delete confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, table: null });
  };

  // Confirm delete action
  const confirmDelete = () => {
    if (deleteDialog.table) {
      handleDelete(deleteDialog.table.table_id);
    }
    closeDeleteDialog();
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
    
    setLoading(true);
    try {
      if (editing) {
        await axios.put(
          `http://localhost:3000/api/tables/${selectedTableId}`,
          payload
        );
        toast.success('Table updated successfully');
      } else {
        await axios.post(`http://localhost:3000/api/tables`, payload);
        toast.success('Table created successfully');
      }
      const res = await axios.get(
        `http://localhost:3000/api/tables?project_id=${project.project_id}`
      );
      setTables(res.data);
      resetForm();
    } catch (err) {
      console.error('Error saving table:', err);
      toast.error('Failed to save table');
    } finally {
      setLoading(false);
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

  // handleGenerateSQL
  const handleGenerateSQL = async (tableId) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/generate-sql?table_id=${tableId}`);
      console.log('Generated SQL:', res.data.query);
      toast.success('SQL generated successfully! Check console for output.');
    } catch (err) {
      console.error('Failed to generate SQL:', err);
      toast.error('Failed to generate SQL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: 600,
            background: `linear-gradient(45deg, ${primaryColor} 30%, ${secondaryColor} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Tables Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon fontSize="small" color="primary" />
            Project: {project?.project_name || 'No project selected'}
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
          Add Table
        </Button>
      </Box>

      {/* Tables Table */}
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
                <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600, fontSize: '1rem' }}>
                  Table Name
                </TableCell>
                <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600, fontSize: '1rem' }}>
                  Description
                </TableCell>
                <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600, fontSize: '1rem' }}>
                  Generated
                </TableCell>
                <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600, fontSize: '1rem' }}>
                  Generated Date
                </TableCell>
                <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600, fontSize: '1rem', textAlign: 'center' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress sx={{ color: primaryColor }} />
                  </TableCell>
                </TableRow>
              ) : tables.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No tables found for this project
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tables.map(tbl => (
                  <TableRow
                    key={tbl.table_id}
                    sx={{
                      cursor: 'pointer',
                      transition: selectedRowStyle.transition || 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: selectedRowStyle.hoverBackgroundColor || alpha(primaryColor, 0.08),
                        transform: 'scale(1.01)',
                        color: selectedRowStyle.hoverColor || 'inherit'
                      },
                      backgroundColor: tbl.table_id === selectedTableId ? selectedRowStyle.backgroundColor : 'transparent',
                      borderLeft: tbl.table_id === selectedTableId ? selectedRowStyle.borderLeft : '4px solid transparent',
                      borderRight: tbl.table_id === selectedTableId ? selectedRowStyle.borderRight : 'none',
                      borderTop: tbl.table_id === selectedTableId ? selectedRowStyle.borderTop : 'none',
                      borderBottom: tbl.table_id === selectedTableId ? selectedRowStyle.borderBottom : 'none',
                      fontWeight: tbl.table_id === selectedTableId ? selectedRowStyle.fontWeight : 'normal',
                      fontSize: tbl.table_id === selectedTableId ? selectedRowStyle.fontSize : 'inherit',
                      boxShadow: tbl.table_id === selectedTableId ? selectedRowStyle.boxShadow : 'none'
                    }}
                    onClick={() => handleRowClick(tbl)}
                  >
                    <TableCell sx={{ 
                      fontWeight: tbl.table_id === selectedTableId ? selectedRowStyle.fontWeight : 500,
                      fontSize: tbl.table_id === selectedTableId ? selectedRowStyle.fontSize : '1.1rem',
                      color: tbl.table_id === selectedTableId ? selectedRowStyle.color : 'inherit'
                    }}>
                      {tbl.table_name}
                    </TableCell>
                    <TableCell sx={{ 
                      color: tbl.table_id === selectedTableId ? selectedRowStyle.color : 'text.secondary',
                      maxWidth: 300
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.4
                        }}
                      >
                        {tbl.table_description || 'No description'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={tbl.is_generated ? 'Yes' : 'No'}
                        color={tbl.is_generated ? 'success' : 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell sx={{ 
                      color: tbl.table_id === selectedTableId ? selectedRowStyle.color : 'text.secondary'
                    }}>
                      {tbl.generated_date
                        ? new Date(tbl.generated_date).toLocaleString()
                        : '-'}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="Edit Table" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(tbl);
                            }}
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
                        <Tooltip title="Delete Table" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteDialog(tbl);
                            }}
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
                        <Tooltip title="Generate SQL" arrow>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CodeIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGenerateSQL(tbl.table_id);
                            }}
                            sx={{
                              borderRadius: '20px',
                              textTransform: 'none',
                              borderColor: 'success.main',
                              color: 'success.main',
                              '&:hover': {
                                borderColor: 'success.dark',
                                backgroundColor: alpha('#4caf50', 0.08),
                              }
                            }}
                          >
                            Generate
                          </Button>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Table Dialog */}
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
          {editing ? 'Edit Table' : 'Create New Table'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
              <TextField
                fullWidth
                label="Table Name"
                name="table_name"
                value={formData.table_name}
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
                label="Description"
                name="table_description"
                value={formData.table_description}
                onChange={handleChange}
                multiline
                rows={3}
                variant="outlined"
                placeholder="Enter table description..."
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
              {editing && (
                <>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="is_generated"
                        checked={formData.is_generated}
                        onChange={handleChange}
                        sx={{
                          color: primaryColor,
                          '&.Mui-checked': {
                            color: primaryColor,
                          },
                        }}
                      />
                    }
                    label="Is Generated"
                  />
                  <TextField
                    fullWidth
                    label="Generated Date"
                    name="generated_date"
                    type="datetime-local"
                    value={formData.generated_date}
                    onChange={handleChange}
                    disabled={!formData.is_generated}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
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
                </>
              )}
            </Box>
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
              {loading ? <CircularProgress size={20} color="inherit" /> : (editing ? 'Update Table' : 'Create Table')}
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
            This action cannot be undone. All associated data will be permanently deleted.
          </Alert>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete the table:
          </Typography>
          <Paper sx={{ p: 2, backgroundColor: alpha('#f44336', 0.1), border: '1px solid rgba(244, 67, 54, 0.3)' }}>
            <Typography variant="h6" color="error" sx={{ fontWeight: 600 }}>
              {deleteDialog.table?.table_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {deleteDialog.table?.table_description || 'No description'}
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
            Delete Table
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table Fields Section */}
      {selectedTableId && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
            Table Fields
          </Typography>
          <TableField tableId={selectedTableId} project={project} />
        </Box>
      )}
    </Container>
  );
};

export default Tables;
