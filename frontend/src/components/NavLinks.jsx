import React from 'react';
import { Link } from 'react-router-dom';

const NavLinks = ({ role }) => {
  if (role === 'admin') {
    return (
      <>
        <Link 
          to="/admin/dashboard" 
          className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
        >
          Dashboard
        </Link>
        <Link 
          to="/admin/feedback" 
          className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
        >
          Feedback
        </Link>
        <Link 
          to="/admin/registrations" 
          className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
        >
          Registrations
        </Link>
        <Link 
          to="/admin/reminders" 
          className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
        >
          Reminders
        </Link>
      </>
    );
  }

  // Default links for students/normal users
  return (
    <>
      <Link 
        to="/" 
        className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
      >
        Home
      </Link>
      {/* <Link 
        to="/events" 
        className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
      >
        Events
      </Link> */}
      <Link 
        to="/my-registrations" 
        className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
      >
        My Registrations
      </Link>
    </>
  );
};

export default NavLinks;