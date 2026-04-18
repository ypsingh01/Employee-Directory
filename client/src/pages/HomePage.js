/**
 * Primary directory experience combining search, department filtering,
 * paginated results, add-employee workflows, and list maintenance actions.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import SearchBar from '../components/SearchBar';
import EmployeeList from '../components/EmployeeList';
import EmployeeForm from '../components/EmployeeForm';
import { createEmployee, deleteEmployee, fetchEmployees } from '../services/employeeService';
import { publishNotification } from '../utils/notificationCenter';

const pageSize = 9;

/**
 * Filters employees using a case-insensitive match on name or department
 * @param {Array<Object>} employees - Full employee collection from the API
 * @param {string} query - Debounced search string from the search bar
 * @param {string} departmentFilter - Selected department or the sentinel "all"
 * @returns {Array<Object>} Employees matching both predicates
 */
const filterEmployees = (employees, query, departmentFilter) => {
  const normalizedQuery = query.trim().toLowerCase();
  return employees.filter((employee) => {
    const matchesDepartment =
      departmentFilter === 'all' ? true : employee.department === departmentFilter;
    if (!matchesDepartment) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }
    const name = employee.name.toLowerCase();
    const department = employee.department.toLowerCase();
    return name.includes(normalizedQuery) || department.includes(normalizedQuery);
  });
};

/**
 * Slices a collection for the requested page using a fixed page size
 * @param {Array<Object>} items - Items to paginate after filtering
 * @param {number} currentPage - Active page index starting at 1
 * @returns {Array<Object>} Items belonging to the active page
 */
const slicePage = (items, currentPage) => {
  const startIndex = (currentPage - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
};

/**
 * Home route composing search, filters, add form, and the employee grid
 * @returns {JSX.Element}
 */
const HomePage = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);

  /**
   * Loads all employees from the API and updates local state
   * @returns {Promise<void>}
   */
  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (error) {
      publishNotification(error.message || 'Unable to load employees', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  /**
   * Memoized list of unique departments for the filter dropdown
   */
  const departmentOptions = useMemo(() => {
    const unique = new Set();
    employees.forEach((employee) => {
      if (employee.department) {
        unique.add(employee.department);
      }
    });
    return Array.from(unique).sort((first, second) => first.localeCompare(second));
  }, [employees]);

  /**
   * Employees matching the active search and department selection
   */
  const filteredEmployees = useMemo(() => {
    return filterEmployees(employees, debouncedQuery, departmentFilter);
  }, [employees, debouncedQuery, departmentFilter]);

  /**
   * Total pages given the filtered collection length
   */
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));

  /**
   * Keeps the active page in range when filters or data change
   */
  useEffect(() => {
    setCurrentPage((previous) => {
      if (previous > totalPages) {
        return totalPages;
      }
      if (previous < 1) {
        return 1;
      }
      return previous;
    });
  }, [totalPages]);

  /**
   * Resets pagination when the user changes search or department filters
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, departmentFilter]);

  /**
   * Stable handler forwarded to the debounced search component
   * @param {string} nextQuery - Latest debounced query string
   * @returns {void}
   */
  const handleDebouncedSearch = useCallback((nextQuery) => {
    setDebouncedQuery(nextQuery);
  }, []);

  /**
   * Persists a new employee then refreshes the grid
   * @param {Object} values - Validated form values ready for the API
   * @returns {Promise<void>}
   */
  const handleCreateEmployee = async (values) => {
    try {
      await createEmployee(values);
      publishNotification('Employee added successfully', 'success');
      await loadEmployees();
      setIsAddFormVisible(false);
    } catch (error) {
      publishNotification(error.message || 'Unable to add employee', 'error');
    }
  };

  /**
   * Deletes an employee after confirmation from the card component
   * @param {Object} employee - Employee targeted for deletion
   * @returns {Promise<void>}
   */
  const handleDeleteEmployee = async (employee) => {
    try {
      await deleteEmployee(employee.id);
      publishNotification('Employee deleted', 'success');
      await loadEmployees();
    } catch (error) {
      publishNotification(error.message || 'Unable to delete employee', 'error');
    }
  };

  const pagedEmployees = slicePage(filteredEmployees, currentPage);
  const emptyDataset = !isLoading && employees.length === 0;
  const emptyFilter =
    !isLoading && employees.length > 0 && filteredEmployees.length === 0;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full flex-1">
            <SearchBar onDebouncedChange={handleDebouncedSearch} />
          </div>
          <div className="w-full max-w-xs">
            <label className="flex w-full flex-col gap-2">
              <span className="text-sm font-semibold text-slate-800">Department</span>
              <select
                value={departmentFilter}
                onChange={(event) => setDepartmentFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="all">All departments</option>
                {departmentOptions.map((departmentName) => (
                  <option key={departmentName} value={departmentName}>
                    {departmentName}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Team roster</h2>
            <p className="text-sm text-slate-600">
              Showing {pagedEmployees.length} of {filteredEmployees.length} matching employees.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddFormVisible((previous) => !previous)}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            {isAddFormVisible ? 'Hide add form' : 'Add employee'}
          </button>
        </div>

        {isAddFormVisible ? (
          <EmployeeForm
            mode="add"
            onSubmitForm={handleCreateEmployee}
            onCancel={() => setIsAddFormVisible(false)}
            submitLabel="Create employee"
          />
        ) : null}
      </section>

      <EmployeeList
        employees={pagedEmployees}
        isLoading={isLoading}
        emptyDataset={emptyDataset}
        emptyFilter={emptyFilter}
        onDeleteEmployee={handleDeleteEmployee}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

HomePage.propTypes = {};

export default HomePage;
