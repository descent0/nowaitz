import React from 'react';
import PersonalDetails from './plD';
import BookingHistory from './BookingHistory';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Nav from '../../Nav';


const mockBookings = [
  { id: 1, date: "2023-06-15", service: "Haircut", price: "$30", status: "completed" },
  { id: 2, date: "2023-07-02", service: "Massage", price: "$60", status: "upcoming" },
  { id: 3, date: "2023-07-20", service: "Manicure", price: "$25", status: "cancelled" },
  { id: 4, date: "2023-08-01", service: "Beard Trim", price: "$20", status: "upcoming" },
];

function Profile() {
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.authUser);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col space-y-8">
          <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, {user?.name?.split(' ')[0]}
              </h1>
              <p className="text-gray-500 mt-1">Manage your profile and bookings</p>
            </div>
           
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <PersonalDetails />
            </div>
            <div className="lg:col-span-2">
              <BookingHistory bookings={mockBookings} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

