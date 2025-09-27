import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { FiClock, FiMapPin, FiCalendar, FiTrash2 } from 'react-icons/fi';
import { toast } from '@/hooks/use-toast';

interface SavedEvent {
  id: string;
  title: string;
  speaker?: string;
  time: string;
  date?: string;
  location?: string;
  track?: string;
  description?: string;
  savedAt: string;
}

const MyEvents = () => {
  const { user } = useAuth();
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([]);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`userEvents_${user.id}`);
      if (stored) {
        setSavedEvents(JSON.parse(stored));
      }
    }
  }, [user]);

  const removeEvent = (eventId: string) => {
    const updated = savedEvents.filter(e => e.id !== eventId);
    setSavedEvents(updated);
    localStorage.setItem(`userEvents_${user?.id}`, JSON.stringify(updated));
    
    toast({
      title: "Event removed",
      description: "Event removed from your personal agenda",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <p className="text-muted-foreground">Please login to view your saved events</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 gradient-text">My Events</h1>
        
        {savedEvents.length === 0 ? (
          <Card className="p-12 text-center">
            <FiCalendar className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No saved events yet</h2>
            <p className="text-muted-foreground mb-6">
              Add events from the Agenda page to see them here
            </p>
            <Button
              onClick={() => window.location.href = '/agenda'}
              className="apple-button"
            >
              Browse Agenda
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover-lift h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg flex-1">{event.title}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEvent(event.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {event.speaker && (
                        <div className="text-muted-foreground">
                          Speaker: {event.speaker}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <FiClock className="h-4 w-4 text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                      {event.date && (
                        <div className="flex items-center gap-2">
                          <FiCalendar className="h-4 w-4 text-muted-foreground" />
                          <span>{event.date}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <FiMapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.track && (
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                            {event.track}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MyEvents;