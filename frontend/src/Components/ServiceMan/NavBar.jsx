import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">Barber Dashboard</Link>
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded">Dashboard</Link>
            <Link to="/services" className="hover:bg-blue-700 px-3 py-2 rounded">My Services</Link>
            <Link to="/schedule" className="hover:bg-blue-700 px-3 py-2 rounded">My Schedule</Link>
            <Link to="/appointments" className="hover:bg-blue-700 px-3 py-2 rounded">Appointments</Link>
            <Link to="/settings" className="hover:bg-blue-700 px-3 py-2 rounded">Settings</Link>
          </div>
          <div className="md:hidden">
            <button className="mobile-menu-button">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
