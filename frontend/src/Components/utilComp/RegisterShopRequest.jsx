import React, { useState } from 'react';
import { registerShop } from '../../store/shopSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RegisterShopForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contact: {
      phone: '',
      email: ''
    },
    operatingHours: {
      weekdays: '',
      weekends: ''
    },
    category: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      website: ''
    },
    images: [],
    locationCoordinates: {
      latitude: '',
      longitude: ''
    },
    emergencyContact: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: files
    }));
  };

  const validateForm = () => {
    const requiredFields = {
      'name': 'Shop Name',
      'location': 'Location',
      'contact.phone': 'Phone Number',
      'contact.email': 'Email',
      'operatingHours.weekdays': 'Weekday Hours',
      'operatingHours.weekends': 'Weekend Hours',
      'category': 'Category',
      'locationCoordinates.latitude': 'Latitude',
      'locationCoordinates.longitude': 'Longitude',
      'password': 'Password'
    };

    // Validate required fields
    for (const [field, label] of Object.entries(requiredFields)) {
      const [parent, child] = field.split('.');
      if (child) {
        if (!formData[parent][child]) {
          return `${label} is required.`;
        }
      } else {
        if (!formData[field]) {
          return `${label} is required.`;
        }
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contact.email)) {
      return "Please enter a valid email address.";
    }

    // Validate phone number format
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.contact.phone)) {
      return "Please enter a valid 10-digit phone number.";
    }

    // Validate coordinates
    const lat = parseFloat(formData.locationCoordinates.latitude);
    const lng = parseFloat(formData.locationCoordinates.longitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      return "Please enter a valid latitude (-90 to 90).";
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      return "Please enter a valid longitude (-180 to 180).";
    }

    // Validate password strength
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters long.";
    }

    if (confirmPass !== formData.password) {
      return "Passwords do not match.";
    }

    return null;
  };

  const prepareFormData = () => {
    const data = new FormData();
    
    // Append basic fields
    data.append('name', formData.name);
    data.append('location', formData.location);
    data.append('category', formData.category);
    data.append('password', formData.password);
    data.append('emergencyContact', formData.emergencyContact || '');
    
    // Append nested objects as JSON strings
    data.append('contact', JSON.stringify(formData.contact));
    data.append('operatingHours', JSON.stringify(formData.operatingHours));
    data.append('locationCoordinates', JSON.stringify({
      latitude: parseFloat(formData.locationCoordinates.latitude),
      longitude: parseFloat(formData.locationCoordinates.longitude)
    }));
    data.append('socialMedia', JSON.stringify(formData.socialMedia));
    
    // Append files
    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((file, index) => {
        data.append(`images`, file);
      });
    }

    // Log the FormData contents for debugging
    for (let pair of data.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formDataToSubmit = prepareFormData();
      const res = await dispatch(registerShop(formDataToSubmit)).unwrap();
      console.log('Response:', res);
      if (res.error) {
        throw new Error(res.error.message || 'Registration failed');
      }
        alert('Shop registered successfully! You can login once verified, We will notify you via email once approved.');
      setTimeout(()=>{
navigate('/', { replace: true });
      }, 2000);
        
      // Reset form on success
      setFormData({
        name: '',
        location: '',
        contact: { phone: '', email: '' },
        // ... reset other fields
      });
      setConfirmPass('');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Register Your Service Shop</h2>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Shop Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="contact.phone"
                required
                value={formData.contact.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="contact.email"
                required
                value={formData.contact.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Operating Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Weekdays</label>
              <input
                type="text"
                name="operatingHours.weekdays"
                required
                placeholder="e.g., 9:00 AM - 6:00 PM"
                value={formData.operatingHours.weekdays}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Weekends</label>
              <input
                type="text"
                name="operatingHours.weekends"
                required
                placeholder="e.g., 10:00 AM - 4:00 PM"
                value={formData.operatingHours.weekends}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Location Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Latitude</label>
              <input
                type="number"
                name="locationCoordinates.latitude"
                required
                step="any"
                value={formData.locationCoordinates.latitude}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Longitude</label>
              <input
                type="number"
                name="locationCoordinates.longitude"
                required
                step="any"
                value={formData.locationCoordinates.longitude}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Social Media (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Facebook</label>
              <input
                type="url"
                name="socialMedia.facebook"
                value={formData.socialMedia.facebook}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Instagram</label>
              <input
                type="url"
                name="socialMedia.instagram"
                value={formData.socialMedia.instagram}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Twitter</label>
              <input
                type="url"
                name="socialMedia.twitter"
                value={formData.socialMedia.twitter}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <input
                type="url"
                name="socialMedia.website"
                value={formData.socialMedia.website}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Upload Images */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Upload Images</h3>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleImageChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            name="Confirm Password"
            required
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Registering...' : 'Register Shop'}
        </button>
      </form>
    </div>
  );
};

export default RegisterShopForm;