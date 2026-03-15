// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, LogOut, User, PlusCircle, Hexagon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../firebase/auth';
import toast from 'react-hot-toast';
import Avatar from '../common/Avatar';

const Navbar = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch {
      toast.error('Failed to log out');
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-surface-800 bg-surface-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Hexagon size={18} className="text-white" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-xl gradient-text hidden sm:block">
              QueryHive
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions, tags..."
                className="w-full pl-9 pr-4 py-2 bg-surface-900 border border-surface-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <>
                <Link to="/ask" className="btn-primary text-sm hidden sm:inline-flex">
                  <PlusCircle size={16} />
                  Ask
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-800 transition-colors"
                  >
                    <Avatar
                      src={currentUser.photoURL}
                      name={currentUser.displayName}
                      size="sm"
                    />
                  </button>
                  {dropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-52 bg-surface-900 border border-surface-700 rounded-xl shadow-2xl z-50 py-1 animate-fade-in">
                        <div className="px-3 py-2 border-b border-surface-800">
                          <p className="text-sm font-medium text-gray-200 truncate">
                            {userProfile?.displayName || currentUser.displayName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                        </div>
                        <Link
                          to={`/profile/${currentUser.uid}`}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-surface-800 hover:text-white transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <User size={14} />
                          Your Profile
                        </Link>
                        <Link
                          to="/ask"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-surface-800 hover:text-white transition-colors sm:hidden"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <PlusCircle size={14} />
                          Ask Question
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-surface-800 transition-colors"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/signup" className="btn-primary text-sm">Sign Up</Link>
              </>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="btn-ghost md:hidden p-2"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {menuOpen && (
          <div className="py-3 border-t border-surface-800 md:hidden animate-slide-up">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full pl-9 pr-4 py-2 bg-surface-900 border border-surface-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
