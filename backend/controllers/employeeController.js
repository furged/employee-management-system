const Employee = require('../models/Employee');

const addEmployee = async (req, res) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;
    
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }
    
    const employee = await Employee.create({
      name,
      email,
      department,
      skills,
      performanceScore,
      experience
    });
    
    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePerformanceScore = async (req, res) => {
  try {
    const { performanceScore } = req.body;
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { performanceScore },
      { new: true, runValidators: true }
    );
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchEmployees = async (req, res) => {
  try {
    const { department, skill, minScore } = req.query;
    let query = {};
    
    if (department) query.department = department;
    if (skill) query.skills = { $in: [skill] };
    if (minScore) query.performanceScore = { $gte: parseInt(minScore) };
    
    const employees = await Employee.find(query);
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  updatePerformanceScore,
  deleteEmployee,
  searchEmployees
};