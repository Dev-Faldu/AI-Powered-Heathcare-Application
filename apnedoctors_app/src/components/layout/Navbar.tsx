import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, User, Activity, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/ui/Logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userData, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'AI Diagnosis', path: '/diagnosis' },
    { label: 'Find Doctors', path: '/doctors' },
    { label: 'Health Dashboard', path: '/health-dashboard', icon: <Activity className="mr-1 h-4 w-4" /> },
  ];

  if (userData?.role === 'doctor') {
    navLinks.push({ 
      label: 'Doctor Dashboard', 
      path: '/doctor-dashboard'
    });
  }

  return (
    <nav
      className={cn(
        'fixed w-full top-0 z-50 transition-all duration-300 backdrop-blur-lg',
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 shadow-subtle py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Logo 
            size={isScrolled ? 'sm' : 'md'} 
            className="transition-all duration-300"
            linkTo="/"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          <div className="hidden md:flex items-center space-x-1">
            <div className="hidden md:flex space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center',
                    isActive(link.path)
                      ? 'text-white bg-gradient-to-r from-medical-500 to-teal-500 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:text-medical-600 dark:hover:text-medical-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  {link.icon && link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
            
            <div className="ml-4 flex items-center space-x-2">
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 p-0">
                      <Avatar>
                        <AvatarImage src={currentUser.photoURL || undefined} />
                        <AvatarFallback className="bg-medical-100 text-medical-700">
                          {getInitials(currentUser.displayName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{currentUser.displayName || 'User'}</span>
                        <span className="text-xs text-gray-500 truncate">{currentUser.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(userData?.role === 'doctor' ? '/doctor-dashboard' : '/health-dashboard')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-700">
                      <User className="mr-1 h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm" className="glass-button text-sm font-medium flex items-center">
                      Get Started <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <button
            className="md:hidden text-gray-800 dark:text-gray-200 hover:text-medical-600 dark:hover:text-medical-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[62px] bg-white dark:bg-gray-900 z-40 animate-fade-in">
          <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 animate-fade-in-up flex items-center',
                  isActive(link.path)
                    ? 'text-white bg-gradient-to-r from-medical-500 to-teal-500'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon && link.icon}
                {link.label}
              </Link>
            ))}

            {currentUser ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-center space-x-4 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Avatar>
                    <AvatarImage src={currentUser.photoURL || undefined} />
                    <AvatarFallback className="bg-medical-100 text-medical-700">
                      {getInitials(currentUser.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{currentUser.displayName || 'User'}</div>
                    <div className="text-sm text-gray-500 truncate max-w-[200px]">{currentUser.email}</div>
                  </div>
                </div>
                
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 animate-fade-in-up"
                  style={{ animationDelay: '0.4s' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 animate-fade-in-up"
                  style={{ animationDelay: '0.5s' }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Link
                  to="/login"
                  className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base font-medium flex items-center justify-center py-3 px-4 rounded-lg animate-fade-in-up"
                  style={{ animationDelay: '0.4s' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="glass-button text-base font-medium flex items-center justify-center animate-fade-in-up"
                  style={{ animationDelay: '0.5s' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
