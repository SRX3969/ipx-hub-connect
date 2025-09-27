import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnimatedBackground from '@/components/AnimatedBackground';
import { toast } from '@/hooks/use-toast';
import { 
  FiUsers, 
  FiCheckCircle, 
  FiClock, 
  FiDownload,
  FiTrendingUp,
  FiPieChart,
  FiActivity
} from 'react-icons/fi';

interface UserData {
  id: string;
  name: string;
  email: string;
  mobile: string;
  type: 'professional' | 'student';
  registrationId: string;
  checkedIn: boolean;
  company?: string;
  college?: string;
}

const Admin = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState({
    totalRegistrants: 0,
    checkedIn: 0,
    professionals: 0,
    students: 0,
  });

  useEffect(() => {
    // Load users from localStorage
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      setUsers(parsedUsers);
      
      // Calculate stats
      setStats({
        totalRegistrants: parsedUsers.length,
        checkedIn: parsedUsers.filter((u: UserData) => u.checkedIn).length,
        professionals: parsedUsers.filter((u: UserData) => u.type === 'professional').length,
        students: parsedUsers.filter((u: UserData) => u.type === 'student').length,
      });
    }
  }, []);

  const exportData = () => {
    const csvContent = [
      ['Name', 'Email', 'Mobile', 'Type', 'Registration ID', 'Checked In', 'Organization'].join(','),
      ...users.map(user => [
        user.name,
        user.email,
        user.mobile,
        user.type,
        user.registrationId,
        user.checkedIn ? 'Yes' : 'No',
        user.company || user.college || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ipx-hub-registrants.csv';
    a.click();

    toast({
      title: "Export Successful",
      description: "Registrant data has been exported",
    });
  };

  const statCards = [
    {
      title: 'Total Registrants',
      value: stats.totalRegistrants,
      icon: FiUsers,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Checked In',
      value: stats.checkedIn,
      icon: FiCheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Professionals',
      value: stats.professionals,
      icon: FiActivity,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Students',
      value: stats.students,
      icon: FiPieChart,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold gradient-text">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage event registrations and analytics
              </p>
            </div>
            <Button variant="gradient" onClick={exportData} className="hover-lift">
              <FiDownload className="mr-2" />
              Export Data
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {stat.title}
                          </p>
                          <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                          <Icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Check-in Progress */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="glass">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FiTrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle>Check-in Progress</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">
                      {stats.totalRegistrants > 0 
                        ? Math.round((stats.checkedIn / stats.totalRegistrants) * 100) 
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: stats.totalRegistrants > 0 
                          ? `${(stats.checkedIn / stats.totalRegistrants) * 100}%` 
                          : '0%' 
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{stats.checkedIn} checked in</span>
                    <span>{stats.totalRegistrants - stats.checkedIn} remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Registrants Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle>All Registrants</CardTitle>
                <CardDescription>
                  Complete list of event registrants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="grid w-full grid-cols-3 glass">
                    <TabsTrigger value="all">All ({users.length})</TabsTrigger>
                    <TabsTrigger value="checkedin">
                      Checked In ({users.filter(u => u.checkedIn).length})
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                      Pending ({users.filter(u => !u.checkedIn).length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4">
                    <UserTable users={users} />
                  </TabsContent>
                  <TabsContent value="checkedin" className="mt-4">
                    <UserTable users={users.filter(u => u.checkedIn)} />
                  </TabsContent>
                  <TabsContent value="pending" className="mt-4">
                    <UserTable users={users.filter(u => !u.checkedIn)} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const UserTable: React.FC<{ users: UserData[] }> = ({ users }) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No registrants found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Registration ID</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {user.type}
                </Badge>
              </TableCell>
              <TableCell>{user.company || user.college || 'N/A'}</TableCell>
              <TableCell className="font-mono text-xs">{user.registrationId}</TableCell>
              <TableCell>
                <Badge 
                  className={user.checkedIn 
                    ? 'bg-green-500/20 text-green-500' 
                    : 'bg-yellow-500/20 text-yellow-500'}
                  variant="outline"
                >
                  {user.checkedIn ? 'Checked In' : 'Pending'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Admin;