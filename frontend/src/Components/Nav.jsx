import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loading from "./loading";
import { logoutUser } from "../store/userSlice";
import { registerShop } from "./../store/shopSlice";

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, loading } = useSelector((state) => state.authUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuRef = useRef(null);
  const profileRef = useRef(null);

  const handleUserLogout = async (e) => {
    e.preventDefault();
    try {
      dispatch(logoutUser());
      navigate("/login", { replace: true });
    } catch (error) {
      console.log("Error calling server:", error);
    }
  };

  const handleClickOutside = (e) => {
    if (
      menuRef.current && !menuRef.current.contains(e.target) &&
      profileRef.current && !profileRef.current.contains(e.target)
    ) {
      setIsMenuOpen(false);
      setIsProfileOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <Loading />;

  const startingLetter = user?.name ? user.name.replace(" ", "")[0]?.toUpperCase() : "";

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-800"> <img src="logo.png" alt="noWaitz" className="h-20 w-auto" /></span>
            </Link>
          </div>
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <div className="relative" ref={profileRef}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full flex justify-center items-center text-sm font-medium bg-blue-600 text-white">
                  {startingLetter}
                </div>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Your Profile
                  </Link>
                  <button onClick={handleUserLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign out
                  </button>
                  <Link to="/registerShop" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Register your shop now
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="sm:hidden flex items-center" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600 hover:text-blue-600">
              ☰
            </button>
          </div>
        </div>
      </div>
      <div className={`${isMenuOpen ? "block" : "hidden"} sm:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
            Home
          </Link>
          <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
            Profile
          </Link>
          <button onClick={handleUserLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Sign out
          </button>
          <Link to="/registerShop" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Register your shop now
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;

