import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createEmployee, deleteEmployee, getEmployees, getEmployeesByShopId, updateEmployee } from '../../store/employeeSlice';
import { checkShop } from '../../store/shopSlice';

const Employee = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [employeeData, setEmployeeData] = useState({ name: '', email: '', phone: '', type: '', entryTime: '', exitTime: '', slotTime: '30' });
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    dispatch(checkShop());
  }, [dispatch]);

  const shopData = useSelector((state) => state.shop.shop);
  const shopId = shopData?._id;

  useEffect(() => {
    if (shopId) {
      dispatch(getEmployeesByShopId(shopId));
    }
  }, [dispatch, shopId]);

  const employees = useSelector((state) => state.employee.employees);
  const loading = useSelector((state) => state.employee.loading);
  const error = useSelector((state) => state.employee.error);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const employeeWithShopId = { ...employeeData, shopId };

    if (editingEmployee) {
      dispatch(updateEmployee({ id: editingEmployee._id, employeeData: employeeWithShopId }));
      setEditingEmployee(null);
    } else {
      dispatch(createEmployee(employeeWithShopId));
      console.log(employees);
    }
    setEmployeeData({ name: '', email: '', phone: '', type: '', entryTime: '', exitTime: '', slotTime: '' });
    setShowForm(false);
  };

  const handleEdit = (employee) => {
    setEmployeeData({ ...employee });
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteEmployee(id));
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <header className="bg-white shadow-md z-50 mb-8">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-800">Team Management</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm transition-colors"
            >
              {showForm ? 'Close Form' : '+ Add Employee'}
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6">
        {showForm && (
          <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={employeeData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={employeeData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={employeeData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <select
                  name="type"
                  value={employeeData.type}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Barber">Barber</option>
                  <option value="Stylist">Stylist</option>
                  <option value="Assistant">Assistant</option>
                </select>
                <input
                  type="time"
                  name="entryTime"
                  value={employeeData.entryTime}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="time"
                  name="exitTime"
                  value={employeeData.exitTime}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  name="slotTime"
                  placeholder="Slot Time (minutes)"
                  value={employeeData.slotTime}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  min="10"
                  max="180"
                  step="10"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-indigo-500 text-white py-2 rounded-md mt-4">
                {editingEmployee ? 'Update Employee' : 'Create Employee'}
              </button>
            </form>
          </div>
        )}

        <input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-4 border-2 border-blue-800 rounded-lg mb-6"
        />

        {loading && <p className="text-center">Loading...</p>}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee) => (
            <div key={employee._id} className="bg-white p-6 rounded-lg shadow-xl border-2 border-blue-800">
              <h2 className="text-xl font-bold text-blue-800 mb-2">{employee.name}</h2>
              <div className="space-y-2 text-blue-600">
                <p>Email: {employee.email}</p>
                <p>Phone: {employee.phone}</p>
                <p>Role: {employee.type}</p>
                <p>Hours: {employee.entryTime} - {employee.exitTime}</p>
                <p>Slot Duration: {employee.slotTime} minutes</p>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => handleEdit(employee)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(employee._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Employee;
