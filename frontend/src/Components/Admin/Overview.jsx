import  { useEffect } from 'react'
import StatCard from './StatCard'
import { Activity, Award, Clipboard, DollarSign, Users } from 'lucide-react'
import { getAllUsers } from '../../store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getAllShops } from '../../store/shopSlice';
import LineChart from './LineChart';

const Overview = () => {
    const dispatch=useDispatch();
    const users=useSelector(state=>state.authUser.users);
    const shops=useSelector(state=>state.shop.shops);

    const userData={
        totalUsers:users.length,
        activeUsers:users.filter(user=>user.status==="active").length,
        pendingApprovals:users.filter(user=>user.status==="pending").length,
        admin:users.filter(user=>user.role==="admin").length,
        regularUsers:users.filter(user=>user.role==="user").length, // Added line
    }
    const shopData={
      totalShops:shops.length,
      activeShops:shops.filter(shop=>shop.status==="active").length,
      pendingApprovals:shops.filter(shop=>shop.status==="NotApproved").length
    }
    useEffect(() => {
       dispatch(getAllUsers());
      dispatch(getAllShops());
    },[]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <StatCard title="Total Users" value={userData.totalUsers} icon={Users} color="blue" />
              <StatCard title="Active Users" value={userData.activeUsers} icon={Activity} color="green" />
              {/* <StatCard title="Monthly Revenue" value={financialData.monthlyRevenue} icon={DollarSign} color="yellow" /> */}
              <StatCard title="Admins" value={userData.admin} icon={Award} color="purple" />
              <StatCard title="Regular Users" value={userData.regularUsers} icon={Users} color="gray" /> {/* Added line */}
              <StatCard title="Pending Approvals" value={shopData.pendingApprovals} icon={Clipboard} color="red" />
              <StatCard title="Service Providers" value={shopData.totalShops} icon={Award} color="purple" />
                        
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
             <LineChart/>
            </div>
          </div>
    </div>
  )
}

export default Overview
