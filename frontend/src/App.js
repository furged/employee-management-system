import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeList from './pages/EmployeeList';
import AIRecommendations from './pages/AIRecommendations';
import './App.css';

function App() {
  const token = localStorage.getItem('token');
  
  return (
    <Router>
      <div className="app">
        {token && <Navbar />}
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              token ? <EmployeeList /> : <Navigate to="/login" />
            } />
            <Route path="/add-employee" element={
              token ? <EmployeeForm /> : <Navigate to="/login" />
            } />
            <Route path="/ai-recommendations" element={
              token ? <AIRecommendations /> : <Navigate to="/login" />
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;