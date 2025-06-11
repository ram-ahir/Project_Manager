import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leftbar = ({ setActiveItem, onEditProject, onAddNewProject, setSelectedProject }) => {

    const [projects, setProjects] = useState([]);
    const [project, setProject] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3000/api/project')
            .then(res => setProjects(res.data))
            .catch(err => console.error('Failed to fetch projects:', err));
    }, []);

    const handleProjectChange = (e) => {
        const selectedId = parseInt(e.target.value);
        const selectedProject = projects.find(p => p.project_id === selectedId);
        setProject(selectedProject);
        setSelectedProject(selectedProject)
        console.log('Selected project:', selectedProject);
    };

    return (
        <div className="p-0"
            style={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                width: '320px',
                fontFamily: 'sans-serif',
            }} >
            <div className="accordion" id="accordionPanelsStayOpenExample">
                <hr className='m-0' />

                {/* Project */}
                <div className="accordion-item border-0">
                    <h2 className="accordion-header" id="headingBudget">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseBudget"
                            style={{ backgroundColor: 'white', color: 'black', boxShadow: 'none', border: 'none' }}>
                            Project : {project?.project_name || 'No project selected'}
                        </button>
                    </h2>
                    <div id="collapseBudget" className="accordion-collapse collapse " data-bs-parent="#budgetAccordion">
                        <div className="accordion-body" onClick={()=>setActiveItem('Project')}>
                            <select className="form-select" aria-label="Project select" onChange={handleProjectChange}>
                                <option value="">Select your Project</option>
                                {projects.map((proj) => (
                                    <option key={proj.project_id} value={proj.project_id}>
                                        {proj.project_name}
                                    </option>
                                ))}
                            </select>
                            <div className='mt-2 d-flex gap-2'>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm px-3"
                                    onClick={() => {
                                        if (project) onEditProject(project);
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
                                        onAddNewProject();
                                    }}
                                >
                                    Add+ New
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                <hr className='m-0 mx-4' />
                {/* Posted by */}
                <div className='p-1 ps-4 py-2' onClick={()=>setActiveItem('Tables')}>
                    <p className="m-0" >
                        Tables for {project?.project_name || 'No project selected'}
                    </p>
                </div>
                <hr className='m-0 mx-4' />

                {/* tables */}
                <div className="accordion-item border-0">
                    <h2 className="accordion-header" id="headingPostedBy">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePostedBy"
                            style={{ backgroundColor: 'white', color: 'black', boxShadow: 'none', border: 'none' }}>
                            Table
                        </button>
                    </h2>
                    <div id="collapsePostedBy" className="accordion-collapse collapse">
                        <div className="accordion-body d-flex flex-wrap gap-2"></div>
                    </div>
                </div>



                <hr className='m-0 mx-4' />
                {/* Purpose */}
                <div className="accordion-item border-0">
                    <h2 className="accordion-header" id="headingPurpose">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePurpose"
                            style={{ backgroundColor: 'white', color: 'black', boxShadow: 'none', border: 'none' }}>
                            zzz
                        </button>
                    </h2>
                    <div id="collapsePurpose" className="accordion-collapse collapse">
                        <div className="accordion-body d-flex gap-2"></div>
                    </div>
                </div>

                <hr className='m-0 mx-4' />
                {/* Property Category */}
                <div className="accordion-item border-0">
                    <h2 className="accordion-header" id="headingCategory">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCategory"
                            style={{ backgroundColor: 'white', color: 'black', boxShadow: 'none', border: 'none' }}>
                            zzzz
                        </button>
                    </h2>
                    <div id="collapseCategory" className="accordion-collapse collapse">
                        <div className="accordion-body d-flex flex-wrap gap-2"></div>
                    </div>
                </div>

                <hr className='m-0 mx-4' />
                {/* Property Type */}
                <div className="accordion-item border-0">
                    <h2 className="accordion-header" id="headingType">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseType"
                            style={{ backgroundColor: 'white', color: 'black', boxShadow: 'none', border: 'none' }}>
                            zzzz
                        </button>
                    </h2>
                    <div id="collapseType" className="accordion-collapse collapse">
                        <div className="accordion-body d-flex flex-wrap gap-2"></div>
                    </div>
                </div>

                <hr className='m-0 mx-4' />
                {/* Area */}
                <div className="accordion-item border-0">
                    <h2 className="accordion-header" id="headingArea">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseArea"
                            style={{ backgroundColor: 'white', color: 'black', boxShadow: 'none', border: 'none' }}>
                            cccc
                        </button>
                    </h2>
                    <div id="collapseArea" className="accordion-collapse collapse" data-bs-parent="#filterAccordion">
                        <div className="accordion-body"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leftbar;
