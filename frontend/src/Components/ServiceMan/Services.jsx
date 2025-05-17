import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkShop } from '../../store/shopSlice';
import { createService, deleteService, getServicesByShopId, updateService } from '../../store/serviceSlice';

const Services = () => {
  const dispatch = useDispatch();
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    shopId: null,
  });
  const [editingService, setEditingService] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  const shopData = useSelector((state) => state.shop.shop);
  const shopId = shopData?._id; 

  const services = useSelector((state) => state.services.services);
  const loading = useSelector((state) => state.services.loading);
  const error = useSelector((state) => state.services.error);

  useEffect(() => {
    dispatch(checkShop());
  }, [dispatch]);
  
  useEffect(() => {
    if (shopId) {
      dispatch(getServicesByShopId(shopId));
    }
  }, [dispatch, shopId]);

  const handleAddService = () => {
    const serviceWithShopId = {
      ...newService,
      price: Number(newService.price),
      duration: Number(newService.duration),
      shopId: shopId
    };
    dispatch(createService(serviceWithShopId));
    setNewService({ 
      name: '', 
      description: '', 
      price: '', 
      duration: '',
      shopId: null 
    });
    setShowForm(false);
  };

  const handleUpdateService = () => {
    if (editingService) {
      const { _id, ...updatedService } = editingService;
      dispatch(updateService({ 
        serviceId: _id, 
        serviceData: {
          ...updatedService,
          price: Number(updatedService.price),
          duration: Number(updatedService.duration),
          shopId: shopId
        } 
      }));
      setEditingService(null);
      setShowForm(false);
    }
  };

  const handleRemoveService = (id) => {
    dispatch(deleteService(id));
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <header className="bg-white shadow-md z-50 mb-8">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-800">Services</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm transition-colors"
            >
              {showForm ? 'Close Form' : '+ Add Service'}
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6">
        <input
          type="text"
          placeholder="Search services..."
          className="w-full p-4 border-2 border-blue-800 rounded-lg mb-6"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            filteredServices.map((service) => (
              <div key={service._id} className="bg-white p-6 rounded-lg shadow-xl border-2 border-blue-800">
                <h3 className="text-xl font-bold text-blue-800 mb-2">{service.name}</h3>
                <p className="text-blue-600 mb-2">{service.description}</p>
                <div className="flex justify-between items-center text-blue-800">
                  <span className="font-bold">${service.price}</span>
                  <span>{service.duration} mins</span>
                </div>
                <div className="mt-4 flex justify-end gap-3">
                  <button 
                    onClick={() => handleEdit(service)} 
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleRemoveService(service._id)} 
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;