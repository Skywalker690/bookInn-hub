import React, { useEffect, useState } from 'react';
import { ApiService } from '../../services/apiService';
import { RoomDTO } from '../../types';
import { ROOM_TYPES } from '../../constants';
import { Trash2, Edit, Plus, X } from 'lucide-react';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Rooms</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Room
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map((room) => (
              <tr key={room.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{room.roomType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${room.roomPrice}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{room.roomDescription}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(room)} className="text-blue-600 hover:text-blue-900 mr-4">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button onClick={() => initiateDelete(room.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">{editingRoomId ? 'Edit Room' : 'Add New Room'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Room Type</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                    <option value="" disabled>Select Type</option>
                  {ROOM_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price per Night</label>
                <input
                  type="number"
                  value={roomPrice}
                  onChange={(e) => setRoomPrice(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required={!editingRoomId} // Required only for new rooms
                />
              </div>
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-white text-gray-700 px-4 py-2 border border-gray-300 rounded-md shadow-sm mr-3 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700"
                >
                  Save Room
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