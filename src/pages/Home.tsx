import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedBackground from '@/components/AnimatedBackground';
import { 
  FiCalendar, 
  FiCheckCircle, 
  FiUsers, 
  FiCpu,
  FiZap,
  FiShield,
  FiArrowRight,
  FiStar
} from 'react-icons/fi';

const Home = () => {
  const features = [
    {
      icon: FiCalendar,
      title: "Personalized Agenda",
      description: "AI-powered session recommendations tailored to your interests",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      icon: FiCheckCircle,
      title: "Seamless Check-in",
      description: "QR code-based instant check-in system for hassle-free entry",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: FiUsers,
      title: "Smart Networking",
      description: "Connect with like-minded participants using AI matching",
      gradient: "from-pink-500 to-red-500",
    },
    {
      icon: FiCpu,
      title: "AI Concierge",
      description: "24/7 intelligent assistant for all your event queries",
      gradient: "from-green-500 to-teal-500",
    },
    {
      icon: FiZap,
      title: "Real-time Updates",
      description: "Instant notifications for schedule changes and announcements",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: FiShield,
      title: "Secure Platform",
      description: "Enterprise-grade security for your data and privacy",
      gradient: "from-indigo-500 to-blue-500",
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
              <Button variant="hero" size="xl" className="group pulse-glow">
                Register Now
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/agenda">
              <Button variant="glass" size="xl">
                <FiCalendar className="mr-2" />
                View Agenda
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
              <Button variant="hero" size="xl">
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