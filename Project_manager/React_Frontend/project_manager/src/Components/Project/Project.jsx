import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form } from 'react-bootstrap';
import { useTheme } from '../../Context/ThemeContext';



const Project = ({ currentProject, setcurrentProject }) => {

    const { gridHeaderStyle, selectedRowStyle } = useTheme();


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

    useEffect( () => {
        fetchProjects();
        fetchDatabases();
        // try {
        //     const res = await axios.get('http://127.0.0.1:8000/');
        //     console.log(res.data);
        // } catch (err) {
        //     console.error('Failed to fetch projects:', err);
        // }
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
        }
    };

    const fetchDatabases = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/database');
            setDatabases(res.data);
        } catch (err) {
            console.error('Failed to fetch databases:', err);
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
        const confirmed = window.confirm('Are you sure you want to delete this project?');
        if (!confirmed) return;
        try {
            await axios.delete(`http://localhost:3000/api/project/${id}`);
            fetchProjects();
            if (selectedProjectId === id) resetForm();
        } catch (err) {
            console.error('Error deleting project:', err);
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
            } else {
                await axios.post('http://localhost:3000/api/project', formData);
            }
            fetchProjects();
            resetForm();
        } catch (err) {
            console.error('Error saving project:', err);
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



    return (
        <div className='px-2 '>
            <h5 className="mb-3 text-center pt-2">Project : {selectedProjectName}</h5>

            <Button
                style={gridHeaderStyle}
                className="mb-3 float-end rounded-pill"
                onClick={() => {
                    resetForm();
                    setShowForm(true);
                }}
            >
                Add New Project
            </Button>
            <div >
                <Table hover className="shadow rounded">
                    <thead>
                        <tr>
                            <th style={gridHeaderStyle}>Name</th>
                            <th style={gridHeaderStyle}>Description</th>
                            <th style={gridHeaderStyle}>Database</th>
                            <th style={gridHeaderStyle}>Database Path</th>
                            <th style={gridHeaderStyle}>Project Path</th>
                            <th style={gridHeaderStyle}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {projects.map(proj => (
                            <tr
                                key={proj.project_id}
                                // className={proj.project_id === selectedProjectId ? 'table-active' : ''}
                                onClick={() => {
                                    setSelectedProjectId(proj.project_id);
                                    setcurrentProject(proj);
                                    setSelectedProjectName(proj.project_name)
                                }}
                                style={{
                                    cursor: 'pointer'
                                }}
                            >
                                <td style={proj.project_id === selectedProjectId ? selectedRowStyle : {}}>
                                    {proj.project_name}
                                </td>
                                <td style={proj.project_id === selectedProjectId ? selectedRowStyle : {}}>
                                    {proj.project_description}
                                </td>
                                <td style={proj.project_id === selectedProjectId ? selectedRowStyle : {}}>
                                    {getDatabaseName(proj.database_id)}
                                </td>
                                <td style={proj.project_id === selectedProjectId ? selectedRowStyle : {}}>
                                    {proj.database_path}
                                </td>
                                <td style={proj.project_id === selectedProjectId ? selectedRowStyle : {}}>
                                    {proj.project_path}
                                </td>
                                <td style={proj.project_id === selectedProjectId ? selectedRowStyle : {}}>
                                    <i class="fa-solid fa-pen-to-square fa-lg btn" onClick={(e) => { e.stopPropagation(); handleEdit(proj); }}></i>
                                    <i class="fa-solid fa-trash fa-lg btn" onClick={(e) => { e.stopPropagation(); handleDelete(proj.project_id); }}></i>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>


            <div className="d-flex justify-content-center container-fluid pb-5">
                {showForm && (
                    <Form onSubmit={handleSubmit} className="border p-3 rounded w-50 bg-white shadow">
                        <Form.Group className="mb-2">
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control
                                name="project_name"
                                value={formData.project_name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="project_description"
                                value={formData.project_description}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Database</Form.Label>
                            <Form.Select
                                name="database_id"
                                value={formData.database_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a database</option>
                                {databases.map(db => (
                                    <option key={db.database_id} value={db.database_id}>
                                        {db.database_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Database Path</Form.Label>
                            <Form.Control
                                name="database_path"
                                value={formData.database_path}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Project Path</Form.Label>
                            <Form.Control
                                name="project_path"
                                value={formData.project_path}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <div className="d-flex gap-2">
                            <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
                            <Button variant="secondary" onClick={resetForm}>Cancel</Button>
                        </div>
                    </Form>
                )}
            </div>

        </div>
    );
};

export default Project;
