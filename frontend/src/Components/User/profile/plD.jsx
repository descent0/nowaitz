import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus, updateUserDetails } from '../../../store/userSlice';

function PersonalDetails() {
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.authUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    addPhone: user.addPhone || '',
    address: user.address,
  });

  const dispatch = useDispatch();
   

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async() => {
    setIsEditing(false);
    await dispatch(updateUserDetails({ id: user._id, userData: formData })).unwrap();
    dispatch(checkAuthStatus());
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden backdrop-blur-lg border border-gray-100">
      <div className="relative h-40 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="absolute -bottom-16 inset-x-0 flex justify-center">
          <div className="w-32 h-32 rounded-full ring-4 ring-white overflow-hidden shadow-xl">
            <img 
              src={user.profilePicture || `https://placehold.co/150x150?text=${user?.name ? user.name.replace(' ', '')[0]?.toUpperCase():'' }&font=bold`} 
              alt={user?.name ? user.name.replace(' ', '')[0]?.toUpperCase() : ''} 
              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
      
      <div className="pt-20 pb-8 px-8">
        <div className="text-center mb-8">
           
            <>
              <h3 aria-disabled className="text-2xl font-bold text-gray-900">{user.name}</h3>
              <p className="text-indigo-600 font-medium">{user.email}</p>
            </>
          
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📱</span>
            <div>
              <div className="text-sm text-gray-500">Primary Phone</div>
              <div className="text-lg font-medium text-gray-900">{formData.phone}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🏠</span>
            <div>
              <div className="text-sm text-gray-500">Address</div>
              <div className="text-lg font-medium text-gray-900">{formData.address}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalDetails;