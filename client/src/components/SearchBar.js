/**
 * Search panel that stays hidden until the user opens it, then filters only
 * after they click Search (or press Enter) with an optional clear action.
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Renders the expanded search controls with apply, clear, and close actions
 * @param {{
 *  committedQuery: string,
 *  onApplySearch: (query: string) => void,
 *  onClosePanel: () => void,
 *  placeholder?: string,
 *  label?: string
 * }} props - Component props
 * @returns {JSX.Element}
 */
const SearchBar = ({ committedQuery, onApplySearch, onClosePanel, placeholder, label }) => {
  const [draftQuery, setDraftQuery] = useState(committedQuery);

  useEffect(() => {
    setDraftQuery(committedQuery);
  }, [committedQuery]);

  /**
   * Applies the current draft text as the active directory search query
   * @returns {void}
   */
  const handleApplySearch = () => {
    onApplySearch(draftQuery.trim());
  };

  /**
   * Clears the draft and applies an empty query so the full list shows again
   * @returns {void}
   */
  const handleClearSearch = () => {
    setDraftQuery('');
    onApplySearch('');
  };

  /**
   * Submits the search when the user presses Enter inside the field
   * @param {React.KeyboardEvent<HTMLInputElement>} event - Keyboard event from the input
   * @returns {void}
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleApplySearch();
    }
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <label className="flex min-w-0 flex-1 flex-col gap-2">
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
              value={draftQuery}
              onChange={(event) => setDraftQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </label>
        <div className="flex flex-wrap gap-2 sm:pb-0.5">
          <button
            type="button"
            onClick={handleApplySearch}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-500/30 transition hover:bg-indigo-700 sm:flex-none"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleClearSearch}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 sm:flex-none"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onClosePanel}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 sm:flex-none"
          >
            Close
          </button>
        </div>
      </div>
      <p className="text-xs text-slate-500">
        Type a name or department, then click Search or press Enter. Matching is not case-sensitive.
      </p>
    </div>
  );
};

SearchBar.propTypes = {
  committedQuery: PropTypes.string.isRequired,
  onApplySearch: PropTypes.func.isRequired,
  onClosePanel: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
};

SearchBar.defaultProps = {
  placeholder: 'Search by name or department',
  label: 'Search directory',
};

export default SearchBar;
