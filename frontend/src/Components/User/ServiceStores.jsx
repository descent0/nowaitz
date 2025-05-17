import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ServiceCards from "./ServiceCards";
import { useDispatch, useSelector } from "react-redux";
import { getAllShopByCategory } from "../../store/shopSlice";
import ShopCardForUser from "../utilComp/ShopCardForUser";

const ServiceStores = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [sortedServices, setSortedServices] = useState([]);
  const [locationError, setLocationError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const category = useParams();
  const dispatch = useDispatch();
  
  // Get all shops from the category
  useEffect(() => {
    dispatch(getAllShopByCategory(category.serviceType));
    setIsLoading(true);
  }, [dispatch, category.serviceType]);
  
  const services = useSelector((state) => state.shop.shops);
  
  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError(error.message);
          setIsLoading(false);
          // Still sort services even without location
          setSortedServices(services);
        },
        { timeout: 10000 } // 10-second timeout
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      setIsLoading(false);
      // Still sort services even without location
      setSortedServices(services);
    }
  }, []);
  
  // Update sorted services when services change (e.g., after initial load)
  useEffect(() => {
    if (services.length > 0) {
      if (userLocation) {
        // Sort by distance if we have location
        sortServicesByDistance();
      } else {
        // Otherwise just use the services as is
        setSortedServices([...services]);
        setIsLoading(false);
      }
    }
  }, [services]);
  
  // Calculate distance between two coordinates in kilometers using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  };
  
  // Sort services by distance
  const sortServicesByDistance = () => {
    if (!userLocation || services.length === 0) return;
    
    const servicesWithDistance = services.map(shop => {
      let distance = null;
      
      // Check if shop has valid location data
      if (shop.location && 
          shop.location.coordinates && 
          Array.isArray(shop.location.coordinates) && 
          shop.location.coordinates.length >= 2) {
        
        distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          shop.location.coordinates[1], // latitude
          shop.location.coordinates[0]  // longitude
        );
      }
      
      return { ...shop, distance };
    });
    
    // Sort by distance (shops with no distance go to the end)
    const sorted = servicesWithDistance.sort((a, b) => {
      if (a.distance === null && b.distance === null) return 0;
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
    
    setSortedServices(sorted);
    setIsLoading(false);
  };
  
  // Run sort when user location changes
  useEffect(() => {
    if (userLocation) {
      sortServicesByDistance();
    }
  }, [userLocation]);

  // Filter services based on search query
  const filteredServices = sortedServices.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
      {/* Hero Section with Search Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 ">
          <h1 className="text-4xl font-bold mb-6 capitalize">{category.serviceType} Services</h1>
          <p className="text-lg opacity-90 mb-8">
            Find the best {category.serviceType} services near you
            {locationError && <span className="block mt-2 text-yellow-200 text-sm">(Location services disabled: {locationError})</span>}
          </p>
          
          {/* Search Bar moved here */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              className="w-full p-4 pl-12 rounded-lg shadow-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              placeholder="Search for a service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Service Cards */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Finding services near you...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Services Found</h2>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              {userLocation ? "Showing services sorted by distance from your current location" : "Location access denied. Showing services in default order."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((shop, index) => (
                <Link
                  to={`${shop.shopID}`}
                  key={shop._id || index}
                  className="transform hover:-translate-y-1 transition-transform duration-300"
                >
                  <ShopCardForUser 
                    shop={shop} 
                    index={index} 
                    distance={shop.distance ? shop.distance.toFixed(1) : null} 
                  />
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ServiceStores;