/**
 * Detail route for reviewing a single employee, editing their profile inline,
 * or removing them from the directory with confirmation and navigation cleanup.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeForm from '../components/EmployeeForm';
import { deleteEmployee, fetchEmployeeById, updateEmployee } from '../services/employeeService';
import { publishNotification } from '../utils/notificationCenter';

/**
 * Detail page component orchestrating fetch, edit, and delete interactions
 * @returns {JSX.Element}
 */
const EmployeeDetailPage = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  /**
   * Retrieves the latest employee record from the API
   * @returns {Promise<void>}
   */
  const loadEmployee = useCallback(async () => {
    if (!employeeId) {
      setLoadError('Missing employee identifier');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setLoadError('');
    try {
      const data = await fetchEmployeeById(employeeId);
      setEmployee(data);
    } catch (error) {
      setLoadError(error.message || 'Unable to load employee');
      setEmployee(null);
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    loadEmployee();
  }, [loadEmployee]);

  /**
   * Persists updated employee fields and refreshes local state
   * @param {Object} values - Validated form payload for the update API
   * @returns {Promise<void>}
   */
  const handleUpdateEmployee = async (values) => {
    try {
      const updated = await updateEmployee(employeeId, values);
      setEmployee(updated);
      publishNotification('Employee updated', 'success');
    } catch (error) {
      publishNotification(error.message || 'Unable to update employee', 'error');
    }
  };

  /**
   * Deletes the active employee after explicit confirmation
   * @returns {Promise<void>}
   */
  const handleDeleteEmployee = async () => {
    const confirmed = window.confirm('Delete this employee permanently?');
    if (!confirmed) {
      return;
    }
    try {
      await deleteEmployee(employeeId);
      publishNotification('Employee deleted', 'success');
      navigate('/');
    } catch (error) {
      publishNotification(error.message || 'Unable to delete employee', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-40 animate-pulse rounded-full bg-slate-200" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (loadError || !employee) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
        <h2 className="text-lg font-semibold text-rose-900">Employee unavailable</h2>
        <p className="mt-2 text-sm text-rose-800">{loadError || 'This record could not be found.'}</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800"
        >
          Back to directory
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Profile</p>
          <h2 className="text-3xl font-semibold text-slate-900">{employee.name}</h2>
          <p className="text-sm text-slate-600">
            {employee.role} · {employee.department}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Back to list
          </button>
          <button
            type="button"
            onClick={handleDeleteEmployee}
            className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
          >
            Delete employee
          </button>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Contact</h3>
          <dl className="mt-4 space-y-3 text-sm text-slate-800">
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">Email</dt>
              <dd className="text-base font-medium">{employee.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">Phone</dt>
              <dd className="text-base font-medium">{employee.phone || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">Created</dt>
              <dd className="text-base font-medium">
                {employee.createdAt ? new Date(employee.createdAt).toLocaleString() : 'Unknown'}
              </dd>
            </div>
          </dl>
        </div>
        <div className="lg:col-span-2">
          <EmployeeForm
            mode="edit"
            initialEmployee={employee}
            onSubmitForm={handleUpdateEmployee}
            onCancel={loadEmployee}
            submitLabel="Save changes"
          />
        </div>
      </section>
    </div>
  );
};

EmployeeDetailPage.propTypes = {};

export default EmployeeDetailPage;
