import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories, updateCategory, deleteCategory } from '../../store/categorySlice';

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);
  const [localCategories, setLocalCategories] = useState([]);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const handleStatusChange = (id, status) => {
    dispatch(updateCategory({ id, categoryData: { status } }));
    setLocalCategories((prevCategories) =>
      prevCategories.map((category) =>
        category._id === id ? { ...category, status } : category
      )
    );
  };

  const handleDelete = (id) => {
    dispatch(deleteCategory(id));
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Category Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Description</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {localCategories.map((category) => (
              <tr key={category._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{category.name}</td>
                <td className="py-2 px-4 border-b">{category.description}</td>
                <td className="py-2 px-4 border-b">{category.status}</td>
                <td className="py-2 px-4 border-b">
                  <button className="bg-green-500 text-white py-1 px-3 rounded mr-2" onClick={() => handleStatusChange(category._id, 'Approved')}>Approve</button>
                  <button className="bg-red-500 text-white py-1 px-3 rounded mr-2" onClick={() => handleStatusChange(category._id, 'Rejected')}>Reject</button>
                  <button className="bg-yellow-500 text-white py-1 px-3 rounded" onClick={() => handleDelete(category._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManagement;
