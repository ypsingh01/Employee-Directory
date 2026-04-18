/**
 * Client-side validation helpers for employee forms ensuring required fields
 * and basic email formatting before requests are sent to the API.
 */

/**
 * Determines whether a trimmed string has any characters
 * @param {string} value - Raw input value from a form control
 * @returns {boolean}
 */
export const isNonEmptyString = (value) => {
  return Boolean(value && String(value).trim().length > 0);
};

/**
 * Validates an email string using a pragmatic pattern check
 * @param {string} email - Email address entered by the user
 * @returns {boolean}
 */
export const isValidEmailFormat = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(String(email || '').trim());
};

/**
 * Validates the employee form payload used for add and edit flows
 * @param {{ name: string, role: string, department: string, email: string, phone?: string }} values - Form values
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export const validateEmployeeFormValues = (values) => {
  const errors = {};
  if (!isNonEmptyString(values.name)) {
    errors.name = 'Full name is required';
  }
  if (!isNonEmptyString(values.role)) {
    errors.role = 'Role is required';
  }
  if (!isNonEmptyString(values.department)) {
    errors.department = 'Department is required';
  }
  if (!isNonEmptyString(values.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmailFormat(values.email)) {
    errors.email = 'Enter a valid email address';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
