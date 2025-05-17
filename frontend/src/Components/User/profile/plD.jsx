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
              src={user.profilePicture || "https://via.placeholder.com/150"} 
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
          {[
            { label: 'Primary Phone', name: 'phone', value: formData.phone, icon: '📱' },
            { label: 'Alternate Phone', name: 'addPhone', value: formData.addPhone, icon: '📞' },
            { label: 'Address', name: 'address', value: formData.address, icon: '🏠' },
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-xl">{item.icon}</span>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">{item.label}</span>
                {isEditing ? (
                  <input
                    type="text"
                    name={item.name}
                    value={item.value}
                    onChange={handleInputChange}
                    className="text-gray-900 font-medium border-b focus:outline-none"
                  />
                ) : (
                  <span className="text-gray-900 font-medium">{item.value}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PersonalDetails;
