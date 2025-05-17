import React, { useEffect } from 'react'
import StatCard from './StatCard'
import { Activity, Clipboard, DollarSign, LineChart, Users } from 'lucide-react'
import { getAllUsers } from '../../store/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const Overview = () => {
    const dispatch=useDispatch();
    const users=useSelector(state=>state.authUser.users);
    console.log(users);
    const userData={
        totalUsers:users.length,
        activeUsers:users.filter(user=>user.status==="active").length,
        serviceProviders:users.filter(user=>user.role==="service_provider").length,
        pendingApprovals:users.filter(user=>user.status==="pending").length
    }
    useEffect(() => {
       dispatch(getAllUsers());
    },[]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <StatCard title="Total Users" value={userData.totalUsers} icon={Users} color="blue" />
              <StatCard title="Active Users" value={userData.activeUsers} icon={Activity} color="green" />
              {/* <StatCard title="Monthly Revenue" value={financialData.monthlyRevenue} icon={DollarSign} color="yellow" /> */}
              <StatCard title="Pending Approvals" value={userData.pendingApprovals} icon={Clipboard} color="red" />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="text-xl font-semibold mb-4">User Growth</h4>
              <LineChart />
            </div>
          </div>
    </div>
  )
}

export default Overview
