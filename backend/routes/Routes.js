const express = require('express');
const router = express.Router();
const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
  updatePerformanceScore
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addEmployee);
router.get('/', protect, getAllEmployees);
router.get('/search', protect, searchEmployees);
router.get('/:id', protect, getEmployeeById);
router.put('/:id', protect, updateEmployee);
router.put('/:id/performance', protect, updatePerformanceScore);
router.delete('/:id', protect, deleteEmployee);

module.exports = router;