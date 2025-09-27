import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useAuth } from '@/contexts/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { 
  FiCalendar, 
  FiCheckCircle, 
  FiUsers, 
  FiCpu,
  FiZap,
  FiShield,
  FiArrowRight,
  FiStar,
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiBook,
  FiMessageSquare,
  FiCheck,
  FiCheckSquare
} from 'react-icons/fi';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: FiCalendar,
      title: "Personalized Agenda",
      description: "AI-powered session recommendations tailored to your interests",
      gradient: "from-primary to-secondary",
    },
    {
      icon: FiCheckCircle,
      title: "Seamless Check-in",
      description: "QR code-based instant check-in system for hassle-free entry",
      gradient: "from-secondary to-accent",
    },
    {
      icon: FiUsers,
      title: "Smart Networking",
      description: "Connect with like-minded participants using AI matching",
      gradient: "from-accent to-primary",
    },
    {
      icon: FiCpu,
      title: "AI Concierge",
      description: "24/7 intelligent assistant for all your event queries",
      gradient: "from-primary to-accent",
    },
    {
      icon: FiZap,
      title: "Real-time Updates",
      description: "Instant notifications for schedule changes and announcements",
      gradient: "from-secondary to-primary",
    },
    {
      icon: FiShield,
      title: "Secure Platform",
      description: "Enterprise-grade security for your data and privacy",
      gradient: "from-primary to-secondary",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  // Show personalized dashboard for logged-in users
  if (user) {
    return (
      <div className="min-h-screen p-8">
        <AnimatedBackground />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto relative z-10"
        >
          {/* Welcome Header */}
          <h1 className="text-4xl font-bold mb-2">
            Welcome, {user.name}!
          </h1>
          <p className="text-muted-foreground mb-8">Your intelligent event companion</p>

          {/* Profile and QR Code Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Profile Card */}
            <Card className="lg:col-span-2 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiUser className="h-5 w-5" />
                  Profile Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="font-medium capitalize">{user.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {user.role === 'student' ? 'College' : 'Organization'}
                      </p>
                      <p className="font-medium">{user.college || user.company || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium flex items-center gap-2">
                        <FiMail className="h-4 w-4" />
                        {user.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mobile</p>
                      <p className="font-medium flex items-center gap-2">
                        <FiPhone className="h-4 w-4" />
                        {user.mobile}
                      </p>
                    </div>
                    {user.role === 'student' && user.year && (
                      <div>
                        <p className="text-sm text-muted-foreground">Year</p>
                        <p className="font-medium">{user.year}</p>
                      </div>
                    )}
                    {user.role === 'professional' && user.designation && (
                      <div>
                        <p className="text-sm text-muted-foreground">Designation</p>
                        <p className="font-medium">{user.designation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Card */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-center">Registration QR</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg mb-4">
                  <QRCodeSVG value={user.registrationId} size={150} />
                </div>
                <p className="text-sm font-mono font-medium text-center">{user.registrationId}</p>
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">Check-in Status</p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    {user.checkedIn ? (
                      <>
                        <FiCheck className="h-4 w-4 text-accent" />
                        <span className="text-accent font-medium">Checked In</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">Not Checked In</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/myevents">
              <Card className="hover-lift cursor-pointer h-full">
                <CardContent className="p-6">
                  <FiCalendar className="h-8 w-8 mb-3 text-primary" />
                  <h3 className="font-semibold mb-1">My Events</h3>
                  <p className="text-sm text-muted-foreground">View your saved sessions</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/agenda">
              <Card className="hover-lift cursor-pointer h-full">
                <CardContent className="p-6">
                  <FiBook className="h-8 w-8 mb-3 text-secondary" />
                  <h3 className="font-semibold mb-1">Browse Agenda</h3>
                  <p className="text-sm text-muted-foreground">Explore all sessions</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/chat">
              <Card className="hover-lift cursor-pointer h-full">
                <CardContent className="p-6">
                  <FiMessageSquare className="h-8 w-8 mb-3 text-accent" />
                  <h3 className="font-semibold mb-1">Group Chat</h3>
                  <p className="text-sm text-muted-foreground">Connect with attendees</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/checkin">
              <Card className="hover-lift cursor-pointer h-full">
                <CardContent className="p-6">
                  <FiCheckSquare className="h-8 w-8 mb-3 text-primary" />
                  <h3 className="font-semibold mb-1">Check-in</h3>
                  <p className="text-sm text-muted-foreground">
                    {user.checkedIn ? 'Already checked in' : 'Complete check-in'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Public homepage for non-logged-in users
  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <FiStar className="mr-2 text-primary" />
            <span className="text-sm font-medium">Welcome to the Future of Events</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="gradient-text">IPX Hub</span>
          </motion.h1>
          
          <motion.p
            className="text-2xl md:text-3xl mb-4 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Your Intelligent Event Companion
          </motion.p>
          
          <motion.p
            className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Experience hackathons like never before with AI-powered personalization, 
            seamless networking, and intelligent event management
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/auth">
              <Button variant="hero" size="xl" className="group apple-button">
                Register Now
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="glass" size="xl" className="apple-button">
                <FiUser className="mr-2" />
                Login
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {[
              { value: "500+", label: "Participants" },
              { value: "50+", label: "Sessions" },
              { value: "24/7", label: "AI Support" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="glass rounded-xl p-6"
              >
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Intelligent Features for Smart Events
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass rounded-xl p-6 hover-lift group cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container mx-auto"
        >
          <div className="glass rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Event Experience?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of participants already using IPX Hub for smarter, 
              more connected hackathon experiences
            </p>
            <Link to="/auth">
              <Button variant="hero" size="xl" className="apple-button">
                Get Started Now
                <FiArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;