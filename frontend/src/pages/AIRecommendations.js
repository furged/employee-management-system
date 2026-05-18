import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = 'http://localhost:5000/api';

function AIRecommendations() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('recommend');

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
    } catch (err) {
      console.error('Failed to fetch employees');
    }
  };

  const getRecommendations = async () => {
    if (!selectedEmployee) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/ai/recommend`, 
        { employeeId: selectedEmployee },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecommendations(response.data);
    } catch (err) {
      console.error('AI failed');
    }
    setLoading(false);
  };

  const getRanking = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/ai/ranking`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRanking(response.data);
    } catch (err) {
      console.error('Ranking failed');
    }
    setLoading(false);
  };

  const getTraining = async () => {
    if (!selectedEmployee) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/ai/training`,
        { employeeId: selectedEmployee },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTraining(response.data);
    } catch (err) {
      console.error('Training failed');
    }
    setLoading(false);
  };

  const handleAction = () => {
    if (activeTab === 'recommend') getRecommendations();
    if (activeTab === 'ranking') getRanking();
    if (activeTab === 'training') getTraining();
  };

  return (
    <div>
      <h2 style={{color: 'white', marginBottom: '20px'}}>🤖 AI-Powered Insights</h2>
      
      <div className="form-container">
        <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
          <button onClick={() => setActiveTab('recommend')} className={activeTab === 'recommend' ? 'btn' : 'btn btn-secondary'}>Recommendations</button>
          <button onClick={() => setActiveTab('ranking')} className={activeTab === 'ranking' ? 'btn' : 'btn btn-secondary'}>Employee Ranking</button>
          <button onClick={() => setActiveTab('training')} className={activeTab === 'training' ? 'btn' : 'btn btn-secondary'}>Training Suggestions</button>
        </div>
        
        {(activeTab === 'recommend' || activeTab === 'training') && (
          <div className="form-group">
            <label>Select Employee</label>
            <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
              <option value="">Select an employee</option>
              {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name} ({emp.department})</option>)}
            </select>
          </div>
        )}
        
        <button onClick={handleAction} className="btn" disabled={loading}>
          {loading ? 'Processing...' : `Get ${activeTab === 'recommend' ? 'Recommendations' : activeTab === 'ranking' ? 'Ranking' : 'Training'}`}
        </button>
        
        {loading && <LoadingSpinner />}
        
        {recommendations && activeTab === 'recommend' && (
          <div className="ai-response">
            <h3>Recommendations for {recommendations.employee}</h3>
            <p><strong>Promotion:</strong> {recommendations.recommendations?.promotionRecommendation?.eligible ? '✅ Eligible' : '❌ Not Eligible'}</p>
            <p><strong>Reason:</strong> {recommendations.recommendations?.promotionRecommendation?.reason}</p>
            <p><strong>Feedback:</strong> {recommendations.recommendations?.feedback}</p>
            <p><strong>Improvement Areas:</strong> {recommendations.recommendations?.improvementAreas?.join(', ')}</p>
            <p><strong>Career Suggestion:</strong> {recommendations.recommendations?.careerSuggestion}</p>
          </div>
        )}
        
        {ranking && activeTab === 'ranking' && (
          <div className="ai-response">
            <h3>Employee Ranking</h3>
            <p><strong>Top Pick:</strong> {ranking.topPick}</p>
            <p><strong>Summary:</strong> {ranking.summary}</p>
            {ranking.rankings?.map((r, i) => (
              <div key={i} style={{padding: '10px', borderBottom: '1px solid #ddd'}}>
                <strong>#{r.rank}</strong> {r.name} - {r.reason}
              </div>
            ))}
          </div>
        )}
        
        {training && activeTab === 'training' && (
          <div className="ai-response">
            <h3>Training for {training.employee}</h3>
            <p><strong>Priority:</strong> {training.priority}</p>
            <p><strong>Impact:</strong> {training.estimatedImpact}</p>
            {training.courses?.map((c, i) => (
              <div key={i} style={{marginTop: '10px'}}>
                <strong>{c.name}</strong> - {c.platform} ({c.duration})
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AIRecommendations;