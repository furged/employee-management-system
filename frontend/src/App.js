import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AddEmployee from './pages/AddEmployee';
import ViewEmployees from './pages/ViewEmployees';
import AIInsights from './pages/AIInsights';
import './App.css';

function App() {
  const token = localStorage.getItem('token');
  
  return (
    <Router>
      <div className="app">
        {token && <Navbar />}
        <div className="container">
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={
              token ? <ViewEmployees /> : <Navigate to="/signin" />
            } />
            <Route path="/add-employee" element={
              token ? <AddEmployee /> : <Navigate to="/signin" />
            } />
            <Route path="/ai-insights" element={
              token ? <AIInsights /> : <Navigate to="/signin" />
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;