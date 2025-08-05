import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { Navigation } from "@/components/layout/navigation";
import { CartSidebar } from "@/components/layout/cart-sidebar";
import { ChatModal } from "@/components/layout/chat-modal";
import { PageLoading } from "@/components/ui/loading";
import Home from "@/pages/home";
import SellerDashboard from "@/pages/seller-dashboard";
import AdminPanel from "@/pages/admin-panel";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";

function AppContent() {
  const { user, loading } = useAuth();
  const [currentRole, setCurrentRole] = useState("customer");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (loading) {
    return <PageLoading />;
  }

  if (!user) {
    return <Login />;
  }

  const renderCurrentView = () => {
    switch (currentRole) {
      case "seller":
        return <SellerDashboard />;
      case "admin":
        return <AdminPanel />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        onCartClick={() => setIsCartOpen(true)}
        onChatClick={() => setIsChatOpen(true)}
        onRoleChange={setCurrentRole}
        currentRole={currentRole}
      />
      
      <Switch>
        <Route path="/" component={() => renderCurrentView()} />
        <Route component={NotFound} />
      </Switch>

      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
      
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Overlay for mobile */}
      {(isCartOpen || isChatOpen) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => {
            setIsCartOpen(false);
            setIsChatOpen(false);
          }}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
