import React, { useState, useRef, useEffect } from 'react';
import { 
  Scissors, MapPin, Phone, Instagram, Facebook, Star, 
  Clock, Menu, X, Mail, Calendar 
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeesByShopId } from '../../store/employeeSlice';
import { getServicesByShopId } from '../../store/serviceSlice';
import { useParams } from 'react-router-dom';
import { getAllShopByShopId } from '../../store/shopSlice';
import MapComponent from '../utilComp/Map';
import { Link } from 'react-router-dom';

const NavLink = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="text-gray-700 hover:text-blue-600 transition-colors capitalize px-4 py-2 rounded-lg hover:bg-gray-100"
  >
    {label}
  </button>
);

const ServiceCard = ({ service }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
    <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
    <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
      <span className="text-2xl font-bold text-blue-600">Rs {service.price.toFixed(2)}</span>
      <Link 
        to="book-appointment"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Book Now
      </Link>
    </div>
  </div>
);

const TeamMemberCard = ({ member }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <img
  src={`https://placehold.co/128x128?text=${member.name.charAt(0).toUpperCase()}`}
  alt={member.name}
  className="w-26 h-26 object-cover rounded-full border-4 border-blue-100"
/>
      <div className="text-center sm:text-left">
        <h3 className="text-xl font-semibold">{member.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{member.role}</p>
        <div className="flex gap-1 justify-center sm:justify-start">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className="text-yellow-400 fill-current" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Shop = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sectionsRef = useRef({});
  const { shop: shopID } = useParams();
  const dispatch = useDispatch();
  console.log("shopID"+shopID);
  useEffect(() => {
    if (shopID) {
      console.log("Inside shopID"+shopID);
      dispatch(getAllShopByShopId(shopID));
    }
  }, []);

  const shopData = useSelector((state) => state.shop.shop?.[0] || {});
  const employees = useSelector((state) => state.employee.employees || []);
  const services = useSelector((state) => state.services.services || []);
  const isLoading = useSelector((state) => state.shop.loading);

  useEffect(() => {
    if (shopData._id) {
      dispatch(getEmployeesByShopId(shopData._id));
      dispatch(getServicesByShopId(shopData._id));
    }
  }, [dispatch, shopData._id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black/50"></div>
        {shopData.images?.[0] && (
          <div 
            className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
            style={{ backgroundImage: `url(${shopData.images[0]})` }}
          />
        )}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
            {shopData.name}
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 text-center">
            Professional {shopData.category} Services
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => sectionsRef.current['services']?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Calendar size={20} />
              Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Services */}
        <section ref={el => sectionsRef.current['services'] = el} className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        </section>

        {/* Team */}
        <section ref={el => sectionsRef.current['team'] = el} className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {employees.map(member => (
              <TeamMemberCard key={member._id} member={member} />
            ))}
          </div>
        </section>

        {/* Contact */}
        <section ref={el => sectionsRef.current['contact'] = el} className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-8">Visit Us</h2>
            {shopData.locationCoordinates && (
              <div className="h-[400px] rounded-xl overflow-hidden">
                <MapComponent 
                  latitude={shopData.locationCoordinates.latitude}
                  longitude={shopData.locationCoordinates.longitude}
                />
              </div>
            )}
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-8">Contact Info</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="text-blue-600" size={20} />
                  <a href={`tel:${shopData.contact?.phone}`} className="hover:text-blue-600">
                    {shopData.contact?.phone || 'N/A'}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-600" size={20} />
                  <a href={`mailto:${shopData.contact?.email}`} className="hover:text-blue-600">
                    {shopData.contact?.email || 'N/A'}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-blue-600" size={20} />
                  <span>{shopData.location || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Shop;