import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewProjectForm from './NewProjectForm';


const Project = ({setcurrentProject}) => {
    const [projects, setProjects] = useState([]);
    const [project, setProject] = useState(null);

    const [formMode, setFormMode] = useState(""); // "add" or "edit"
    const [selectedProject, setSelectedProject] = useState(""); // for edit

    const handleFormSubmit = async (projectData) => {
        console.log("Submit:", formMode === "edit" ? "Editing" : "Adding", projectData);
        // call POST or PUT here
        try {
            if (formMode === 'edit') {
                // Assuming projectData includes a project_id (required for update)
                await axios.put(`http://localhost:3000/api/project/${selectedProject.project_id}`, projectData);
                alert('Project updated successfully');
            } else {
                await axios.post('http://localhost:3000/api/project', projectData);
                alert('Project added successfully');
            }

            // Optionally, reset or refetch project list here
        } catch (err) {
            console.error('Error saving project:', err);
            alert('Failed to save project');
        }
    };

    useEffect(() => {
        axios.get('http://localhost:3000/api/project')
            .then(res => setProjects(res.data))
            .catch(err => console.error('Failed to fetch projects:', err));
    }, []);

    const handleProjectChange = (e) => {
        const selectedId = parseInt(e.target.value);
        const selectedProject = projects.find(p => p.project_id === selectedId);
        setProject(selectedProject);
        setSelectedProject(selectedProject);
        setcurrentProject(selectedProject);
        console.log('Selected project:', selectedProject);
    };
    return (
        <div>
            <div className='py-2 px-3'>
                <h5 className='pb-3'>Current Project : {selectedProject?selectedProject.project_name : ""}</h5>
                <select className="form-select " aria-label="Project select" onChange={handleProjectChange}>
                    <option value="">Select your Project</option>
                    {projects.map((proj) => (
                        <option key={proj.project_id} value={proj.project_id}>
                            {proj.project_name}
                        </option>
                    ))}
                </select>
            </div>

            <div className='mt-1 px-3 d-flex gap-2'>
                <button
                    type="button"
                    className="btn btn-primary btn-sm px-3"
                    onClick={() => {
                        if (project) {
                            setFormMode("edit");
                            setSelectedProject(project);
                        }
                    }}
                    disabled={!project}
                >
                    Edit
                </button>
                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                        setProject(null);
                        setFormMode("add");
                        setSelectedProject(null);
                    }}
                >
                    Add+ New
                </button>
            </div>

            {formMode === "add" && (
                <NewProjectForm onSubmit={handleFormSubmit} />
            )}
            {formMode === "edit" && selectedProject && (
                <NewProjectForm onSubmit={handleFormSubmit} initialData={selectedProject} />
            )}
        </div>
    )
}

export default Project
