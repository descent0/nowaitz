import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import StatCard from './StatCard'
import DoughnutChart from './DoughnutChart'
import { Clipboard, DollarSign, Percent } from 'lucide-react'
import { fetchAppointments } from '../../store/appointmentSlice'

const FinancialManagement = () => {
  const dispatch = useDispatch()
  const appointments = useSelector(state => state.appointments.appointments.filter(app => app.status === 'Confirmed' || app.status === 'Completed'));
  const loading = useSelector(state => state.appointments.loading)
  const error = useSelector(state => state.appointments.error)
  console.log(appointments);

  useEffect(() => {
    dispatch(fetchAppointments())
  }, [dispatch])

  // Calculate financial data
  const { totalRevenue, monthlyRevenue, shopWiseRevenue } = useMemo(() => {
    if (!appointments || appointments.length === 0) {
      return { totalRevenue: 0, monthlyRevenue: 0, shopWiseRevenue: {} }
    }
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    let total = 0
    let monthly = 0
    const shopWise = {}

    appointments.forEach(app => {
      if (app.status === 'Confirmed' || app.status === 'Completed') {
        const amount = Number(app.totalAmount) || 0
        total += amount

        const appDate = new Date(app.createdAt || app.schedule?.[0]?.date)
        if (
          appDate.getMonth() === currentMonth &&
          appDate.getFullYear() === currentYear
        ) {
          monthly += amount
        }

        const shopName = app.shop?.name || 'Unknown Shop'
        if (!shopWise[shopName]) shopWise[shopName] = 0
        shopWise[shopName] += amount
      }
    })

    return { totalRevenue: total, monthlyRevenue: monthly, shopWiseRevenue: shopWise }
  }, [appointments])

  // Example: Platform commission is 15%
  const platformCommission = (monthlyRevenue * 0.15).toFixed(2)

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={DollarSign} color="green" />
          <StatCard title="Monthly Revenue" value={`₹${monthlyRevenue.toLocaleString()}`} icon={DollarSign} color="blue" />
          <StatCard title="Platform Commission" value={`₹${platformCommission}`} icon={Percent} color="orange" />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h4 className="text-xl font-semibold mb-4">Revenue Distribution (Shop Wise)</h4>
          <DoughnutChart
            data={{
              labels: Object.keys(shopWiseRevenue),
              datasets: [
                {
                  data: Object.values(shopWiseRevenue),
                  backgroundColor: [
                    '#4F46E5', '#22D3EE', '#F59E42', '#10B981', '#F43F5E', '#6366F1'
                  ],
                },
              ],
            }}
          />
          <ul className="mt-4 space-y-1 text-sm">
            {Object.entries(shopWiseRevenue).map(([shop, amount]) => (
              <li key={shop} className="flex justify-between">
                <span>{shop}</span>
                <span className="font-semibold">₹{amount.toLocaleString()}</span>
              </li>
            ))}
          </ul>
          {/* Add this table for detailed shop revenue */}
          <div className="mt-6">
            <h5 className="font-semibold mb-2">Shop-wise Revenue Details</h5>
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Shop</th>
                  <th className="py-2 px-4 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(shopWiseRevenue).map(([shop, amount]) => (
                  <tr key={shop} className="border-t">
                    <td className="py-2 px-4">{shop}</td>
                    <td className="py-2 px-4 text-right">₹{amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {loading && <div className="mt-6 text-center text-blue-600">Loading financial data...</div>}
    </div>
  )
}

export default FinancialManagement
