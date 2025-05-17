import React, { useEffect } from 'react'
import StatCard from './StatCard'
import { Activity, Award, Clipboard, Users } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '../../store/userSlice'

const UserManagement = () => {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <StatCard title="Total Users" value={userData.totalUsers} icon={Users} color="blue" />
            <StatCard title="Active Users" value={userData.activeUsers} icon={Activity} color="green" />
            <StatCard title="Service Providers" value={userData.serviceProviders} icon={Award} color="purple" />
            <StatCard title="Pending Approvals" value={userData.pendingApprovals} icon={Clipboard} color="orange" />
          </div>

          {
            users.map(user=>(
              <div key={user._id} className="bg-white p-4 shadow-md rounded-lg mt-4">
                <h4 className="text-xl font-semibold">{user.name}</h4>
                <p className="text-gray-500">{user.email}</p>
                <p className="text-gray-500">{user.role}</p>
                <p className="text-gray-500">{user.status}</p>
              </div>
            ))
          }
    </div>
  )
}

export default UserManagement
