import React from 'react';
import { RoomDTO } from '../types';
import { Link } from 'react-router-dom';
import { ArrowRight, Wifi, Tv, Wind } from 'lucide-react';

interface RoomCardProps {
  room: RoomDTO;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const imageUrl = room.roomPhotoUrl || 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-100 transform hover:-translate-y-1">
      <div className="relative h-72 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={room.roomType} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
        <div className="absolute bottom-4 left-4 text-white">
           <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/30">
             Available
           </span>
        </div>
        <div className="absolute bottom-4 right-4 text-white font-bold text-xl drop-shadow-md">
            ${room.roomPrice} <span className="text-sm font-normal opacity-90">/ night</span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 font-serif group-hover:text-blue-600 transition-colors">{room.roomType}</h3>
        
        <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">
          {room.roomDescription}
        </p>

        {/* Mock Amenities Icons for visual appeal */}
        <div className="flex items-center space-x-4 mb-6 text-gray-400">
           <div className="flex items-center space-x-1" title="Free Wifi"><Wifi className="h-4 w-4" /> <span className="text-xs">Wifi</span></div>
           <div className="flex items-center space-x-1" title="Smart TV"><Tv className="h-4 w-4" /> <span className="text-xs">TV</span></div>
           <div className="flex items-center space-x-1" title="Air Conditioning"><Wind className="h-4 w-4" /> <span className="text-xs">AC</span></div>
        </div>

        <Link 
          to={`/rooms/${room.id}`}
          className="w-full inline-flex items-center justify-center text-sm font-bold uppercase tracking-wider py-4 border border-gray-200 rounded-lg hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 group-hover:shadow-lg"
        >
          View Details <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;