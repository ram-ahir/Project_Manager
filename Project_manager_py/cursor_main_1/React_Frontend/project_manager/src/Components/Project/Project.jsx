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
  MenuItem,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Avatar,
  alpha
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Storage as StorageIcon,
  Folder as FolderIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useTheme } from '../../Context/ThemeContext';
import toast, { Toaster } from 'react-hot-toast';

const Project = ({ currentProject, setcurrentProject }) => {
  const { gridHeaderStyle, selectedRowStyle, primaryColor, secondaryColor } = useTheme();
  const [projects, setProjects] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProjectName, setSelectedProjectName] = useState('Select Project');
  const [formData, setFormData] = useState({
    project_name: '',
    project_description: '',
    database_id: '',
    database_path: '',
    project_path: ''
  });
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, project: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchProjects();
    fetchDatabases();
  }, []);

  useEffect(() => {
    if (currentProject && currentProject.project_id) {
      setSelectedProjectId(currentProject.project_id);
      setSelectedProjectName(currentProject.project_name);
    }
  }, [currentProject, projects]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/project');
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      toast.error('Failed to fetch projects');
    }
  };

  const fetchDatabases = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/database');
      setDatabases(res.data);
    } catch (err) {
      console.error('Failed to fetch databases:', err);
      toast.error('Failed to fetch databases');
    }
  };

  const handleEdit = (project) => {
    setSelectedProjectId(project.project_id);
    setFormData({
      project_name: project.project_name,
      project_description: project.project_description || '',
      database_id: project.database_id,
      database_path: project.database_path || '',
      project_path: project.project_path || ''
    });
    setEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/project/${id}`);
      toast.success('Project deleted successfully');
      fetchProjects();
      if (selectedProjectId === id) resetForm();
    } catch (err) {
      console.error('Error deleting project:', err);
      toast.error('Failed to delete project');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(
          `http://localhost:3000/api/project/${selectedProjectId}`,
          formData
        );
        toast.success('Project updated successfully');
      } else {
        await axios.post('http://localhost:3000/api/project', formData);
        toast.success('Project created successfully');
      }
      fetchProjects();
      resetForm();
    } catch (err) {
      console.error('Error saving project:', err);
      toast.error('Failed to save project');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setSelectedProjectId(null);
    setFormData({
      project_name: '',
      project_description: '',
      database_id: '',
      database_path: '',
      project_path: ''
    });
    setEditing(false);
    setShowForm(false);
  };

  const getDatabaseName = (id) => {
    const db = databases.find(d => d.database_id === id);
    return db ? db.database_name : id;
  };

  const getDatabaseColor = (id) => {
    const db = databases.find(d => d.database_id === id);
    if (!db) return 'default';
    
    switch (db.database_name.toLowerCase()) {
      case 'mysql': return 'success';
      case 'postgresql': return 'primary';
      case 'mongodb': return 'warning';
      default: return 'default';
    }
  };

  const handleRowClick = (project) => {
    setSelectedProjectId(project.project_id);
    setcurrentProject(project);
    setSelectedProjectName(project.project_name);
  };

  const openDeleteDialog = (project) => {
    setDeleteDialog({ open: true, project });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, project: null });
  };

  const confirmDelete = () => {
    if (deleteDialog.project) {
      handleDelete(deleteDialog.project.project_id);
    }
    closeDeleteDialog();
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
            Project Manager
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon fontSize="small" color="primary" />
            Current: {selectedProjectName}
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
          New Project
        </Button>
      </Box>

      {/* Projects Table */}
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
                  Project Name
                </TableCell>
                <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600, fontSize: '1rem' }}>
                  Description
                </TableCell>
                <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600, fontSize: '1rem' }}>
                  Database
                </TableCell>
                <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600, fontSize: '1rem' }}>
                  Database Path
                </TableCell>
                <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600, fontSize: '1rem' }}>
                  Project Path
                </TableCell>
                <TableCell sx={{ color: gridHeaderStyle.color, fontWeight: 600, fontSize: '1rem', textAlign: 'center' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project, index) => (
                <TableRow
                  key={project.project_id}
                  sx={{
                    cursor: 'pointer',
                    transition: selectedRowStyle.transition || 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: selectedRowStyle.hoverBackgroundColor || alpha(primaryColor, 0.08),
                      transform: 'scale(1.01)',
                      color: selectedRowStyle.hoverColor || 'inherit'
                    },
                    backgroundColor: project.project_id === selectedProjectId ? selectedRowStyle.backgroundColor : 'transparent',
                    borderLeft: project.project_id === selectedProjectId ? selectedRowStyle.borderLeft : '4px solid transparent',
                    borderRight: project.project_id === selectedProjectId ? selectedRowStyle.borderRight : 'none',
                    borderTop: project.project_id === selectedProjectId ? selectedRowStyle.borderTop : 'none',
                    borderBottom: project.project_id === selectedProjectId ? selectedRowStyle.borderBottom : 'none',
                    fontWeight: project.project_id === selectedProjectId ? selectedRowStyle.fontWeight : 'normal',
                    fontSize: project.project_id === selectedProjectId ? selectedRowStyle.fontSize : 'inherit',
                    boxShadow: project.project_id === selectedProjectId ? selectedRowStyle.boxShadow : 'none'
                  }}
                  onClick={() => handleRowClick(project)}
                >
                  <TableCell sx={{ 
                    fontWeight: project.project_id === selectedProjectId ? selectedRowStyle.fontWeight : 500,
                    fontSize: project.project_id === selectedProjectId ? selectedRowStyle.fontSize : '1.1rem',
                    color: project.project_id === selectedProjectId ? selectedRowStyle.color : 'inherit'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32,
                          background: `linear-gradient(45deg, ${primaryColor} 30%, ${secondaryColor} 90%)`,
                          fontSize: '0.9rem'
                        }}
                      >
                        {project.project_name.charAt(0).toUpperCase()}
                      </Avatar>
                      {project.project_name}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.4
                      }}
                    >
                      {project.project_description || 'No description available'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<StorageIcon />}
                      label={getDatabaseName(project.database_id)}
                      color={getDatabaseColor(project.database_id)}
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FolderIcon fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ 
                        color: 'text.secondary',
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {project.database_path || 'Not specified'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FolderIcon fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ 
                        color: 'text.secondary',
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {project.project_path || 'Not specified'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="Edit Project" arrow>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(project);
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
                      <Tooltip title="Delete Project" arrow>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteDialog(project);
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
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Project Dialog */}
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
          {editing ? 'Edit Project' : 'Create New Project'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
              <TextField
                fullWidth
                label="Project Name"
                name="project_name"
                value={formData.project_name}
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
                select
                label="Database"
                name="database_id"
                value={formData.database_id}
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
              >
                {databases.map((db) => (
                  <MenuItem key={db.database_id} value={db.database_id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StorageIcon fontSize="small" />
                      {db.database_name}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Database Path"
                name="database_path"
                value={formData.database_path}
                onChange={handleChange}
                variant="outlined"
                placeholder="e.g., /path/to/database"
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
                label="Project Path"
                name="project_path"
                value={formData.project_path}
                onChange={handleChange}
                variant="outlined"
                placeholder="e.g., /path/to/project"
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
                name="project_description"
                value={formData.project_description}
                onChange={handleChange}
                multiline
                rows={4}
                variant="outlined"
                placeholder="Enter project description..."
                sx={{
                  gridColumn: '1 / -1',
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
              {editing ? 'Update Project' : 'Create Project'}
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
            Are you sure you want to delete the project:
          </Typography>
          <Paper sx={{ p: 2, backgroundColor: alpha('#f44336', 0.1), border: '1px solid rgba(244, 67, 54, 0.3)' }}>
            <Typography variant="h6" color="error" sx={{ fontWeight: 600 }}>
              {deleteDialog.project?.project_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {deleteDialog.project?.project_description || 'No description'}
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
            Delete Project
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Project; 