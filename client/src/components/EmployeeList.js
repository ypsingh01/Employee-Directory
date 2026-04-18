/**
 * Displays a responsive grid of employee cards with loading, empty, and
 * pagination controls coordinated by the Home page container component.
 */

import React from 'react';
import PropTypes from 'prop-types';
import EmployeeCard from './EmployeeCard';

/**
 * Renders pagination controls when more than one page exists
 * @param {{ currentPage: number, totalPages: number, onPageChange: (page: number) => void }} props - Pagination props
 * @returns {JSX.Element|null}
 */
const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  /**
   * Moves backward one page when not already on the first page
   * @returns {void}
   */
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  /**
   * Advances one page when not already on the last page
   * @returns {void}
   */
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row">
      <p className="text-sm text-slate-600">
        Page <span className="font-semibold text-slate-900">{currentPage}</span> of{' '}
        <span className="font-semibold text-slate-900">{totalPages}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition enabled:hover:border-slate-300 enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition enabled:hover:border-slate-300 enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

PaginationControls.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

/**
 * Renders the employee grid or appropriate placeholder states
 * @param {{
 *  employees: Array<Object>,
 *  isLoading: boolean,
 *  emptyDataset: boolean,
 *  emptyFilter: boolean,
 *  onDeleteEmployee: (employee: Object) => void,
 *  currentPage: number,
 *  totalPages: number,
 *  onPageChange: (page: number) => void
 * }} props - Component props
 * @returns {JSX.Element}
 */
const EmployeeList = ({
  employees,
  isLoading,
  emptyDataset,
  emptyFilter,
  onDeleteEmployee,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`skeleton-${String(index)}`}
            className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 via-white to-slate-100"
          />
        ))}
      </div>
    );
  }

  if (emptyDataset) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-inner">
        <h3 className="text-lg font-semibold text-slate-900">No employees yet</h3>
        <p className="mt-2 text-sm text-slate-600">
          Add your first teammate using the form above to populate the directory.
        </p>
      </div>
    );
  }

  if (emptyFilter) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">No matches found</h3>
        <p className="mt-2 text-sm text-slate-600">
          Try a different search phrase or reset the department filter to see more results.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {employees.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} onDeleteEmployee={onDeleteEmployee} />
        ))}
      </div>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

EmployeeList.propTypes = {
  employees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      department: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string,
      createdAt: PropTypes.string,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  emptyDataset: PropTypes.bool.isRequired,
  emptyFilter: PropTypes.bool.isRequired,
  onDeleteEmployee: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default EmployeeList;
