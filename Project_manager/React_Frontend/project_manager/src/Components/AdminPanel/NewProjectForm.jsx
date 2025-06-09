import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewProjectForm = ({ onSubmit, initialData = null }) => {
  const [project, setProject] = useState({
    project_name: '',
    project_description: '',
    database_id: '',
    database_path: ''
  });

  const [databases, setDatabases] = useState([]);

  useEffect(() => {
    // Fetch database list on load
    axios.get('http://localhost:3000/api/database') // Adjust this to match your actual API route
      .then(res => setDatabases(res.data))
      .catch(err => console.error("Failed to fetch databases", err));
  }, []);

  useEffect(() => {
    if (initialData) {
      setProject({
        project_name: initialData.project_name || '',
        project_description: initialData.project_description || '',
        database_id: initialData.database_id || '',
        database_path: initialData.database_path || ''
      });
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setProject(prev => ({
      ...prev,
      [name]: name === 'database_id' ? Number(value) : value
    }));
  };


  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(project);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 mb-3">
      <h5 className="mb-3">{initialData ? "Edit Project" : "New Project"}</h5>

      <input
        className="form-control mb-2"
        name="project_name"
        placeholder="Project Name"
        value={project.project_name}
        onChange={handleChange}
      />

      <input
        className="form-control mb-2"
        name="project_description"
        placeholder="Project Description"
        value={project.project_description}
        onChange={handleChange}
      />

      <select
        className="form-select mb-2"
        name="database_id"
        value={project.database_id}
        onChange={handleChange}
      >
        <option value="">Select Database</option>
        {databases.map(db => (
          <option key={db.database_id} value={db.database_id}>
            {db.database_name}
          </option>
        ))}
      </select>

      <input
        className="form-control mb-3"
        name="database_path"
        placeholder="Database Path"
        value={project.database_path}
        onChange={handleChange}
      />

      <button className="btn btn-primary">
        {initialData ? "Update Project" : "Save Project"}
      </button>
    </form>
  );
};

export default NewProjectForm;
