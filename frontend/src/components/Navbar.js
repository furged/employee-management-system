import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };
  
  return (
    <nav className="navbar">
      <h1>👥 AI Employee Management</h1>
      <div className="nav-links">
        <Link to="/">Employees</Link>
        <Link to="/add-employee">Add Employee</Link>
        <Link to="/ai-insights">AI Insights</Link>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;