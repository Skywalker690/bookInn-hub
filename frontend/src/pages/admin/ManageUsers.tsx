import React, { useEffect, useState } from 'react';
import { ApiService } from '../../services/apiService';
import { UserDTO } from '../../types';
import { Trash2, User, Shield, Users } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getAllUsers();
      if (response.userList) {
        setUsers(response.userList);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const initiateDelete = (id: number) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      await ApiService.deleteUser(userToDelete.toString());
      fetchUsers();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  // Stats
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const regularUsers = users.filter(u => u.role === 'USER').length;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold font-serif text-gray-900">User Directory</h1>
            <p className="text-gray-500 mt-1">Manage user access and profiles.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <Shield className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Administrators</p>
                    <p className="text-2xl font-bold text-gray-900">{adminCount}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="p-3 bg-gray-50 text-gray-600 rounded-xl">
                    <User className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Regular Guests</p>
                    <p className="text-2xl font-bold text-gray-900">{regularUsers}</p>
                </div>
            </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-xl shadow-gray-100 rounded-2xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                    <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User Profile</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Info</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {loading && (
                         <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading users...</td></tr>
                    )}
                    
                    {!loading && users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                    <div className="text-xs text-gray-500">ID: {user.id}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-900">{user.email}</span>
                                <span className="text-xs text-gray-500">{user.phoneNumber}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                                {user.role === 'ADMIN' ? <Shield className="w-3 h-3 mr-1 self-center" /> : <User className="w-3 h-3 mr-1 self-center" />}
                                {user.role}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                            onClick={() => initiateDelete(user.id)} 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group relative"
                            title="Delete User"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>

        <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
            title="Delete User"
            message="Are you sure you want to delete this user? This action cannot be undone."
        />
      </div>
    </div>
  );
};

export default ManageUsers;