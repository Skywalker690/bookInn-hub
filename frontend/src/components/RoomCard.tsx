import React from 'react';
import { RoomDTO } from '../types';
import { Link } from 'react-router-dom';

interface RoomCardProps {
  room: RoomDTO;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  // Use a fallback image if roomPhotoUrl is missing or broken (handled by onerror usually, but here simple logic)
  const imageUrl = room.roomPhotoUrl || 'https://picsum.photos/400/300';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="h-56 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={room.roomType} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/400/300?grayscale';
          }}
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">{room.roomType}</h3>
          <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded">
            ${room.roomPrice} / night
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {room.roomDescription}
        </p>
        <Link 
          to={`/rooms/${room.id}`}
          className="w-full block text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          View Details & Book
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
