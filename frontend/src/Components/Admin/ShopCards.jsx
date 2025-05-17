import { motion } from "framer-motion";
import React from "react";

const ShopCard = ({ shop, index, onUpdateStatus }) => {
  const statusColors = {
    Active: "bg-green-100 text-green-800",
    Inactive: "bg-gray-100 text-gray-800",
    "Under Maintenance": "bg-yellow-100 text-yellow-800",
    NotApproved: "bg-blue-100 text-blue-800",
    Rejected: "bg-red-100 text-red-800",
  };

  const handleStatusChange = (status) => {
    onUpdateStatus(shop._id, status);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 w-[22rem] max-w-sm min-h-[300px] flex flex-col justify-between"
    >
      {/* Shop Image */}
      {shop.images && shop.images.length > 0 && (
        <img src={shop.images[0]} alt={shop.name} className="w-full h-40 object-cover rounded-lg mb-4" />
      )}

      {/* Shop Name & Status */}
      <div className="flex flex-col items-start mb-4">
        <h3 className="text-xl font-semibold mb-1">{shop.name}</h3>
        <p className="text-gray-600 mb-1">{shop.category}</p>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[shop.status] || "bg-gray-200 text-gray-700"}`}>
          {shop.status}
        </span>
      </div>

      {/* Status Update Buttons */}
      <div className="flex justify-between space-x-2">
        <button
          onClick={() => handleStatusChange("Active")}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Approve
        </button>
        <button
          onClick={() => handleStatusChange("Rejected")}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Reject
        </button>
        <button
          onClick={() => handleStatusChange("Inactive")}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
        >
          Deactivate
        </button>
      </div>
    </motion.div>
  );
};

export default ShopCard;