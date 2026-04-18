/**
 * Express route handlers for employee CRUD operations with validation
 * and consistent HTTP responses for the Employee Directory API.
 */

const employeeModel = require('../models/employeeModel');
const { createHttpError } = require('../middleware/errorHandler');

/**
 * Validates shared employee fields for create and update operations
 * @param {Object} body - Parsed request body from Express
 * @returns {{ valid: boolean, errors: Array<{ field: string, message: string }>, values: { name: string, role: string, department: string, email: string, phone: string } }}
 */
const validateEmployeePayload = (body) => {
  const errors = [];
  const name = body && body.name !== undefined ? String(body.name).trim() : '';
  const role = body && body.role !== undefined ? String(body.role).trim() : '';
  const department =
    body && body.department !== undefined ? String(body.department).trim() : '';
  const email = body && body.email !== undefined ? String(body.email).trim() : '';
  const phone =
    body && body.phone !== undefined && body.phone !== null
      ? String(body.phone).trim()
      : '';

  if (!name) {
    errors.push({ field: 'name', message: 'Full name is required' });
  }
  if (!role) {
    errors.push({ field: 'role', message: 'Role is required' });
  }
  if (!department) {
    errors.push({ field: 'department', message: 'Department is required' });
  }
  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      errors.push({ field: 'email', message: 'Email must be a valid address' });
    }
  }

  return { valid: errors.length === 0, errors, values: { name, role, department, email, phone } };
};

/**
 * Handles GET /api/employees by returning all stored employees
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
const getEmployees = async (req, res, next) => {
  try {
    const employees = employeeModel.findAllEmployees();
    res.status(200).json({ data: employees });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles GET /api/employees/:id for a single employee lookup
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = employeeModel.findEmployeeById(id);
    if (!employee) {
      next(createHttpError(404, 'Employee not found'));
      return;
    }
    res.status(200).json({ data: employee });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles POST /api/employees to create a new employee record
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
const createEmployee = async (req, res, next) => {
  try {
    const validation = validateEmployeePayload(req.body);
    if (!validation.valid) {
      next(createHttpError(400, 'Validation failed', { details: validation.errors, expose: true }));
      return;
    }
    if (employeeModel.isEmailTaken(validation.values.email)) {
      next(
        createHttpError(400, 'Email must be unique', {
          details: [{ field: 'email', message: 'Another employee already uses this email' }],
          expose: true,
        })
      );
      return;
    }
    const created = employeeModel.createEmployee(validation.values);
    res.status(201).json({ data: created });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles PUT /api/employees/:id to update an existing employee
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = employeeModel.findEmployeeById(id);
    if (!existing) {
      next(createHttpError(404, 'Employee not found'));
      return;
    }
    const validation = validateEmployeePayload(req.body);
    if (!validation.valid) {
      next(createHttpError(400, 'Validation failed', { details: validation.errors, expose: true }));
      return;
    }
    if (employeeModel.isEmailTaken(validation.values.email, id)) {
      next(
        createHttpError(400, 'Email must be unique', {
          details: [{ field: 'email', message: 'Another employee already uses this email' }],
          expose: true,
        })
      );
      return;
    }
    const updated = employeeModel.updateEmployeeById(id, validation.values);
    res.status(200).json({ data: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles DELETE /api/employees/:id to remove an employee record
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removed = employeeModel.deleteEmployeeById(id);
    if (!removed) {
      next(createHttpError(404, 'Employee not found'));
      return;
    }
    res.status(200).json({ data: { id } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
