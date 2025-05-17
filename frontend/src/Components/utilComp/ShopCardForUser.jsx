import { motion, AnimatePresence } from "framer-motion";
const ShopCardForUser = ({ shop, index }) => {
    const statusColors = {
      Active: "bg-green-100 text-green-800",
      Inactive: "bg-gray-100 text-gray-800",
      "Under Maintenance": "bg-yellow-100 text-yellow-800",
      NotApproved: "bg-blue-100 text-blue-800",
      Rejected: "bg-red-100 text-red-800",
    };
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 w-80"
      >
        {/* Shop Image */}
        {shop.images && shop.images.length > 0 && (
          <img src={shop.images[0]} alt={shop.name} className="w-full h-40 object-cover rounded-lg mb-3" />
        )}
  
        {/* Shop Name & Status */}
        <h3 className="text-xl font-semibold mb-2">{shop.name}</h3>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[shop.status] || "bg-gray-200 text-gray-700"}`}>
          {shop.status}
        </span>
  
        
      </motion.div>
    );
  };
export default ShopCardForUser;