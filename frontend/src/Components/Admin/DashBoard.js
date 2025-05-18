import { useState, useEffect } from "react"
import {
  Users,
  Shield,
  DollarSign,
  MessageCircle,
  Clipboard,
  Percent,
  Menu,
  X,
  BarChart,
  Settings,
  UserCircle,
  Bell,
  Search,
  ChevronDown,
  HelpCircle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import StatCard from "./StatCard"
import DoughnutChart from "./DoughnutChart"
import ShopManagement from "./ShopManagement"
import UserManagement from "./UserManagement"
import Overview from "./Overview"
import CategoryManagement from "./CategoryManagement"
import { useDispatch, useSelector } from "react-redux"
import { logoutUser } from "../../store/userSlice"

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("Overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const dispatch = useDispatch()

  const user= useSelector(state => state.authUser.user);
  
  const financialData = { 
    monthlyRevenue: "$87,500", 
    platformCommission: "15%", 
    pendingPayouts: "$45,670" 
  }


  // Track window resize for better responsiveness
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    
    // Auto-open sidebar on larger screens
    if (windowWidth >= 768) {
      setSidebarOpen(true)
    }
    
    return () => window.removeEventListener('resize', handleResize)
  }, [windowWidth])

  const sections = [
    { icon: BarChart, title: "Overview" },
    { icon: Users, title: "User Management"},
    { icon: Shield, title: "Category Management" },
    { icon: Users, title: "Shop Management" },
    { icon: MessageCircle, title: "Dispute Resolution" },
    { icon: DollarSign, title: "Financial Management" },
    { icon: Settings, title: "Settings" },
  ]

  const notifications = [
    { id: 1, title: "New user registration", time: "2 minutes ago" },
    { id: 2, title: "Payment dispute opened", time: "1 hour ago" },
    { id: 3, title: "System update completed", time: "Yesterday" },
  ]

  const SectionContent = () => {
    switch (activeSection) {
      case "Overview":
        return <Overview />
      case "User Management":
        return <UserManagement />
      case "Category Management":
        return <CategoryManagement />
      case "Financial Management":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <StatCard title="Monthly Revenue" value={financialData.monthlyRevenue} icon={DollarSign} color="green" />
              <StatCard title="Platform Commission" value={financialData.platformCommission} icon={Percent} color="blue" />
              <StatCard title="Pending Payouts" value={financialData.pendingPayouts} icon={Clipboard} color="orange" />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="text-xl font-semibold mb-4">Revenue Distribution</h4>
              <DoughnutChart />
            </div>
          </div>
        )
      case "Shop Management":
        return <ShopManagement />
      default:
        return (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="text-gray-500 text-lg">Feature coming soon...</p>
          </div>
        )
    }
  }

  // Sidebar component for both mobile and desktop
  const SidebarContent = ({ mobile = false }) => (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Menu size={22} />
          </div>
          <span className="text-2xl font-bold text-blue-600 tracking-tight">AdminPanel</span>
        </div>
        {mobile && (
          <button
            className="p-2 rounded-full hover:bg-gray-200 focus:outline-none transition-all"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
        {sections.map(({ icon: Icon, title, badge }) => (
          <button
            key={title}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all space-x-3 font-medium
              ${activeSection === title
                ? "bg-blue-100 text-blue-700 shadow"
                : "hover:bg-blue-50 text-gray-700"
              }`}
            onClick={() => {
              setActiveSection(title)
              if (mobile) setSidebarOpen(false)
            }}
          >
            <div className="flex items-center space-x-3">
              <Icon className={`${activeSection === title ? "text-blue-600" : "text-gray-400"}`} size={20} />
              <span>{title}</span>
            </div>
            
          </button>
        ))}
      </nav>
      <div className="mt-auto px-6 py-5 border-t">
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-all"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <UserCircle className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Admin User</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <ChevronDown size={18} className={`text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
        </div>
        
        <AnimatePresence>
          {showUserMenu && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 py-2 bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 transition-all">
                Profile Settings
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 transition-all">
                Preferences
              </button>
              <div className="my-1 border-t border-gray-200"></div>
              <button
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition-all font-medium"
                onClick={() => dispatch(logoutUser())}
              >
                Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar for desktop */}
      <aside 
        className={`hidden md:flex flex-col bg-white shadow-lg w-72 h-full z-30 transition-all duration-300 ${
          windowWidth >= 768 && sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Sidebar for mobile */}
      <AnimatePresence>
        {sidebarOpen && windowWidth < 768 && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-30"
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Mobile sidebar */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-40 flex flex-col"
            >
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 min-h-screen transition-all duration-300 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center">
            {/* Mobile sidebar toggle */}
            <button
              className="md:hidden mr-4 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            
            <h3 className="text-xl md:text-2xl font-semibold text-blue-700 tracking-tight">{activeSection}</h3>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Help button */}
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-all hidden md:flex">
              <HelpCircle size={20} className="text-gray-500" />
            </button>
            
            {/* Notifications */}
            <div className="relative">
              <button 
                className="p-2 rounded-lg hover:bg-gray-100 transition-all relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} className="text-gray-500" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              {/* Notification dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden"
                    onBlur={() => setShowNotifications(false)}
                  >
                    <div className="p-4 border-b border-gray-100">
                      <h4 className="font-semibold text-gray-800">Notifications</h4>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map(notification => (
                        <div key={notification.id} className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all">
                          <p className="font-medium text-gray-800">{notification.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center bg-gray-50">
                      <button className="text-blue-600 text-sm font-medium hover:underline">
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* User profile - mobile only */}
            <button className="md:hidden p-2 rounded-full bg-blue-100">
              <UserCircle className="text-blue-600" size={22} />
            </button>
          </div>
        </header>
        
        {/* Breadcrumbs */}
        <div className="bg-white border-b px-4 md:px-8 py-2 text-sm text-gray-500 hidden md:block">
          Dashboard / {activeSection}
        </div>
        
        {/* Content */}
        <section className="flex-1 p-4 md:p-8 bg-gray-100 overflow-y-auto">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <SectionContent />
          </motion.div>
        </section>
        
        {/* Footer - desktop only */}
        <footer className="py-3 px-8 border-t text-sm text-gray-500 hidden md:flex justify-between items-center bg-white">
          <span>© 2025 AdminPanel. All rights reserved.</span>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-blue-600 transition-all">Help</a>
            <a href="#" className="hover:text-blue-600 transition-all">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-all">Terms</a>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default AdminDashboard