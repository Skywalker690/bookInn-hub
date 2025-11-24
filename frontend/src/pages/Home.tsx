import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/apiService';
import { RoomDTO } from '../types';
import RoomCard from '../components/RoomCard';
import { Link } from 'react-router-dom';
import { Search, Calendar, Wifi, Utensils, Star, Phone, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-start overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-110"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-gray-900/60 bg-gradient-to-r from-gray-900/90 to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 md:px-12 text-white max-w-7xl pt-20">
          <div className="max-w-3xl animate-fade-in">
            <div className="flex items-center space-x-2 mb-6">
              <span className="h-px w-8 bg-blue-500"></span>
              <span className="uppercase tracking-[0.2em] text-sm font-semibold text-blue-400">
                Welcome to BookInn Hub
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8 tracking-tight">
              Experience the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Art of Living
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl font-light">
              Immerse yourself in a world of refined elegance. Whether for business or leisure, 
              BookInn Hub offers the perfect sanctuary in the heart of the city.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <Link 
                to="/rooms" 
                className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-blue-600 rounded-full overflow-hidden transition-all hover:bg-blue-700 hover:shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]"
              >
                <span className="relative z-10 flex items-center">
                  Book Your Stay <Calendar className="ml-2 h-5 w-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
               <Link 
                to="/find-booking" 
                className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white border border-white/30 bg-white/5 backdrop-blur-md rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                Find My Booking <Search className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                 <img 
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="Hotel Lobby" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm font-semibold uppercase tracking-wider">Since 2024</p>
                  <p className="text-xl font-bold">Award Winning Design</p>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-50 -z-10 rounded-full blur-2xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-cyan-50 -z-10 rounded-full blur-2xl"></div>
            </div>
            
            <div className="lg:w-1/2">
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">About Us</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">Redefining Luxury <br/> & Comfort</h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                At BookInn Hub, we believe that accommodation is more than just a place to sleep. It's an experience. 
                From our meticulously designed rooms to our world-class culinary offerings, every detail is curated to provide you with an unforgettable stay.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-start">
                   <ShieldCheck className="w-6 h-6 text-blue-600 mt-1 mr-3" />
                   <div>
                     <h4 className="font-bold text-gray-900">Secure Booking</h4>
                     <p className="text-sm text-gray-500">Instant confirmation & security</p>
                   </div>
                </div>
                <div className="flex items-start">
                   <MapPin className="w-6 h-6 text-blue-600 mt-1 mr-3" />
                   <div>
                     <h4 className="font-bold text-gray-900">Prime Location</h4>
                     <p className="text-sm text-gray-500">Heart of the city center</p>
                   </div>
                </div>
              </div>
              <Link to="/rooms" className="text-blue-600 font-bold hover:text-blue-800 transition flex items-center group">
                Explore Our Rooms <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Grid */}
      <section className="py-20 bg-gray-50 relative">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">World-Class Amenities</h2>
            <p className="text-gray-500 text-lg">Designed to make your stay as comfortable and convenient as possible. We take care of the details so you can focus on relaxing.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Calendar, title: "Easy Booking", desc: "Seamless reservation process available 24/7." },
              { icon: Wifi, title: "High-Speed WiFi", desc: "Stay connected everywhere with fiber-optic internet." },
              { icon: Utensils, title: "Fine Dining", desc: "Exquisite culinary experiences tailored to your taste." },
              { icon: Phone, title: "24/7 Support", desc: "Our concierge team is always here to assist you." },
            ].map((item, index) => (
              <div key={index} className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <item.icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">Accommodations</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Featured Rooms</h2>
            </div>
            <Link to="/rooms" className="hidden md:flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full font-medium transition-colors">
              View All Rooms <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="rounded-xl overflow-hidden border border-gray-100 shadow-sm h-full flex flex-col">
                   <div className="h-72 bg-gray-200 animate-pulse"></div>
                   <div className="p-6 space-y-4 flex flex-col flex-grow">
                     <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                     <div className="space-y-2 flex-grow">
                       <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                       <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                     </div>
                     <div className="h-12 bg-gray-200 rounded animate-pulse mt-6"></div>
                   </div>
                 </div>
               ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRooms.map(room => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
          
          <div className="mt-12 md:hidden text-center">
             <Link to="/rooms" className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full font-medium w-full">
               View All Rooms <ArrowRight className="ml-2 w-4 h-4" />
             </Link>
          </div>
        </div>
      </section>

       {/* Testimonials */}
       <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
         {/* Background accent */}
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-800/50 skew-x-12 translate-x-32"></div>
         
         <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold mb-4">Guest Reviews</h2>
             <p className="text-gray-400 max-w-2xl mx-auto">See what our guests have to say about their stay at BookInn Hub.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { name: "Sarah Johnson", role: "Business Traveler", text: "Absolutely stunning hotel. The service was impeccable and the room was pure luxury. The WiFi speed was perfect for my meetings." },
               { name: "Michael Chen", role: "Vacation", text: "The best hotel experience I've ever had. The booking process was so smooth, and the view from the Deluxe Suite was breathtaking." },
               { name: "Emma Davis", role: "Weekend Getaway", text: "A hidden gem. Quiet, beautiful, and close to everything. The staff went above and beyond to make our anniversary special." }
             ].map((review, i) => (
               <div key={i} className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300">
                 <div className="flex text-yellow-400 mb-6">
                   {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                 </div>
                 <p className="text-gray-300 mb-8 italic leading-relaxed">"{review.text}"</p>
                 <div className="flex items-center">
                   <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                     {review.name.charAt(0)}
                   </div>
                   <div className="ml-4">
                     <h4 className="font-bold text-white">{review.name}</h4>
                     <p className="text-xs text-gray-400 uppercase tracking-wide">{review.role}</p>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </section>

      {/* Pre-Footer CTA */}
      <section className="relative py-32 flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0 z-0">
           <img 
            src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover" 
            alt="Poolside"
           />
           <div className="absolute inset-0 bg-blue-900/80 mix-blend-multiply"></div>
           <div className="absolute inset-0 bg-black/30"></div>
         </div>
         
         <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
           <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready for an Unforgettable Stay?</h2>
           <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto font-light">
             Book your room today and experience the pinnacle of hospitality. 
             Your perfect getaway is just a click away.
           </p>
           <Link 
            to="/rooms" 
            className="inline-flex items-center px-10 py-5 bg-white text-blue-900 text-lg font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl hover:shadow-white/20"
           >
             Check Availability <ArrowRight className="ml-2 h-5 w-5" />
           </Link>
         </div>
      </section>
    </div>
  );
};

export default Home;