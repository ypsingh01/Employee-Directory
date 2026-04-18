/**
 * Presents a compact summary of an employee with actions for editing
 * or deleting the record from the directory interface.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

/**
 * Renders a single employee card with responsive layout and hover motion
 * @param {{ employee: Object, onDeleteEmployee: (employee: Object) => void }} props - Component props
 * @returns {JSX.Element}
 */
const EmployeeCard = ({ employee, onDeleteEmployee }) => {
  const navigate = useNavigate();

  /**
   * Navigates to the detail route for the current employee
   * @returns {void}
   */
  const handleEditNavigation = () => {
    navigate(`/employees/${employee.id}`);
  };

  /**
   * Requests deletion after the user confirms intent in the browser dialog
   * @returns {void}
   */
  const handleDeleteClick = () => {
    const confirmed = window.confirm(
      `Delete ${employee.name}? This action cannot be undone.`
    );
    if (!confirmed) {
      return;
    }
    onDeleteEmployee(employee);
  };

  return (
    <article className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-card hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{employee.name}</h3>
            <p className="text-sm text-indigo-700">{employee.role}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
            {employee.department}
          </span>
        </div>
        <dl className="grid gap-2 text-sm text-slate-600">
          <div className="flex items-center justify-between gap-2">
            <dt className="font-medium text-slate-500">Email</dt>
            <dd className="truncate text-right text-slate-800">{employee.email}</dd>
          </div>
          {employee.phone ? (
            <div className="flex items-center justify-between gap-2">
              <dt className="font-medium text-slate-500">Phone</dt>
              <dd className="text-right text-slate-800">{employee.phone}</dd>
            </div>
          ) : null}
        </dl>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleEditNavigation}
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/30 transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleDeleteClick}
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
        >
          Delete
        </button>
      </div>
    </article>
  );
};

EmployeeCard.propTypes = {
  employee: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  onDeleteEmployee: PropTypes.func.isRequired,
};

export default EmployeeCard;
