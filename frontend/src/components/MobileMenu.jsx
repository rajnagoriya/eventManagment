import React from 'react';
import { Link } from 'react-router-dom';

const MobileMenu = ({ role, onClose }) => {
  if (role === 'admin') {
    return (
      <div className="md:hidden" id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/admin/dashboard"
            onClick={onClose}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/feedback"
            onClick={onClose}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >
            Feedback
          </Link>
          <Link
            to="/admin/registrations"
            onClick={onClose}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >
            Registrations
          </Link>
          <Link
            to="/admin/reminders"
            onClick={onClose}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >
            Reminders
          </Link>
        </div>
      </div>
    );
  }

  // Default mobile menu for students/normal users
  return (
    <div className="md:hidden" id="mobile-menu">
      <div className="pt-2 pb-3 space-y-1">
        <Link
          to="/"
          onClick={onClose}
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
        >
          Home
        </Link>
        <Link
          to="/events"
          onClick={onClose}
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
        >
          Events
        </Link>
        <Link
          to="/my-registrations"
          onClick={onClose}
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
        >
          My Registrations
        </Link>
      </div>
    </div>
  );
};

export default MobileMenu;