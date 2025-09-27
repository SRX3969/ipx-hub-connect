import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import AnimatedBackground from '@/components/AnimatedBackground';
import { FiCalendar, FiClock, FiMapPin, FiPlus, FiUsers } from 'react-icons/fi';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  organizer: string;
  attendees: number;
  category: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('events');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'Opening Ceremony',
        date: '2024-03-15',
        time: '08:00 AM',
        location: 'Main Auditorium',
        description: 'Kick off the hackathon with keynote speakers and team formation',
        organizer: 'IPX Hub Team',
        attendees: 250,
        category: 'Main Event',
      },
      {
        id: '2',
        title: 'Midnight Coding Challenge',
        date: '2024-03-15',
        time: '12:00 AM',
        location: 'Coding Arena',
        description: 'Test your skills in this intense midnight coding competition',
        organizer: 'Tech Club',
        attendees: 80,
        category: 'Competition',
      },
      {
        id: '3',
        title: 'AI Workshop',
        date: '2024-03-16',
        time: '02:00 PM',
        location: 'Workshop Room A',
        description: 'Hands-on workshop on building AI applications',
        organizer: 'AI Community',
        attendees: 45,
        category: 'Workshop',
      },
    ];
  });

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: 'Workshop',
  });

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const event: Event = {
      id: Date.now().toString(),
      ...newEvent,
      organizer: 'You',
      attendees: 0,
    };

    setEvents(prev => [...prev, event]);
    setShowAddDialog(false);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      category: 'Workshop',
    });

    toast({
      title: "Event Created",
      description: "Your event has been added successfully",
    });
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Main Event': return 'bg-purple-500/20 text-purple-500';
      case 'Competition': return 'bg-red-500/20 text-red-500';
      case 'Workshop': return 'bg-blue-500/20 text-blue-500';
      case 'Networking': return 'bg-green-500/20 text-green-500';
      default: return 'bg-gray-500/20 text-gray-500';
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
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text">Events</h1>
              <p className="text-muted-foreground">
                Discover and create hackathon events
              </p>
            </div>
            
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button variant="gradient" className="hover-lift">
                  <FiPlus className="mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="glass">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Add a new event to the hackathon schedule
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter event title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="time">Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Enter location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      className="w-full px-3 py-2 rounded-lg bg-background border border-input"
                      value={newEvent.category}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="Workshop">Workshop</option>
                      <option value="Competition">Competition</option>
                      <option value="Networking">Networking</option>
                      <option value="Main Event">Main Event</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter event description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  
                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={handleAddEvent}
                  >
                    Create Event
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass hover-lift h-full">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getCategoryColor(event.category)} variant="outline">
                      {event.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <FiUsers className="h-4 w-4" />
                      {event.attendees}
                    </div>
                  </div>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <FiCalendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FiClock className="h-4 w-4" />
                      {event.time}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <FiMapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {event.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Organized by {event.organizer}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;