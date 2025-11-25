import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/apiService';
import { RoomDTO } from '../types';
import RoomCard from '../components/RoomCard';
import { Link } from 'react-router-dom';
import { Search, Calendar, Wifi, Utensils, Phone, ArrowRight, ShieldCheck, ChevronDown, MapPin } from 'lucide-react';

const Home: React.FC = () => {
  const [featuredRooms, setFeaturedRooms] = useState<RoomDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await ApiService.getAllRooms();
        if (response.roomList) {
          // Just take first 3 for homepage
          setFeaturedRooms(response.roomList.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center animate-zoom-slow"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          }}
        >
             {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto space-y-8">
           <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <h2 className="text-sm md:text-base font-bold tracking-[0.3em] uppercase mb-4 text-blue-400 font-sans">
                Welcome to BookInn Hub
              </h2>
           </div>
           <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-serif leading-tight tracking-tight mb-2 text-shadow-xl">
                Unparalleled <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                    Luxury
                </span>
              </h1>
           </div>
           <div className="animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              <p className="text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed font-sans">
                Discover a sanctuary of sophistication in the heart of the city. 
                Where timeless elegance meets modern comfort.
              </p>
           </div>
           
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-fade-in-up" style={{animationDelay: '0.7s'}}>
              <Link to="/rooms" className="px-10 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] font-sans">
                Book Your Stay
              </Link>
              <Link to="/rooms" className="px-10 py-4 bg-transparent border border-white text-white font-bold rounded-full hover:bg-white/10 transition-all backdrop-blur-sm font-sans">
                View Suites
              </Link>
           </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50">
            <ChevronDown className="w-8 h-8" />
        </div>
      </section>

      {/* About / Experience Section */}
      <section className="py-24 md:py-32 bg-white relative">
         <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="relative">
                    <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Interior" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"/>
                    </div>
                    {/* Floating secondary image */}
                    <div className="absolute -bottom-12 -right-12 w-2/3 rounded-lg overflow-hidden shadow-2xl border-8 border-white hidden md:block z-20">
                         <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Detail" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"/>
                    </div>
                    {/* Decorative square */}
                    <div className="absolute -top-10 -left-10 w-full h-full border-2 border-gray-100 z-0 rounded-lg"></div>
                </div>
                
                <div className="lg:pl-12 pt-12 lg:pt-0">
                    <h3 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 font-sans">Our Philosophy</h3>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                        Experience the Art of <br/> Fine Living.
                    </h2>
                    <p className="text-gray-500 text-lg leading-relaxed mb-8 font-light font-sans">
                        At BookInn Hub, we redefine hospitality. Every corner is designed to tell a story, every meal is a masterpiece, and every stay is an unforgettable memory. We invite you to indulge in a world where your comfort is our sole obsession.
                    </p>
                    
                    <div className="flex gap-12 border-t border-gray-100 pt-8 font-sans">
                        <div>
                            <p className="text-4xl font-serif font-bold text-gray-900">50+</p>
                            <p className="text-sm text-gray-500 uppercase tracking-wide mt-1">Luxury Suites</p>
                        </div>
                        <div>
                            <p className="text-4xl font-serif font-bold text-gray-900">24/7</p>
                            <p className="text-sm text-gray-500 uppercase tracking-wide mt-1">Concierge</p>
                        </div>
                        <div>
                            <p className="text-4xl font-serif font-bold text-gray-900">4.9</p>
                            <p className="text-sm text-gray-500 uppercase tracking-wide mt-1">Guest Rating</p>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* Services/Amenities - Dark Themed */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
         {/* Background Pattern */}
         <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '32px 32px'}}></div>
         
         <div className="container mx-auto px-6 max-w-7xl relative z-10">
             <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                 <div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Exceptional Amenities</h2>
                    <p className="text-gray-400 max-w-xl font-sans">Designed to elevate your stay, our premium amenities ensure that you have everything you need, exactly when you need it.</p>
                 </div>
                 <Link to="/rooms" className="mt-6 md:mt-0 inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors font-medium font-sans group">
                    View All Services <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </Link>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
                 {[
                    { icon: Utensils, title: "Gourmet Dining", desc: "Award-winning restaurants offering exquisite international cuisine." },
                    { icon: Wifi, title: "Smart Connectivity", desc: "High-speed fiber internet and smart room controls at your fingertips." },
                    { icon: ShieldCheck, title: "Private & Secure", desc: "24-hour security and private access to ensure your peace of mind." },
                    { icon: Calendar, title: "Concierge Service", desc: "Personalized itinerary planning and booking assistance." }
                 ].map((item, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-600/30">
                            <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
                    </div>
                 ))}
             </div>
         </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
           <div className="text-center max-w-3xl mx-auto mb-16">
               <span className="text-blue-600 font-bold tracking-widest uppercase text-sm font-sans">Accommodations</span>
               <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mt-3 mb-6">Handpicked Collections</h2>
               <p className="text-gray-500 text-lg font-sans">Choose from our exclusive selection of rooms and suites, each designed with a unique character and style.</p>
           </div>

           {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="h-[500px] bg-gray-200 rounded-xl animate-pulse"></div>
               ))}
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredRooms.map(room => (
                   <RoomCard key={room.id} room={room} />
                ))}
             </div>
           )}
           
           <div className="text-center mt-16">
               <Link to="/rooms" className="inline-block px-10 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-black transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 font-sans">
                  View All Accommodations
               </Link>
           </div>
        </div>
      </section>

      {/* Video / Banner CTA */}
      <section className="relative py-32 md:py-48 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black">
              <img src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" alt="Pool" className="w-full h-full object-cover opacity-60 animate-zoom-slow"/>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900/50"></div>
          </div>
          <div className="relative z-10 text-center text-white px-4 max-w-4xl">
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">Escape to Paradise</h2>
              <p className="text-xl md:text-2xl font-light text-gray-200 mb-10 font-sans">Your dream vacation awaits. Book now and enjoy exclusive member benefits.</p>
              <Link to="/rooms" className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/50 font-sans group">
                  Plan Your Trip <Calendar className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform"/>
              </Link>
          </div>
      </section>

    </div>
  );
};

export default Home;