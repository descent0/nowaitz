import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkShop, updateShopInfo } from '../../store/shopSlice';
import InteractiveMap from '../utilComp/InteractiveMap';

const ShopLook = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const shopDetails = useSelector((state) => state.shop.shop);
  const { loading, error } = useSelector((state) => state.shop);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    shopID: '',
    name: '',
    location: '',
    contact: {
      phone: '',
      email: '',
    },
    operatingHours: {
      weekdays: '',
      weekends: '',
    },
    category: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      website: '',
    },
    images: [],
    status: '',
    locationCoordinates: {
      latitude: '',
      longitude: '',
    },
    emergencyContact: '',
  });

  useEffect(() => {
    dispatch(checkShop());
  }, [dispatch]);

  useEffect(() => {
    if (shopDetails) {
      setFormData({
        shopID: shopDetails.shopID || '',
        name: shopDetails.name || '',
        location: shopDetails.location || '',
        contact: {
          phone: shopDetails.contact?.phone || '',
          email: shopDetails.contact?.email || '',
        },
        operatingHours: {
          weekdays: shopDetails.operatingHours?.weekdays || '',
          weekends: shopDetails.operatingHours?.weekends || '',
        },
        category: shopDetails.category || '',
        socialMedia: {
          facebook: shopDetails.socialMedia?.facebook || '',
          instagram: shopDetails.socialMedia?.instagram || '',
          twitter: shopDetails.socialMedia?.twitter || '',
          website: shopDetails.socialMedia?.website || '',
        },
        images: shopDetails.images || [],
        status: shopDetails.status || '',
        locationCoordinates: {
          latitude: shopDetails.locationCoordinates?.latitude || '',
          longitude: shopDetails.locationCoordinates?.longitude || '',
        },
        emergencyContact: shopDetails.emergencyContact || '',
      });
    }
  }, [shopDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedInputChange = (e, parentKey) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [name]: value,
      },
    }));
  };

  const handleLocationChange = (newCoordinates) => {
    setFormData((prev) => ({
      ...prev,
      locationCoordinates: newCoordinates
    }));
  };

  const handleSaveChanges = async () => {
    await dispatch(updateShopInfo(formData));
    // Refresh shop data after update to immediately reflect changes
    dispatch(checkShop());
    setEditMode(false);
  };

  const handleBackToYourShop = () => {
    navigate('/yourshop');
  };

  // Simple location display component to avoid DOM manipulation issues
  const LocationDisplay = ({ lat, lng }) => (
    <div className="bg-blue-100 rounded-md h-48 flex items-center justify-center relative overflow-hidden">
      <div className="absolute w-4 h-4 bg-red-500 rounded-full transform -translate-x-2 -translate-y-2" style={{ left: '50%', top: '50%' }}></div>
      <div className="bg-white px-2 py-1 rounded text-xs absolute bottom-2 left-2 shadow-sm">
        {lat}, {lng}
      </div>
      <p className="text-blue-800 text-xs bg-white px-2 py-1 rounded absolute top-2 right-2 shadow-sm">Map View</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center">
      {/* Top Banner */}
      <div className="w-full bg-blue-800 text-white text-center py-6 shadow-md">
        <h1 className="text-4xl font-semibold">Shop Management</h1>
      </div>

      {/* Main Content */}
      <div className="flex w-full max-w-7xl mt-8 px-4 pb-8">
        {/* Main Shop Content - Styled as a shop frame */}
        <div className="flex-1 bg-white shadow-lg rounded-lg overflow-hidden border-2 border-blue-300">
          {/* Shop Header */}
          <div className="bg-blue-700 text-white p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{editMode ? "Edit Shop Details" : shopDetails?.name || "Shop Details"}</h2>
              <button
                onClick={handleBackToYourShop}
                className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Shop Storefront Design */}
          <div className="p-6">
            {loading && (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Shop Details */}
                <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  {editMode ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-blue-800 font-medium">Shop ID</span>
                        <input
                          type="text"
                          name="shopID"
                          value={formData.shopID}
                          disabled
                          className="mt-1 block w-full bg-blue-100 border-blue-300 rounded-md shadow-sm p-2"
                        />
                      </label>
                      <label className="block">
                        <span className="text-blue-800 font-medium">Name</span>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-blue-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </label>
                      <label className="block">
                        <span className="text-blue-800 font-medium">Location</span>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-blue-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </label>
                      <label className="block">
                        <span className="text-blue-800 font-medium">Phone</span>
                        <input
                          type="text"
                          name="phone"
                          value={formData.contact.phone}
                          onChange={(e) => handleNestedInputChange(e, 'contact')}
                          className="mt-1 block w-full border-blue-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </label>
                      <label className="block">
                        <span className="text-blue-800 font-medium">Email</span>
                        <input
                          type="email"
                          name="email"
                          value={formData.contact.email}
                          onChange={(e) => handleNestedInputChange(e, 'contact')}
                          className="mt-1 block w-full border-blue-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </label>
                      <label className="block">
                        <span className="text-blue-800 font-medium">Weekday Hours</span>
                        <input
                          type="text"
                          name="weekdays"
                          value={formData.operatingHours.weekdays}
                          onChange={(e) => handleNestedInputChange(e, 'operatingHours')}
                          className="mt-1 block w-full border-blue-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </label>
                      <label className="block">
                        <span className="text-blue-800 font-medium">Weekend Hours</span>
                        <input
                          type="text"
                          name="weekends"
                          value={formData.operatingHours.weekends}
                          onChange={(e) => handleNestedInputChange(e, 'operatingHours')}
                          className="mt-1 block w-full border-blue-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </label>
                      <label className="block">
                        <span className="text-blue-800 font-medium">Category</span>
                        <p className="mt-1 block w-full bg-blue-100 border-blue-300 rounded-md shadow-sm p-2">
                          {formData.category}
                        </p>
                      </label>
                      <label className="block">
                        <span className="text-blue-800 font-medium">Emergency Contact</span>
                        <input
                          type="text"
                          name="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-blue-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-200">
                        <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-2">Basic Information</h3>
                        <p><span className="font-medium text-blue-700">Shop ID:</span> {shopDetails?.shopID}</p>
                        <p><span className="font-medium text-blue-700">Name:</span> {shopDetails?.name}</p>
                        <p><span className="font-medium text-blue-700">Category:</span> {shopDetails?.category}</p>
                        <p><span className="font-medium text-blue-700">Location:</span> {shopDetails?.location}</p>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-200">
                        <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-2">Contact Details</h3>
                        <p><span className="font-medium text-blue-700">Phone:</span> {shopDetails?.contact?.phone}</p>
                        <p><span className="font-medium text-blue-700">Email:</span> {shopDetails?.contact?.email}</p>
                        <p><span className="font-medium text-blue-700">Emergency Contact:</span> {shopDetails?.emergencyContact}</p>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-200">
                        <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-2">Operating Hours</h3>
                        <p><span className="font-medium text-blue-700">Weekdays:</span> {shopDetails?.operatingHours?.weekdays}</p>
                        <p><span className="font-medium text-blue-700">Weekends:</span> {shopDetails?.operatingHours?.weekends}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Social Media and Location */}
                <div className="md:col-span-1">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                    <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-2">Social Media</h3>
                    {editMode ? (
                      <div className="space-y-2">
                        <label className="block">
                          <span className="text-blue-800 font-medium">Facebook</span>
                          <input
                            type="text"
                            name="facebook"
                            value={formData.socialMedia.facebook}
                            onChange={(e) => handleNestedInputChange(e, 'socialMedia')}
                            className="mt-1 block w-full border-blue-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </label>
                        <label className="block">
                          <span className="text-blue-800 font-medium">Instagram</span>
                          <input
                            type="text"
                            name="instagram"
                            value={formData.socialMedia.instagram}
                            onChange={(e) => handleNestedInputChange(e, 'socialMedia')}
                            className="mt-1 block w-full border-blue-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </label>
                      </div>
                    ) : (
                      <div>
                        <p><span className="font-medium text-blue-700">Facebook:</span> {shopDetails?.socialMedia?.facebook}</p>
                        <p><span className="font-medium text-blue-700">Instagram:</span> {shopDetails?.socialMedia?.instagram}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-2">Map Location</h3>
                    
                    {/* Modified location section to have the location & coordinates together */}
                    <div className="space-y-4">
                      {/* Address & Coordinates */}
                      <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-200">
                        <h4 className="text-md font-medium text-blue-700 mb-2">Address & Coordinates</h4>
                        
                        {editMode ? (
                          <div className="grid grid-cols-1 gap-2">
                            <label className="block">
                              <span className="text-blue-800 text-sm">Address</span>
                              <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border-blue-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter shop address"
                              />
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <label className="block">
                                <span className="text-blue-800 text-sm">Latitude</span>
                                <input
                                  type="text"
                                  name="latitude"
                                  value={formData.locationCoordinates.latitude}
                                  onChange={(e) => handleNestedInputChange(e, 'locationCoordinates')}
                                  className="mt-1 block w-full border-blue-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                              </label>
                              <label className="block">
                                <span className="text-blue-800 text-sm">Longitude</span>
                                <input
                                  type="text"
                                  name="longitude"
                                  value={formData.locationCoordinates.longitude}
                                  onChange={(e) => handleNestedInputChange(e, 'locationCoordinates')}
                                  className="mt-1 block w-full border-blue-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p><span className="font-medium text-blue-700">Address:</span> {shopDetails?.location}</p>
                            <div className="flex flex-wrap gap-x-4 mt-1">
                              <p><span className="font-medium text-blue-700">Latitude:</span> {shopDetails?.locationCoordinates?.latitude}</p>
                              <p><span className="font-medium text-blue-700">Longitude:</span> {shopDetails?.locationCoordinates?.longitude}</p>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Map Component - Conditionally rendered based on mode */}
                      {editMode ? (
                        <div key={`map-edit-${formData.locationCoordinates.latitude}-${formData.locationCoordinates.longitude}`}>
                          <InteractiveMap 
                            latitude={formData.locationCoordinates.latitude} 
                            longitude={formData.locationCoordinates.longitude}
                            onLocationChange={handleLocationChange}
                          />
                        </div>
                      ) : (
                        shopDetails?.locationCoordinates?.latitude && shopDetails?.locationCoordinates?.longitude && (
                          <LocationDisplay 
                            lat={shopDetails.locationCoordinates.latitude} 
                            lng={shopDetails.locationCoordinates.longitude} 
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-end mt-6 space-x-4">
              {editMode ? (
                <>
                  <button
                    onClick={handleSaveChanges}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200 shadow-md"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md"
                >
                  Edit Shop Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopLook;