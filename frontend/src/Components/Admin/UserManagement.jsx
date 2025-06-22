import { useEffect, useState } from 'react'
import StatCard from './StatCard'
import {Award, Users } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '../../store/userSlice'

const UserManagement = () => {
    const dispatch = useDispatch();
    const users = useSelector(state => state.authUser.users);
    const [selectedType, setSelectedType] = useState('all'); // New state

    const userData = {
        totalUsers: users.length,
        admins: users.filter(user => user.role === "admin").length,
        regularUsers: users.filter(user => user.role === "user").length,
        pendingApprovals: users.filter(user => user.status === "pending").length
    }

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    // Filter users based on selectedType
    const filteredUsers = users.filter(user => {
        if (selectedType === 'all') return true;
        if (selectedType === 'admin') return user.role === 'admin';
        if (selectedType === 'user') return user.role === 'user';
        return true;
    });

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div onClick={() => setSelectedType('all')} style={{ cursor: 'pointer' }}>
                    <StatCard title="Total Users" value={userData.totalUsers} icon={Users} color={selectedType === 'all' ? "blue" : "gray"} />
                </div>
                <div onClick={() => setSelectedType('admin')} style={{ cursor: 'pointer' }}>
                    <StatCard title="Admins" value={userData.admins} icon={Award} color={selectedType === 'admin' ? "purple" : "gray"} />
                </div>
                <div onClick={() => setSelectedType('user')} style={{ cursor: 'pointer' }}>
                    <StatCard title="Regular Users" value={userData.regularUsers} icon={Users} color={selectedType === 'user' ? "blue" : "gray"} />
                </div>
            </div>

            {
                filteredUsers.map(user => (
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
