import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function EmployeeForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Development',
    skills: [],
    performanceScore: '',
    experience: ''
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const token = localStorage.getItem('token');
    
    try {
      await axios.post(`${API_URL}/employees`, {
        ...formData,
        performanceScore: parseInt(formData.performanceScore),
        experience: parseInt(formData.experience)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Employee added successfully!' });
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add employee' });
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{textAlign: 'center', marginBottom: '20px'}}>Add New Employee</h2>
      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Department *</label>
          <select name="department" value={formData.department} onChange={handleChange} required>
            <option value="Development">Development</option>
            <option value="HR">HR</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
        <div className="form-group">
          <label>Skills *</label>
          <div className="skills-input">
            <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Type skill and press Enter" />
            <button type="button" onClick={addSkill} className="btn btn-secondary">Add</button>
          </div>
          <div>
            {formData.skills.map((skill, idx) => (
              <span key={idx} className="skill-tag">{skill}<button type="button" onClick={() => removeSkill(skill)}>×</button></span>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Performance Score (0-100) *</label>
          <input type="number" name="performanceScore" value={formData.performanceScore} onChange={handleChange} required min="0" max="100" />
        </div>
        <div className="form-group">
          <label>Experience (years) *</label>
          <input type="number" name="experience" value={formData.experience} onChange={handleChange} required min="0" step="0.5" />
        </div>
        <button type="submit" className="btn" disabled={loading}>{loading ? 'Adding...' : 'Add Employee'}</button>
      </form>
    </div>
  );
}

export default EmployeeForm;