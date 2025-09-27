import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import AnimatedBackground from '@/components/AnimatedBackground';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiBook, FiCheckCircle } from 'react-icons/fi';

const Auth = () => {
  const navigate = useNavigate();
  const { register, login, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('login');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    userType: 'professional',
    company: '',
    designation: '',
    college: '',
    degree: 'UG',
    year: '',
    foodChoice: 'veg',
    emergencyContact: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.mobile) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Create user object based on type
      const userData: any = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        type: formData.userType as 'professional' | 'student',
        foodChoice: formData.foodChoice,
        emergencyContact: formData.emergencyContact,
      };

      if (formData.userType === 'professional') {
        userData.company = formData.company;
        userData.designation = formData.designation;
      } else {
        userData.college = formData.college;
        userData.degree = formData.degree;
        userData.year = formData.year;
      }

      const newUser = register(userData);
      setRegisteredUser(newUser);
      setShowQR(true);

      toast({
        title: "Registration Successful!",
        description: `Your registration ID is ${newUser.registrationId}`,
      });

      // Mock email sending
      console.log('Sending confirmation email to:', formData.email);

    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === formData.email);

    if (foundUser) {
      login(foundUser);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      navigate('/');
    } else {
      toast({
        title: "Login Failed",
        description: "User not found. Please register first.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  if (showQR && registeredUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <AnimatedBackground />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10"
        >
          <Card className="w-full max-w-md glass">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <FiCheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Registration Complete!</CardTitle>
              <CardDescription>Save your QR code for event check-in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Registration ID</p>
                <p className="text-xl font-mono font-bold gradient-text">{registeredUser.registrationId}</p>
              </div>
              
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <QRCode value={registeredUser.registrationId} size={200} />
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {registeredUser.name}</p>
                <p><strong>Email:</strong> {registeredUser.email}</p>
                <p><strong>Type:</strong> {registeredUser.type}</p>
              </div>
              
              <Button
                variant="hero"
                className="w-full"
                onClick={() => navigate('/')}
              >
                Continue to Dashboard
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground />
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="glass">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl gradient-text">Welcome to IPX Hub</CardTitle>
            <CardDescription>Sign in or create your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* User Type Selection */}
                  <div className="space-y-2">
                    <Label>I am a</Label>
                    <RadioGroup
                      value={formData.userType}
                      onValueChange={(value) => handleInputChange('userType', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="professional" id="professional" />
                        <Label htmlFor="professional" className="cursor-pointer">
                          Professional
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="student" id="student" />
                        <Label htmlFor="student" className="cursor-pointer">
                          Student
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Common Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="John Doe"
                          className="pl-10"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          className="pl-10"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile *</Label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="mobile"
                          type="tel"
                          placeholder="+1234567890"
                          className="pl-10"
                          value={formData.mobile}
                          onChange={(e) => handleInputChange('mobile', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="food">Food Preference</Label>
                      <Select
                        value={formData.foodChoice}
                        onValueChange={(value) => handleInputChange('foodChoice', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="veg">Vegetarian</SelectItem>
                          <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                          <SelectItem value="vegan">Vegan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Professional Fields */}
                  <AnimatePresence mode="wait">
                    {formData.userType === 'professional' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <div className="relative">
                            <FiBriefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="company"
                              placeholder="Tech Corp"
                              className="pl-10"
                              value={formData.company}
                              onChange={(e) => handleInputChange('company', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="designation">Designation</Label>
                          <Input
                            id="designation"
                            placeholder="Software Engineer"
                            value={formData.designation}
                            onChange={(e) => handleInputChange('designation', e.target.value)}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Student Fields */}
                    {formData.userType === 'student' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="college">College</Label>
                          <div className="relative">
                            <FiBook className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="college"
                              placeholder="MIT"
                              className="pl-10"
                              value={formData.college}
                              onChange={(e) => handleInputChange('college', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="degree">Degree</Label>
                          <Select
                            value={formData.degree}
                            onValueChange={(value) => handleInputChange('degree', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UG">Undergraduate</SelectItem>
                              <SelectItem value="PG">Postgraduate</SelectItem>
                              <SelectItem value="PhD">PhD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="year">Year</Label>
                          <Input
                            id="year"
                            placeholder="3rd Year"
                            value={formData.year}
                            onChange={(e) => handleInputChange('year', e.target.value)}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    <Label htmlFor="emergency">Emergency Contact</Label>
                    <Input
                      id="emergency"
                      placeholder="+1234567890"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Registering...' : 'Register Now'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;