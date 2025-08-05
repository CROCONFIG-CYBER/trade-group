import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Leaf } from "lucide-react";

export default function Login() {
  const { login, signup } = useAuth();
  const { toast } = useToast();
  
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });
  
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer"
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(loginForm.email, loginForm.password);
      toast({ title: "Welcome back!" });
    } catch (error: any) {
      toast({ 
        title: "Login failed", 
        description: error.message || "Please check your credentials",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupForm.password !== signupForm.confirmPassword) {
      toast({ 
        title: "Passwords don't match", 
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await signup(signupForm.email, signupForm.password, signupForm.name, signupForm.role);
      toast({ title: "Account created successfully!" });
    } catch (error: any) {
      toast({ 
        title: "Signup failed", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-green-600 flex items-center justify-center p-4" data-testid="login-page">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="text-primary text-2xl" />
            <span className="text-xl font-bold text-gray-900">Uganda FarmMarket</span>
          </div>
          <CardTitle data-testid="auth-title">Welcome to Uganda FarmMarket</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-4" data-testid="auth-tabs">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-testid="login-tab">Sign In</TabsTrigger>
              <TabsTrigger value="signup" data-testid="signup-tab">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" data-testid="login-form">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    required
                    data-testid="login-email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    required
                    data-testid="login-password"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full hover:bg-green-600"
                  disabled={isLoading}
                  data-testid="login-submit"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" data-testid="signup-form">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                    data-testid="signup-name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    required
                    data-testid="signup-email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <Select 
                    value={signupForm.role} 
                    onValueChange={(value) => setSignupForm(prev => ({ ...prev, role: value }))}
                    data-testid="signup-role"
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="seller">Seller</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Create a password"
                    required
                    data-testid="signup-password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm your password"
                    required
                    data-testid="signup-confirm-password"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full hover:bg-green-600"
                  disabled={isLoading}
                  data-testid="signup-submit"
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
