import React, { useState } from 'react'
import NewProjectForm from './NewProjectForm';
import Leftbar from './Leftbar';
import axios from 'axios';

const AdminPanel = () => {
    const [activeItem, setActiveItem] = useState("Project");
    const [formMode, setFormMode] = useState("add"); // "add" or "edit"
    const [selectedProject, setSelectedProject] = useState(null); // for edit

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

    const renderContent = () => {
        switch (activeItem) {
            case "Project":
                return (
                    <div>
                        <h3>Project Section</h3>
                        {formMode === "add" && (
                            <NewProjectForm onSubmit={handleFormSubmit} />
                        )}
                        {formMode === "edit" && selectedProject && (
                            <NewProjectForm onSubmit={handleFormSubmit} initialData={selectedProject} />
                        )}
                    </div>
                )
            case "Products":
                return <div><h3>Products Section</h3><p>Manage your products here...</p></div>;
            case "Tables":
                return <div><h3>Tables Section</h3><p>Configure your database tables...</p></div>;
            case "Forms":
                return <div><h3>Forms Section</h3><p>Design and manage forms...</p></div>;
            case "Users":
                return <div><h3>Users Section</h3><p>Manage user access and roles...</p></div>;
            default:
                return <div><h3>Welcome</h3><p>Select a section from the sidebar.</p></div>;
        }
    };

    return (
        <div className="container-fluid">
            <div className="row vh-100">
                {/* Sidebar */}
                <div className="col-auto bg-light border-end p-0">
                    <Leftbar
                        setActiveItem={setActiveItem}
                        onEditProject={(project) => {
                            setFormMode("edit");
                            setSelectedProject(project);
                        }}
                        onAddNewProject={() => {
                            setFormMode("add");
                            setSelectedProject(null);
                        }}
                    />
                </div>

                {/* Content Area */}
                <div className="col-md-8 p-4">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default AdminPanel
