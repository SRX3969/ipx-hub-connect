import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuth } from '@/contexts/AuthContext';
import {
  FiSun,
  FiMoon,
  FiHome,
  FiCalendar,
  FiMessageSquare,
  FiCheckSquare,
  FiSettings,
  FiLogOut,
  FiUser,
  FiActivity,
} from 'react-icons/fi';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  // Navigation items visible only when logged in
  const navItems = user ? [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/agenda', label: 'Agenda', icon: FiCalendar },
    { path: '/events', label: 'Events', icon: FiActivity },
    { path: '/myevents', label: 'My Events', icon: FiCalendar },
    { path: '/chat', label: 'Chat', icon: FiMessageSquare },
    { path: '/checkin', label: 'Check-in', icon: FiCheckSquare },
  ] : [];

  if (user?.role === 'organizer') {
    navItems.push({ path: '/admin', label: 'Organizer', icon: FiSettings });
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 glass border-b border-border/40"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-xl">IPX</span>
            </motion.div>
            <span className="font-bold text-xl gradient-text">Hub</span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="relative group"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                      />
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover-lift"
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? <FiMoon className="h-5 w-5" /> : <FiSun className="h-5 w-5" />}
              </motion.div>
            </Button>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.registrationId}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="hover:text-destructive"
                >
                  <FiLogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="gradient">
                  <FiUser className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;