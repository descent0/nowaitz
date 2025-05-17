import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`bg-white shadow-md rounded-xl p-6 flex items-center space-x-4 border-l-4 border-${color}-500`}
  >
    <Icon className={`text-${color}-500`} size={36} />
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h4 className={`text-2xl font-bold text-${color}-600`}>{value}</h4>
    </div>
  </motion.div>
);

export default StatCard;
