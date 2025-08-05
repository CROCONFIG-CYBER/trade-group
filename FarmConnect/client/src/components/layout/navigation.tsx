import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { CartItemWithProduct } from "@shared/schema";
import { Leaf, ShoppingCart, MessageCircle, Search } from "lucide-react";

interface NavigationProps {
  onCartClick: () => void;
  onChatClick: () => void;
  onRoleChange: (role: string) => void;
  currentRole: string;
}

export function Navigation({ onCartClick, onChatClick, onRoleChange, currentRole }: NavigationProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const { data: cartItems = [] } = useQuery<CartItemWithProduct[]>({
    queryKey: ['/api/cart', user?.uid],
    enabled: !!user?.uid,
  });

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50" data-testid="main-navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-4" data-testid="logo-link">
            <Leaf className="text-primary text-2xl" />
            <span className="text-xl font-bold text-gray-900">Uganda FarmMarket</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary transition-colors" data-testid="nav-products">
              Products
            </Link>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors" data-testid="nav-categories">
              Categories
            </a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors" data-testid="nav-about">
              About
            </a>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                {/* Role Switcher for Demo */}
                <Select value={currentRole} onValueChange={onRoleChange} data-testid="role-switcher">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer View</SelectItem>
                    <SelectItem value="seller">Seller Dashboard</SelectItem>
                    <SelectItem value="admin">Admin Panel</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                  onClick={onCartClick}
                  data-testid="cart-button"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 flex items-center justify-center p-0"
                      data-testid="cart-count"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                  onClick={onChatClick}
                  data-testid="chat-button"
                >
                  <MessageCircle className="h-5 w-5" />
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center p-0"
                    data-testid="chat-notifications"
                  >
                    2
                  </Badge>
                </Button>
                
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8" data-testid="user-avatar">
                    <AvatarImage src={user.uid ? `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32` : undefined} />
                    <AvatarFallback>{user.name?.[0] || user.email[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-700" data-testid="user-name">{user.name || user.email}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs p-0 h-auto text-gray-500 hover:text-gray-700"
                      onClick={logout}
                      data-testid="logout-button"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
