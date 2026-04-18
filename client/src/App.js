/**
 * Top-level React component configuring client-side routing, a lightweight
 * toast region, and the page-level layout wrapper for the Employee Directory.
 */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import { subscribeToNotifications } from './utils/notificationCenter';

/**
 * Renders a dismissible toast message anchored to the viewport corner
 * @param {{ message: string, variant: 'success'|'error'|'info', onDismiss: () => void }} props - Toast display props
 * @returns {JSX.Element}
 */
const ToastMessage = ({ message, variant, onDismiss }) => {
  const palette =
    variant === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : variant === 'error'
        ? 'border-rose-200 bg-rose-50 text-rose-900'
        : 'border-slate-200 bg-white text-slate-900';

  return (
    <div
      className={`pointer-events-auto w-full max-w-sm rounded-xl border px-4 py-3 shadow-lg ${palette} animate-fade-in`}
      role="status"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm leading-snug">{message}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-md px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-black/5"
        >
          Close
        </button>
      </div>
    </div>
  );
};

ToastMessage.propTypes = {
  message: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['success', 'error', 'info']).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

/**
 * Application shell with navigation, routed pages, and toast subscription wiring
 * @returns {JSX.Element}
 */
const App = () => {
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeToNotifications((payload) => {
      setToast(payload);
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
      toastTimeoutRef.current = window.setTimeout(() => {
        setToast(null);
      }, 4500);
    });
    return () => {
      unsubscribe();
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Directory
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">Employee Directory</h1>
              <p className="text-sm text-slate-600">
                Search, add, and keep employee records up to date.
              </p>
            </div>
            <nav className="flex items-center gap-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`
                }
                end
              >
                Home
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/employees/:employeeId" element={<EmployeeDetailPage />} />
          </Routes>
        </main>

        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
          {toast ? (
            <ToastMessage
              message={toast.message}
              variant={toast.variant}
              onDismiss={() => setToast(null)}
            />
          ) : null}
        </div>
      </div>
    </BrowserRouter>
  );
};

App.propTypes = {};

export default App;
