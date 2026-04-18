/**
 * Persistence layer for employees backed by a JSON file on disk.
 * Provides CRUD helpers used by controllers with unique email enforcement.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataFilePath = path.join(__dirname, '..', 'data', 'employees.json');

/**
 * Reads the raw file contents as UTF-8 text
 * @returns {string}
 */
const readFileUtf8 = () => {
  return fs.readFileSync(dataFilePath, 'utf8');
};

/**
 * Writes UTF-8 text to the employees JSON file atomically via a temp file
 * @param {string} contents - Serialized JSON string to persist
 * @returns {void}
 */
const writeFileUtf8 = (contents) => {
  const directory = path.dirname(dataFilePath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  const tempPath = `${dataFilePath}.${crypto.randomUUID()}.tmp`;
  fs.writeFileSync(tempPath, contents, 'utf8');
  fs.renameSync(tempPath, dataFilePath);
};

/**
 * Parses stored employees JSON safely, defaulting to an empty list on invalid data
 * @returns {Array<Object>}
 */
const readEmployeesFromDisk = () => {
  try {
    const parsed = JSON.parse(readFileUtf8());
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    // Corrupt or missing file should not crash the API; start fresh in memory
    return [];
  }
};

/**
 * Persists the full employees array to disk
 * @param {Array<Object>} employees - Complete employee records to store
 * @returns {void}
 */
const writeEmployeesToDisk = (employees) => {
  writeFileUtf8(JSON.stringify(employees, null, 2));
};

/**
 * Normalizes email for uniqueness comparisons (case-insensitive)
 * @param {string} email - Email address to normalize
 * @returns {string}
 */
const normalizeEmail = (email) => {
  return String(email || '').trim().toLowerCase();
};

/**
 * Returns all employees sorted by createdAt descending (newest first)
 * @returns {Array<Object>}
 */
const findAllEmployees = () => {
  const employees = readEmployeesFromDisk();
  return [...employees].sort((first, second) => {
    const firstDate = new Date(first.createdAt).getTime();
    const secondDate = new Date(second.createdAt).getTime();
    return secondDate - firstDate;
  });
};

/**
 * Finds a single employee by identifier
 * @param {string} id - Employee identifier
 * @returns {Object|undefined}
 */
const findEmployeeById = (id) => {
  const employees = readEmployeesFromDisk();
  return employees.find((employee) => employee.id === id);
};

/**
 * Checks whether an email is already used by another employee record
 * @param {string} email - Email to check
 * @param {string|undefined} excludeId - Employee id to ignore (for updates)
 * @returns {boolean}
 */
const isEmailTaken = (email, excludeId) => {
  const target = normalizeEmail(email);
  const employees = readEmployeesFromDisk();
  return employees.some((employee) => {
    if (excludeId && employee.id === excludeId) {
      return false;
    }
    return normalizeEmail(employee.email) === target;
  });
};

/**
 * Inserts a new employee record after assigning id and timestamps
 * @param {{ name: string, role: string, department: string, email: string, phone?: string }} payload - Employee fields
 * @returns {Object} Newly created employee
 */
const createEmployee = (payload) => {
  const employees = readEmployeesFromDisk();
  const now = new Date().toISOString();
  const newEmployee = {
    id: crypto.randomUUID(),
    name: String(payload.name).trim(),
    role: String(payload.role).trim(),
    department: String(payload.department).trim(),
    email: String(payload.email).trim(),
    phone: payload.phone ? String(payload.phone).trim() : '',
    createdAt: now,
  };
  employees.push(newEmployee);
  writeEmployeesToDisk(employees);
  return newEmployee;
};

/**
 * Updates an existing employee or returns null when not found
 * @param {string} id - Employee identifier
 * @param {{ name: string, role: string, department: string, email: string, phone?: string }} payload - Fields to persist
 * @returns {Object|null}
 */
const updateEmployeeById = (id, payload) => {
  const employees = readEmployeesFromDisk();
  const index = employees.findIndex((employee) => employee.id === id);
  if (index === -1) {
    return null;
  }
  const existing = employees[index];
  const updated = {
    ...existing,
    name: String(payload.name).trim(),
    role: String(payload.role).trim(),
    department: String(payload.department).trim(),
    email: String(payload.email).trim(),
    phone: payload.phone ? String(payload.phone).trim() : '',
  };
  employees[index] = updated;
  writeEmployeesToDisk(employees);
  return updated;
};

/**
 * Deletes an employee by id when present
 * @param {string} id - Employee identifier
 * @returns {boolean} True when a record was removed
 */
const deleteEmployeeById = (id) => {
  const employees = readEmployeesFromDisk();
  const nextEmployees = employees.filter((employee) => employee.id !== id);
  if (nextEmployees.length === employees.length) {
    return false;
  }
  writeEmployeesToDisk(nextEmployees);
  return true;
};

module.exports = {
  findAllEmployees,
  findEmployeeById,
  isEmailTaken,
  createEmployee,
  updateEmployeeById,
  deleteEmployeeById,
};
