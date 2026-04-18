/**
 * Search input component debouncing user text so parent components can filter
 * large employee lists without recomputing on every keystroke.
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Mirrors a value but updates only after the delay elapses without changes
 * @param {string} value - Live input value from the text field
 * @param {number} delayMilliseconds - Debounce duration in milliseconds
 * @returns {string} Debounced value suitable for filtering operations
 */
const useDebouncedValue = (value, delayMilliseconds) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMilliseconds);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [value, delayMilliseconds]);

  return debouncedValue;
};

/**
 * Renders a labeled search field with debounced change notifications
 * @param {{ onDebouncedChange: (query: string) => void, placeholder?: string, label?: string }} props - Component props
 * @returns {JSX.Element}
 */
const SearchBar = ({ onDebouncedChange, placeholder, label }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    onDebouncedChange(debouncedQuery);
  }, [debouncedQuery, onDebouncedChange]);

  return (
    <label className="flex w-full flex-col gap-2">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.65" y1="16.65" x2="21" y2="21" />
          </svg>
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      <p className="text-xs text-slate-500">Results update shortly after you pause typing.</p>
    </label>
  );
};

SearchBar.propTypes = {
  onDebouncedChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
};

SearchBar.defaultProps = {
  placeholder: 'Search by name or department',
  label: 'Search',
};

export default SearchBar;
