import React, { useEffect, useState } from 'react';
import { ApiService } from '../../services/apiService';
import { RoomDTO } from '../../types';
import { ROOM_TYPES } from '../../constants';
import { Trash2, Edit, Plus, X, Box, DollarSign, Layers, Image as ImageIcon } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';

const ManageRooms: React.FC = () => {
  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null);

  // Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<number | null>(null);

  // Form State
  const [roomType, setRoomType] = useState('');
  const [roomPrice, setRoomPrice] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getAllRooms();
      if (response.roomList) {
        setRooms(response.roomList);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const initiateDelete = (id: number) => {
    setRoomToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roomToDelete) return;
    try {
      await ApiService.deleteRoom(roomToDelete);
      fetchRooms();
    } catch (error) {
      alert('Failed to delete room');
    }
  };

  const handleOpenModal = (room?: RoomDTO) => {
    if (room) {
      setEditingRoomId(room.id);
      setRoomType(room.roomType);
      setRoomPrice(room.roomPrice.toString());
      setRoomDescription(room.roomDescription);
    } else {
      setEditingRoomId(null);
      setRoomType(ROOM_TYPES[0]);
      setRoomPrice('');
      setRoomDescription('');
    }
    setFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('roomType', roomType);
    formData.append('roomPrice', roomPrice);
    formData.append('roomDescription', roomDescription);
    if (file) {
      formData.append('photo', file);
    }

    try {
      if (editingRoomId) {
        await ApiService.updateRoom(editingRoomId, formData);
      } else {
        await ApiService.addRoom(formData);
      }
      handleCloseModal();
      fetchRooms();
    } catch (error: any) {
      alert(error.message || 'Operation failed');
    }
  };

  // Stats Calculation
  const totalRooms = rooms.length;
  const avgPrice = totalRooms > 0 ? (rooms.reduce((acc, r) => acc + r.roomPrice, 0) / totalRooms).toFixed(2) : 0;
  const totalTypes = new Set(rooms.map(r => r.roomType)).size;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif text-gray-900">Room Management</h1>
            <p className="text-gray-500 mt-1">Oversee hotel inventory, pricing, and details.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="group bg-gray-900 text-white px-5 py-3 rounded-xl hover:bg-black flex items-center shadow-lg shadow-gray-900/20 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" /> 
            Add New Room
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Box className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Rooms</p>
                    <p className="text-2xl font-bold text-gray-900">{totalRooms}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                    <DollarSign className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Avg. Price</p>
                    <p className="text-2xl font-bold text-gray-900">${avgPrice}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <Layers className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Room Types</p>
                    <p className="text-2xl font-bold text-gray-900">{totalTypes}</p>
                </div>
            </div>
        </div>

        {/* Table Section */}
        <div className="bg-white shadow-xl shadow-gray-100 rounded-2xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Room Detail</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price / Night</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                                <img 
                                    className="h-full w-full object-cover" 
                                    src={room.roomPhotoUrl} 
                                    alt="" 
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80'; }}
                                />
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-bold text-gray-900">{room.roomType}</div>
                                <div className="text-xs text-gray-500">ID: {room.id}</div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <p className="text-sm text-gray-500 max-w-xs truncate">{room.roomDescription}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-50 text-blue-700">
                           ${room.roomPrice}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button 
                            onClick={() => handleOpenModal(room)} 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Room"
                        >
                            <Edit className="h-5 w-5" />
                        </button>
                        <button 
                            onClick={() => initiateDelete(room.id)} 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Room"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {loading && (
             <div className="p-8 text-center text-gray-500">Loading rooms...</div>
          )}
          {!loading && rooms.length === 0 && (
             <div className="p-12 text-center text-gray-500">
                <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                    <Box className="w-8 h-8 text-gray-400" />
                </div>
                <p>No rooms found. Add one to get started.</p>
             </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">{editingRoomId ? 'Edit Room Details' : 'Add New Room'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Room Type</label>
                    <select
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                        className="block w-full border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-gray-50 p-3 text-sm"
                        required
                    >
                        <option value="" disabled>Select Type</option>
                        {ROOM_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price / Night</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">$</span>
                        </div>
                        <input
                            type="number"
                            value={roomPrice}
                            onChange={(e) => setRoomPrice(e.target.value)}
                            className="block w-full pl-7 border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-gray-50 p-3 text-sm"
                            placeholder="0.00"
                            required
                        />
                    </div>
                  </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  rows={4}
                  className="block w-full border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-gray-50 p-3 text-sm"
                  placeholder="Describe the room amenities, view, and features..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Room Image</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-gray-400 transition-colors cursor-pointer relative bg-gray-50">
                    <div className="space-y-1 text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                <span>Upload a file</span>
                                <input 
                                    type="file" 
                                    className="sr-only" 
                                    accept="image/*"
                                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                    required={!editingRoomId} 
                                />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                        {file && (
                            <p className="text-sm text-green-600 font-medium mt-2">Selected: {file.name}</p>
                        )}
                    </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg"
                >
                  {editingRoomId ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Room"
        message="Are you sure you want to delete this room? This action cannot be undone."
      />
    </div>
  );
};

export default ManageRooms;