import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MapPin, Bell, User, ChevronDown, Sun, Moon, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setUserMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#244855]/98 backdrop-blur-md shadow-force-lg' : 'bg-[#244855]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-[#E64833] rounded-xl flex items-center justify-center shadow-accent group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-xl font-bold text-white font-display tracking-tight">Force</span>
              <span className="text-xl font-bold text-[#E64833] font-display">1</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] flex items-center ${
                  isActive(link.to)
                    ? 'bg-white/15 text-white'
                    : 'text-[#90AEAD] hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg text-[#90AEAD] hover:text-white hover:bg-white/10 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all min-h-[44px]"
                >
                  <div className="w-7 h-7 rounded-full bg-[#E64833] text-white font-bold text-[10px] flex items-center justify-center border-2 border-white/20 flex-shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <div className="text-sm font-semibold text-white leading-tight">{user.name.split(' ')[0]}</div>
                    <div className="text-xs text-[#90AEAD] capitalize">{user.role}</div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#90AEAD] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-[#1a2d38] rounded-2xl shadow-card-hover border border-[#90AEAD]/20 overflow-hidden animate-scale-in">
                    <div className="p-3 bg-[#244855]/5 border-b border-[#90AEAD]/20">
                      <p className="text-sm font-semibold text-[#244855] dark:text-white">{user.name}</p>
                      <p className="text-xs text-[#90AEAD]">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[#244855] dark:text-white hover:bg-[#244855]/10 transition-all text-sm">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link to="/dashboard/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[#244855] dark:text-white hover:bg-[#244855]/10 transition-all text-sm">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[#E64833] hover:bg-[#E64833]/10 transition-all text-sm">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#FBE9D0] hover:text-white hover:bg-white/10 transition-all min-h-[44px] flex items-center">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2.5 bg-[#E64833] hover:bg-[#cc3d29] rounded-xl text-sm font-semibold text-white transition-all shadow-accent min-h-[44px] flex items-center">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(o => !o)}
            className="md:hidden p-2.5 rounded-xl text-[#90AEAD] hover:text-white hover:bg-white/10 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1a3340] border-t border-white/10 animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all min-h-[44px] flex items-center ${
                  isActive(link.to) ? 'bg-white/15 text-white' : 'text-[#90AEAD] hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <button onClick={toggleTheme} className="flex items-center gap-2 px-4 py-3 rounded-xl text-[#90AEAD] hover:text-white hover:bg-white/10 transition-all text-sm">
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="block px-4 py-3 bg-white/10 rounded-xl text-white font-medium text-sm min-h-[44px] flex items-center">
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="w-full px-4 py-3 bg-[#E64833]/20 rounded-xl text-[#E64833] font-medium text-sm min-h-[44px] flex items-center">
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-3 bg-white/10 rounded-xl text-white font-medium text-sm text-center min-h-[44px] flex items-center justify-center">Login</Link>
                  <Link to="/register" className="block px-4 py-3 bg-[#E64833] rounded-xl text-white font-semibold text-sm text-center min-h-[44px] flex items-center justify-center">Get Started Free</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
