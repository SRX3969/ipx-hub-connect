import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import AnimatedBackground from '@/components/AnimatedBackground';
import { 
  FiClock, 
  FiUser, 
  FiMapPin, 
  FiPlus, 
  FiCheck,
  FiCalendar,
  FiStar,
  FiTrendingUp
} from 'react-icons/fi';

interface Session {
  id: string;
  title: string;
  speaker: string;
  time: string;
  duration: string;
  track: string;
  location: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  isAdded?: boolean;
}

const Agenda = () => {
  const [sessions] = useState<Session[]>([
    {
      id: '1',
      title: 'Building Scalable AI Applications',
      speaker: 'Dr. Sarah Chen',
      time: '09:00 AM',
      duration: '45 min',
      track: 'AI/ML',
      location: 'Main Hall',
      description: 'Learn how to build and deploy scalable AI applications in production',
      level: 'Advanced',
      tags: ['AI', 'Machine Learning', 'Cloud'],
    },
    {
      id: '2',
      title: 'Introduction to Web3 Development',
      speaker: 'Alex Thompson',
      time: '10:00 AM',
      duration: '60 min',
      track: 'Blockchain',
      location: 'Room A',
      description: 'Get started with Web3 development and smart contracts',
      level: 'Beginner',
      tags: ['Blockchain', 'Web3', 'Solidity'],
    },
    {
      id: '3',
      title: 'Modern Frontend Architecture',
      speaker: 'Maria Rodriguez',
      time: '11:30 AM',
      duration: '45 min',
      track: 'Frontend',
      location: 'Room B',
      description: 'Best practices for building modern frontend applications',
      level: 'Intermediate',
      tags: ['React', 'TypeScript', 'Architecture'],
    },
    {
      id: '4',
      title: 'DevOps Best Practices',
      speaker: 'John Mitchell',
      time: '02:00 PM',
      duration: '60 min',
      track: 'DevOps',
      location: 'Main Hall',
      description: 'CI/CD pipelines and infrastructure as code',
      level: 'Intermediate',
      tags: ['DevOps', 'CI/CD', 'Docker'],
    },
    {
      id: '5',
      title: 'Cybersecurity in 2024',
      speaker: 'Emily Watson',
      time: '03:30 PM',
      duration: '45 min',
      track: 'Security',
      location: 'Room C',
      description: 'Latest trends and threats in cybersecurity',
      level: 'Advanced',
      tags: ['Security', 'Privacy', 'Encryption'],
    },
  ]);

  const [personalAgenda, setPersonalAgenda] = useState<string[]>(() => {
    const saved = localStorage.getItem('personalAgenda');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTrack, setActiveTrack] = useState('all');
  const tracks = ['all', 'AI/ML', 'Blockchain', 'Frontend', 'DevOps', 'Security'];

  useEffect(() => {
    localStorage.setItem('personalAgenda', JSON.stringify(personalAgenda));
  }, [personalAgenda]);

  const toggleSession = (sessionId: string) => {
    setPersonalAgenda(prev => {
      if (prev.includes(sessionId)) {
        toast({
          title: "Removed from agenda",
          description: "Session removed from your personal agenda",
        });
        return prev.filter(id => id !== sessionId);
      } else {
        toast({
          title: "Added to agenda",
          description: "Session added to your personal agenda",
        });
        return [...prev, sessionId];
      }
    });
  };

  const addToCalendar = (session: Session) => {
    const event = {
      text: session.title,
      details: session.description,
      location: session.location,
      startDate: new Date().toISOString().split('T')[0] + 'T' + convertTo24Hour(session.time),
      duration: session.duration,
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.text)}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
    
    toast({
      title: "Opening Google Calendar",
      description: "Add this session to your calendar",
    });
  };

  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }
    return `${hours}:${minutes}:00`;
  };

  const filteredSessions = activeTrack === 'all' 
    ? sessions 
    : sessions.filter(s => s.track === activeTrack);

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'Beginner': return 'bg-green-500/20 text-green-500';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-500';
      case 'Advanced': return 'bg-red-500/20 text-red-500';
      default: return '';
    }
  };

  const getTrackIcon = (track: string) => {
    switch(track) {
      case 'AI/ML': return '🤖';
      case 'Blockchain': return '⛓️';
      case 'Frontend': return '🎨';
      case 'DevOps': return '⚙️';
      case 'Security': return '🔒';
      default: return '📚';
    }
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 gradient-text">Event Agenda</h1>
          <p className="text-muted-foreground">
            Browse sessions and build your personalized schedule
          </p>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="glass border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FiTrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>AI Recommendations</CardTitle>
              </div>
              <CardDescription>
                Sessions recommended based on your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {sessions.slice(0, 3).map(session => (
                  <Badge key={session.id} variant="outline" className="cursor-pointer hover:bg-primary/10">
                    <FiStar className="mr-1 h-3 w-3" />
                    {session.title}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Track Filter */}
        <Tabs value={activeTrack} onValueChange={setActiveTrack} className="mb-8">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 glass">
            {tracks.map(track => (
              <TabsTrigger key={track} value={track} className="capitalize">
                {track === 'all' ? 'All Tracks' : track}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Sessions Grid */}
        <div className="grid gap-6">
          {filteredSessions.map((session, index) => {
            const isInAgenda = personalAgenda.includes(session.id);
            
            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`glass hover-lift ${isInAgenda ? 'border-primary' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getTrackIcon(session.track)}</span>
                          <Badge variant="outline">{session.track}</Badge>
                          <Badge className={getLevelColor(session.level)} variant="outline">
                            {session.level}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{session.title}</CardTitle>
                        <CardDescription className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FiUser className="h-4 w-4" />
                            <span>{session.speaker}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <FiClock className="h-4 w-4" />
                              {session.time}
                            </span>
                            <span className="text-sm">({session.duration})</span>
                            <span className="flex items-center gap-1">
                              <FiMapPin className="h-4 w-4" />
                              {session.location}
                            </span>
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={isInAgenda ? "default" : "outline"}
                          size="icon"
                          onClick={() => toggleSession(session.id)}
                          className="hover-lift"
                        >
                          {isInAgenda ? <FiCheck /> : <FiPlus />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => addToCalendar(session)}
                          className="hover-lift"
                        >
                          <FiCalendar />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">{session.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {session.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Personal Agenda Summary */}
        {personalAgenda.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Card className="glass shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FiCheck className="text-green-500" />
                  <span className="font-medium">
                    {personalAgenda.length} sessions in your agenda
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Agenda;