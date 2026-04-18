/**
 * HTTP client helpers for employee CRUD operations against the Express API,
 * centralizing fetch configuration and response parsing logic.
 */

/**
 * Resolves the API base URL from environment configuration with a safe default
 * @returns {string}
 */
const getApiBaseUrl = () => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
  return baseUrl.replace(/\/$/, '');
};

/**
 * Parses JSON responses and throws descriptive errors for non-OK statuses
 * @param {Response} response - Fetch API response object
 * @returns {Promise<any>}
 */
const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || 'Request failed');
    error.details = payload.details;
    throw error;
  }
  return payload;
};

/**
 * Fetches every employee record from the backend
 * @returns {Promise<Array>} Array of employee objects returned by the API
 */
export const fetchEmployees = async () => {
  const response = await fetch(`${getApiBaseUrl()}/api/employees`);
  const payload = await parseResponse(response);
  return payload.data;
};

/**
 * Fetches a single employee by identifier
 * @param {string} employeeId - Employee identifier from the URL or selection
 * @returns {Promise<Object>} Employee object returned by the API
 */
export const fetchEmployeeById = async (employeeId) => {
  const response = await fetch(`${getApiBaseUrl()}/api/employees/${employeeId}`);
  const payload = await parseResponse(response);
  return payload.data;
};

/**
 * Creates a new employee record on the server
 * @param {{ name: string, role: string, department: string, email: string, phone?: string }} employeeInput - Fields required by the API
 * @returns {Promise<Object>} Newly created employee including generated identifiers
 */
export const createEmployee = async (employeeInput) => {
  const response = await fetch(`${getApiBaseUrl()}/api/employees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(employeeInput),
  });
  const payload = await parseResponse(response);
  return payload.data;
};

/**
 * Updates an existing employee record on the server
 * @param {string} employeeId - Identifier of the employee being updated
 * @param {{ name: string, role: string, department: string, email: string, phone?: string }} employeeInput - Fields to persist
 * @returns {Promise<Object>} Updated employee returned by the API
 */
export const updateEmployee = async (employeeId, employeeInput) => {
  const response = await fetch(`${getApiBaseUrl()}/api/employees/${employeeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(employeeInput),
  });
  const payload = await parseResponse(response);
  return payload.data;
};

/**
 * Deletes an employee record on the server
 * @param {string} employeeId - Identifier of the employee to remove
 * @returns {Promise<void>}
 */
export const deleteEmployee = async (employeeId) => {
  const response = await fetch(`${getApiBaseUrl()}/api/employees/${employeeId}`, {
    method: 'DELETE',
  });
  await parseResponse(response);
};
