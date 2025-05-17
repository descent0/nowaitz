"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import SkeletonLoader from "../utilComp/SkeletonLoader";
import { useDispatch, useSelector } from "react-redux";
import { updateShopStatus, getAllShops } from "../../store/shopSlice";
import ShopCard from "./ShopCards";

const ShopManagement = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const shops = useSelector((state) => state.shop.shops);

  useEffect(() => {
    dispatch(getAllShops());
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleUpdateShopStatus = (shopId, status) => {
    console.log(`Updating shop ${shopId} to status ${status}`);
    dispatch(updateShopStatus({ shop_id: shopId, status }));
  };

  const filteredShops = shops.filter(
    (shop) =>
      (activeTab === "all" || shop.status === activeTab) &&
      shop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = ["all", "Active", "Inactive", "Under Maintenance", "NotApproved", "Rejected"];

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Shop Management</h2>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search shops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full max-w-md bg-white border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>

      <div className="flex space-x-2 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg transition font-medium ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <SkeletonLoader key="skeleton" />
        ) : (
          <motion.div
            key={activeTab + searchTerm}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap gap-4 justify-start"
          >
            {filteredShops.length > 0 ? (
              filteredShops.map((shop, index) => (
                <ShopCard
                  key={shop._id}
                  shop={shop}
                  index={index}
                  onUpdateStatus={handleUpdateShopStatus}
                />
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center text-lg">No shops available</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShopManagement;


