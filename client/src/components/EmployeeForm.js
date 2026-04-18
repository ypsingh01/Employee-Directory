/**
 * Controlled employee form supporting add and edit modes with validation,
 * cancel handling, and submission callbacks for parent pages to refresh data.
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { validateEmployeeFormValues } from '../utils/validators';

/**
 * Builds initial form state for add mode using empty strings
 * @returns {{ name: string, role: string, department: string, email: string, phone: string }}
 */
const buildEmptyFormState = () => ({
  name: '',
  role: '',
  department: '',
  email: '',
  phone: '',
});

/**
 * Maps an employee record into editable form fields
 * @param {Object} employee - Employee returned from the API
 * @returns {{ name: string, role: string, department: string, email: string, phone: string }}
 */
const mapEmployeeToFormState = (employee) => ({
  name: employee.name || '',
  role: employee.role || '',
  department: employee.department || '',
  email: employee.email || '',
  phone: employee.phone || '',
});

/**
 * Employee create/edit form with validation messaging and action buttons
 * @param {{
 *  mode: 'add'|'edit',
 *  initialEmployee?: Object,
 *  onSubmitForm: (values: Object) => Promise<void>,
 *  onCancel?: () => void,
 *  submitLabel?: string
 * }} props - Component props
 * @returns {JSX.Element}
 */
const EmployeeForm = ({ mode, initialEmployee, onSubmitForm, onCancel, submitLabel }) => {
  const [formValues, setFormValues] = useState(buildEmptyFormState());
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && initialEmployee) {
      setFormValues(mapEmployeeToFormState(initialEmployee));
    }
    if (mode === 'add') {
      setFormValues(buildEmptyFormState());
    }
  }, [mode, initialEmployee]);

  /**
   * Updates a single field while clearing any prior validation error for it
   * @param {string} fieldName - Name of the field being updated
   * @param {string} value - Next value from the input control
   * @returns {void}
   */
  const handleFieldChange = (fieldName, value) => {
    setFormValues((previous) => ({
      ...previous,
      [fieldName]: value,
    }));
    setFieldErrors((previous) => {
      if (!previous[fieldName]) {
        return previous;
      }
      const next = { ...previous };
      delete next[fieldName];
      return next;
    });
  };

  /**
   * Validates and submits the form through the parent-provided handler
   * @param {Event} event - DOM submit event from the form element
   * @returns {Promise<void>}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateEmployeeFormValues(formValues);
    if (!validation.valid) {
      setFieldErrors(validation.errors);
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmitForm({
        name: formValues.name.trim(),
        role: formValues.role.trim(),
        department: formValues.department.trim(),
        email: formValues.email.trim(),
        phone: formValues.phone.trim(),
      });
      if (mode === 'add') {
        setFormValues(buildEmptyFormState());
      }
      setFieldErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Clears add-mode fields or invokes the cancel callback for edit flows
   * @returns {void}
   */
  const handleCancelClick = () => {
    if (mode === 'edit' && initialEmployee) {
      setFormValues(mapEmployeeToFormState(initialEmployee));
    } else {
      setFormValues(buildEmptyFormState());
    }
    setFieldErrors({});
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-3xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-900">
          {mode === 'add' ? 'Add a new employee' : 'Update employee details'}
        </h2>
        <p className="text-sm text-slate-600">
          Fields marked as required must be completed before saving changes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-800 md:col-span-2">
          Full name *
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={(event) => handleFieldChange('name', event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal text-slate-900 shadow-inner outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          {fieldErrors.name ? <span className="text-xs font-semibold text-rose-600">{fieldErrors.name}</span> : null}
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-800">
          Role *
          <input
            type="text"
            name="role"
            value={formValues.role}
            onChange={(event) => handleFieldChange('role', event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal text-slate-900 shadow-inner outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          {fieldErrors.role ? <span className="text-xs font-semibold text-rose-600">{fieldErrors.role}</span> : null}
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-800">
          Department *
          <input
            type="text"
            name="department"
            value={formValues.department}
            onChange={(event) => handleFieldChange('department', event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal text-slate-900 shadow-inner outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          {fieldErrors.department ? (
            <span className="text-xs font-semibold text-rose-600">{fieldErrors.department}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-800 md:col-span-2">
          Email *
          <input
            type="email"
            name="email"
            value={formValues.email}
            onChange={(event) => handleFieldChange('email', event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal text-slate-900 shadow-inner outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          {fieldErrors.email ? (
            <span className="text-xs font-semibold text-rose-600">{fieldErrors.email}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-800 md:col-span-2">
          Phone (optional)
          <input
            type="tel"
            name="phone"
            value={formValues.phone}
            onChange={(event) => handleFieldChange('phone', event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal text-slate-900 shadow-inner outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleCancelClick}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/30 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
};

EmployeeForm.propTypes = {
  mode: PropTypes.oneOf(['add', 'edit']).isRequired,
  initialEmployee: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    createdAt: PropTypes.string,
  }),
  onSubmitForm: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  submitLabel: PropTypes.string,
};

EmployeeForm.defaultProps = {
  initialEmployee: null,
  onCancel: undefined,
  submitLabel: 'Save employee',
};

export default EmployeeForm;
