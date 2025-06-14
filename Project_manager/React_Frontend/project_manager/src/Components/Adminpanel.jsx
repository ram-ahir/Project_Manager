import React, { useState } from 'react';
import './Adminpanelstyle.css'; // Import styles for sidebar and active/hover effect
import Project from './Project/Project';
import Tables from './Table/Tables';
import ThemeSettings from './Theme/ThemeSettings';

const Adminpanel = ({currentProject, setcurrentProject}) => {

  // const [currentProject, setcurrentProject] = useState(null);
    
  const [activeItem, setActiveItem] = useState('Project');

  const renderContent = () => {
    switch (activeItem) {
      case 'Project':
        return (
            <Project currentProject={currentProject} setcurrentProject={setcurrentProject}/>
        )
      case 'Tables':
        return (
            <Tables project={currentProject}/>
        )
      case 'Forms':
        return <div><h3>Forms Section</h3><p>Manage forms here.</p></div>;

      case 'Theme':
        return (
            <ThemeSettings/>
        )
      
      default:
        return <div><h3>Welcome</h3><p>Select a section from the sidebar.</p></div>;
    }
  };

  const navItems = ['Project', 'Tables', 'Forms', 'Theme'];

  return (
    <div className="admin-panel-container">
      <div className="sidebar p-2 gap-2 bg-dark text-white">
        {/* <p className='text-center m-0' style={{color:"yellow", fontSize:"13px"}} >{currentProject?.project_name || 'No project selected'}</p> */}
        {navItems.map(item => (
          <div
            key={item}
            className={`px-3 py-2 rounded sidebar-item ${activeItem === item ? 'active' : ''}`}
            onClick={() => setActiveItem(item)}
          >
            {item}
          </div>
        ))}
      </div>

      <div className="content-area p-1">
        {renderContent()}
      </div>
    </div>
  );
};

export default Adminpanel;
