
import { useState } from "react"
import {
  Users,
  Shield,
  DollarSign,
  MessageCircle,
  Activity,
  Award,
  Clipboard,
  Percent,
  Menu,
  X,
  BarChart,
  Settings,
  LineChart,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import StatCard from "./StatCard"
import DoughnutChart from "./DoughnutChart"
import ShopManagement from "./ShopManagement"
import UserManagement from "./UserManagement"
import Overview from "./Overview"
import CategoryManagement from "./CategoryManagement"



const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("Overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const userData = { totalUsers: 1245, activeUsers: 987, serviceProviders: 287, pendingApprovals: 42 }
  const financialData = { monthlyRevenue: "$87,500", platformCommission: "15%", pendingPayouts: "$45,670" }

  const sections = [
    { icon: BarChart, title: "Overview" },
    { icon: Users, title: "User Management" },
    {icon:Users,title:"Category Management"},
    { icon: Shield, title: "Shop Management" },
    { icon: MessageCircle, title: "Dispute Resolution" },
    { icon: DollarSign, title: "Financial Management" },
    { icon: Settings, title: "Settings" },
  ]

  const SectionContent = () => {
    switch (activeSection) {
      case "Overview":
        return (
          <Overview/>
        )
      case "User Management":
        return (
          <UserManagement/>
        )
        case "Category Management":
          return(
           <CategoryManagement/> 
          )
      case "Financial Management":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <StatCard title="Monthly Revenue" value={financialData.monthlyRevenue} icon={DollarSign} color="green" />
              <StatCard
                title="Platform Commission"
                value={financialData.platformCommission}
                icon={Percent}
                color="blue"
              />
              <StatCard title="Pending Payouts" value={financialData.pendingPayouts} icon={Clipboard} color="orange" />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="text-xl font-semibold mb-4">Revenue Distribution</h4>
              <DoughnutChart />
            </div>
          </div>
        )
        case "Category Management":
        return(
<CategoryManagement/>
        );
        case "Shop Management":
          return(
            <ShopManagement/>
          );
      default:
        return (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="text-gray-500 text-lg">Feature coming soon...</p>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-lg p-4 flex flex-col space-y-4 fixed top-0 left-0 h-full w-64 z-20"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-600">AdminPanel</h2>
              <button
                className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            {sections.map(({ icon: Icon, title }) => (
              <motion.div
                key={title}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all space-x-3 ${
                  activeSection === title ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveSection(title)}
              >
                <Icon className={`${activeSection === title ? "text-blue-600" : "text-gray-500"}`} size={22} />
                <span className="font-medium">{title}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Toggle Button */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-4 z-30 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "ml-0"}`}>
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-3xl font-semibold text-gray-800 mb-6">{activeSection}</h3>
          <SectionContent />
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard