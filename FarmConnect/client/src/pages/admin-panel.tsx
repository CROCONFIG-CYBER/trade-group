import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Loading } from "@/components/ui/loading";
import { 
  Users, 
  Store, 
  TrendingUp, 
  ShoppingCart,
  MoreVertical,
  Activity
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function AdminPanel() {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
  });

  // Mock data for demo
  const recentUsers = [
    {
      id: "1",
      name: "John Smith",
      role: "Seller",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"
    },
    {
      id: "2", 
      name: "Sarah Johnson",
      role: "Customer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b3c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"
    }
  ];

  const recentActivity = [
    { id: "1", message: "New seller registration", time: "2 minutes ago", type: "info" },
    { id: "2", message: "Product report submitted", time: "15 minutes ago", type: "warning" },
    { id: "3", message: "Payment processed", time: "1 hour ago", type: "success" }
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-primary';
      case 'warning': return 'bg-amber-500';
      case 'success': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="admin-title">
            Admin Panel
          </h1>
          <p className="text-gray-600" data-testid="admin-description">
            Platform management and analytics
          </p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={stats?.totalUsers || 1247}
            icon={Users}
            trend={{ value: "8.2%", isPositive: true }}
          />
          <StatsCard
            title="Active Sellers"
            value={stats?.totalSellers || 156}
            icon={Store}
            iconBgColor="bg-orange-100"
            iconColor="text-orange-600"
          />
          <StatsCard
            title="Total Revenue"
            value={`${Math.round(stats?.totalRevenue || 125000000).toLocaleString()} shs`}
            icon={TrendingUp}
            trend={{ value: "15.3%", isPositive: true }}
            iconBgColor="bg-amber-100"
            iconColor="text-amber-600"
          />
          <StatsCard
            title="Total Orders"
            value={stats?.totalOrders || 3428}
            icon={ShoppingCart}
          />
        </div>

        {/* Admin Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Management */}
          <Card data-testid="user-management-card">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    data-testid={`user-item-${user.id}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900" data-testid={`user-name-${user.id}`}>
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-600" data-testid={`user-role-${user.id}`}>
                          {user.role}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" data-testid={`user-menu-${user.id}`}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full mt-4 hover:bg-green-600"
                data-testid="manage-all-users"
              >
                Manage All Users
              </Button>
            </CardContent>
          </Card>

          {/* Platform Settings */}
          <Card data-testid="platform-settings-card">
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between" data-testid="commission-rate-setting">
                  <span className="text-gray-700">Commission Rate</span>
                  <span className="font-semibold text-gray-900">5%</span>
                </div>
                
                <div className="flex items-center justify-between" data-testid="seller-approval-setting">
                  <span className="text-gray-700">New Seller Approval</span>
                  <Switch defaultChecked data-testid="seller-approval-switch" />
                </div>
                
                <div className="flex items-center justify-between" data-testid="maintenance-mode-setting">
                  <span className="text-gray-700">Maintenance Mode</span>
                  <Switch data-testid="maintenance-mode-switch" />
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-6 hover:bg-gray-50"
                data-testid="advanced-settings"
              >
                Advanced Settings
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card data-testid="recent-activity-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="flex items-start space-x-3"
                    data-testid={`activity-item-${activity.id}`}
                  >
                    <div 
                      className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full mt-2`}
                      data-testid={`activity-indicator-${activity.id}`}
                    />
                    <div>
                      <p className="text-sm text-gray-900" data-testid={`activity-message-${activity.id}`}>
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-600" data-testid={`activity-time-${activity.id}`}>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-4 hover:bg-gray-50"
                data-testid="view-all-activity"
              >
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
