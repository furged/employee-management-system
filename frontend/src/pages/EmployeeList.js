import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = 'https://employee-backend-1pfm.onrender.com/api';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchDept, setSearchDept] = useState('');
  const [searchSkill, setSearchSkill] = useState('');
  const [minScore, setMinScore] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(response.data.data);
      setFilteredEmployees(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch employees');
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = `${API_URL}/employees/search?`;
      if (searchDept) url += `department=${searchDept}&`;
      if (searchSkill) url += `skill=${searchSkill}&`;
      if (minScore) url += `minScore=${minScore}&`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFilteredEmployees(response.data.data);
    } catch (err) {
      setError('Search failed');
    }
  };

  const resetSearch = () => {
    setSearchDept('');
    setSearchSkill('');
    setMinScore('');
    setFilteredEmployees(employees);
  };

  const updatePerformance = async (id, newScore) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/employees/${id}/performance`, 
        { performanceScore: newScore },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEmployees();
    } catch (err) {
      setError('Failed to update score');
    }
  };

  const deleteEmployee = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchEmployees();
      } catch (err) {
        setError('Failed to delete');
      }
    }
  };

  const getScoreClass = (score) => {
    if (score >= 80) return 'performance-high';
    if (score >= 60) return 'performance-medium';
    return 'performance-low';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 style={{color: 'white', marginBottom: '20px'}}>Employee Directory</h2>
      
      <div className="search-section">
        <select value={searchDept} onChange={(e) => setSearchDept(e.target.value)}>
          <option value="">All Departments</option>
          <option value="Development">Development</option>
          <option value="HR">HR</option>
          <option value="Sales">Sales</option>
          <option value="Marketing">Marketing</option>
          <option value="Finance">Finance</option>
        </select>
        <input type="text" placeholder="Search by skill" value={searchSkill} onChange={(e) => setSearchSkill(e.target.value)} />
        <input type="number" placeholder="Min performance score" value={minScore} onChange={(e) => setMinScore(e.target.value)} />
        <button onClick={handleSearch} className="btn btn-secondary">Search</button>
        <button onClick={resetSearch} className="btn btn-secondary">Reset</button>
      </div>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      <div className="cards-grid">
        {filteredEmployees.map((emp) => (
          <div key={emp._id} className="card">
            <h3>{emp.name}</h3>
            <p>📧 {emp.email}</p>
            <p>🏢 {emp.department}</p>
            <p>💼 {emp.experience} years</p>
            <p className={getScoreClass(emp.performanceScore)}>⭐ Performance: {emp.performanceScore}/100</p>
            <div className="skills-list">
              {emp.skills.map((skill, idx) => <span key={idx} className="skill-badge">{skill}</span>)}
            </div>
            <div style={{marginTop: '10px', display: 'flex', gap: '10px'}}>
              <input type="number" placeholder="New score" style={{width: '100px'}} onBlur={(e) => updatePerformance(emp._id, e.target.value)} />
              <button onClick={() => deleteEmployee(emp._id)} className="btn btn-secondary">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployeeList;