import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import AnimatedBackground from '@/components/AnimatedBackground';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { FiCheckCircle, FiXCircle, FiCamera, FiHash } from 'react-icons/fi';

const CheckIn = () => {
  const { user, checkIn } = useAuth();
  const [registrationId, setRegistrationId] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<'success' | 'failed' | null>(null);

  const handleCheckIn = async () => {
    if (!registrationId.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your registration ID",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    setCheckInStatus(null);

    // Simulate API call
    setTimeout(() => {
      const success = checkIn(registrationId);
      
      if (success) {
        setCheckInStatus('success');
        toast({
          title: "Check-in Successful!",
          description: "Welcome to IPX Hub! Enjoy the event.",
        });
      } else {
        setCheckInStatus('failed');
        toast({
          title: "Check-in Failed",
          description: "Invalid registration ID. Please try again.",
          variant: "destructive",
        });
      }
      
      setIsChecking(false);
      setRegistrationId('');
    }, 1500);
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 gradient-text">Event Check-in</h1>
            <p className="text-muted-foreground">
              Check in to the event using your registration ID or QR code
            </p>
          </div>

          {/* Check-in Status Display */}
          {checkInStatus && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8"
            >
              <Card className={`glass border ${checkInStatus === 'success' ? 'border-green-500/50' : 'border-red-500/50'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center gap-4">
                    {checkInStatus === 'success' ? (
                      <>
                        <FiCheckCircle className="h-12 w-12 text-green-500" />
                        <div>
                          <h3 className="text-xl font-semibold text-green-500">Check-in Successful!</h3>
                          <p className="text-muted-foreground">You're all set for the event</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <FiXCircle className="h-12 w-12 text-red-500" />
                        <div>
                          <h3 className="text-xl font-semibold text-red-500">Check-in Failed</h3>
                          <p className="text-muted-foreground">Please verify your registration ID</p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* User's Check-in Status */}
          {user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Your Check-in Status</CardTitle>
                  <CardDescription>
                    Use your QR code or registration ID to check in
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Name</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Registration ID</p>
                        <p className="font-mono text-lg gradient-text">{user.registrationId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Status</p>
                        <Badge className={user.checkedIn ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}>
                          {user.checkedIn ? 'Checked In' : 'Not Checked In'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-center items-center">
                      <div className="bg-white p-4 rounded-lg">
                        <QRCode value={user.registrationId} size={150} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Check-in Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FiCamera className="h-5 w-5 text-primary" />
                  <CardTitle>Manual Check-in</CardTitle>
                </div>
                <CardDescription>
                  Enter your registration ID to check in to the event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="regId">Registration ID</Label>
                    <div className="relative">
                      <FiHash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="regId"
                        placeholder="Enter your registration ID"
                        value={registrationId}
                        onChange={(e) => setRegistrationId(e.target.value)}
                        className="pl-10"
                        onKeyPress={(e) => e.key === 'Enter' && handleCheckIn()}
                      />
                    </div>
                  </div>

                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={handleCheckIn}
                    disabled={isChecking}
                  >
                    {isChecking ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Checking in...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="mr-2" />
                        Check In Now
                      </>
                    )}
                  </Button>

                  <div className="text-center pt-4">
                    <p className="text-sm text-muted-foreground">
                      Show your QR code at the registration desk for quick check-in
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckIn;