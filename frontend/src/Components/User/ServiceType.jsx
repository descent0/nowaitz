import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ServiceCards from './ServiceCards';
import { useDispatch, useSelector } from 'react-redux';
import { getAllApprovedCategories, getAllCategories } from '../../store/categorySlice';

const ServiceType = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllApprovedCategories());
  }, [dispatch]);

  const service = useSelector(state => state.category.categories);


  const categories = ['All', 'Personal Care', 'Home Services', 'Fashion'];

  const categoryMap = {
    'Personal Care': ['Barber'],
    'Home Services': ['Plumber', 'Electrician'],
    'Fashion': ['Boutique', 'Shoe Maker']
  };

  const filteredServices = service.filter(item => {
    const matchesSearch = item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || 
      categoryMap[activeCategory]?.includes(item.title);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl md:text-5xl text-white font-bold mb-6">
            Find Your Service
          </h1>
          <div className="w-full max-w-xl">
            <div className="relative">
              <input
                type="text"
                className="w-full p-4 pl-12 rounded-full shadow-lg text-lg"
                placeholder="Search for a service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full transition-all ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {service.map(item => (
            <Link
              key={item.name}
              to={`/${item.name}`}
              className="transform transition-all hover:scale-105"
            >
              <ServiceCards
                title={item.name}
                description={item.description}
                imageLink={"https://placehold.co/600x400?text=" + item.name}
              />
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {service.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-600">
              No services found matching your criteria
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceType
