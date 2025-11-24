import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, User, Hotel, Search } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    closeMenu();
  };

  const isActive = (path: string) => location.pathname === path ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
              <Hotel className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">BookInn Hub</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/rooms" className={isActive('/rooms')}>Rooms</Link>
            <Link to="/find-booking" className={isActive('/find-booking')}>Find Booking</Link>
            
            {isAuthenticated && isAdmin && (
              <div className="relative group h-full flex items-center">
                <button className="text-gray-600 hover:text-blue-600 flex items-center h-full">
                  Admin <span className="ml-1">▾</span>
                </button>
                {/* 
                  Dropdown wrapper with top-full positioning and padding-top (pt-2).
                  The padding acts as an invisible bridge so the mouse doesn't leave the hover area 
                  when moving from the button to the menu.
                */}
                <div className="absolute left-0 top-full w-48 pt-2 hidden group-hover:block">
                  <div className="bg-white rounded-md shadow-lg py-1 border border-gray-100">
                    <Link to="/admin/rooms" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage Rooms</Link>
                    <Link to="/admin/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage Bookings</Link>
                    <Link to="/admin/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage Users</Link>
                  </div>
                </div>
              </div>
            )}

            {isAuthenticated ? (
              <>
                <Link to="/profile" className={isActive('/profile')}>Profile</Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Register</Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Home</Link>
            <Link to="/rooms" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Rooms</Link>
            <Link to="/find-booking" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Find Booking</Link>
            {isAuthenticated && (
              <>
                <Link to="/profile" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Profile</Link>
                 {isAdmin && (
                   <>
                    <Link to="/admin/rooms" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Admin: Rooms</Link>
                    <Link to="/admin/bookings" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Admin: Bookings</Link>
                    <Link to="/admin/users" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Admin: Users</Link>
                   </>
                 )}
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
              </>
            )}
            {!isAuthenticated && (
              <>
                 <Link to="/login" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Login</Link>
                 <Link to="/register" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;