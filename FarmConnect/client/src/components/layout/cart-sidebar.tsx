import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CartItemWithProduct, DiscountCode } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);

  const { data: cartItems = [], isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ['/api/cart', user?.uid],
    enabled: !!user?.uid,
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      return await apiRequest('PUT', `/api/cart/${itemId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', user?.uid] });
    }
  });

  const removeCartMutation = useMutation({
    mutationFn: async (itemId: string) => {
      return await apiRequest('DELETE', `/api/cart/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', user?.uid] });
      toast({ title: "Item removed from cart" });
    }
  });

  const applyDiscountMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest('GET', `/api/discount/${code}`);
      return response.json();
    },
    onSuccess: (discountData: DiscountCode) => {
      setAppliedDiscount(discountData);
      toast({ title: "Discount applied successfully!" });
    },
    onError: () => {
      toast({ title: "Invalid or expired discount code", variant: "destructive" });
    }
  });

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.product.price);
    const discountedPrice = item.product.discount > 0 
      ? price * (1 - item.product.discount / 100)
      : price;
    return sum + (discountedPrice * item.quantity);
  }, 0);

  const shipping = subtotal > 50000 ? 0 : 5000; // Free shipping over 50,000 shs
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.discount / 100) : 0;
  const total = subtotal + shipping - discountAmount;

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeCartMutation.mutate(itemId);
    } else {
      updateCartMutation.mutate({ itemId, quantity: newQuantity });
    }
  };

  const handleApplyDiscount = () => {
    if (discountCode.trim()) {
      applyDiscountMutation.mutate(discountCode.trim());
    }
  };

  return (
    <div 
      className={cn(
        "fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform transition-transform z-50",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
      data-testid="cart-sidebar"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900" data-testid="cart-title">Shopping Cart</h2>
          <Button variant="ghost" size="sm" onClick={onClose} data-testid="close-cart">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="text-center py-8" data-testid="cart-loading">Loading cart...</div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500" data-testid="empty-cart">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const price = parseFloat(item.product.price);
                const discountedPrice = item.product.discount > 0 
                  ? price * (1 - item.product.discount / 100)
                  : price;

                return (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg" data-testid={`cart-item-${item.id}`}>
                    <img 
                      src={item.product.image || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"} 
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      data-testid={`cart-item-image-${item.id}`}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900" data-testid={`cart-item-name-${item.id}`}>{item.product.name}</h3>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-600" data-testid={`cart-item-price-${item.id}`}>
                          {Math.round(discountedPrice).toLocaleString()} shs
                          {item.product.discount > 0 && (
                            <span className="text-xs text-gray-400 line-through ml-1">
                              {Math.round(price).toLocaleString()} shs
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          data-testid={`decrease-quantity-${item.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-medium w-8 text-center" data-testid={`cart-item-quantity-${item.id}`}>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          data-testid={`increase-quantity-${item.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => removeCartMutation.mutate(item.id)}
                      data-testid={`remove-item-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="mt-6 p-4 bg-primary bg-opacity-5 rounded-lg" data-testid="discount-section">
              <h3 className="font-medium text-gray-900 mb-3">Discount Code</h3>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Enter code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  data-testid="discount-input"
                />
                <Button 
                  onClick={handleApplyDiscount}
                  disabled={applyDiscountMutation.isPending}
                  data-testid="apply-discount"
                >
                  Apply
                </Button>
              </div>
              {appliedDiscount && (
                <p className="text-sm text-green-600 mt-2" data-testid="applied-discount">
                  {appliedDiscount.discount}% discount applied!
                </p>
              )}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6" data-testid="cart-summary">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span data-testid="subtotal">{Math.round(subtotal).toLocaleString()} shs</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span data-testid="shipping">
                  {shipping === 0 ? "Free" : `${Math.round(shipping).toLocaleString()} shs`}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span data-testid="discount">-{Math.round(discountAmount).toLocaleString()} shs</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span>
                <span data-testid="total">{Math.round(total).toLocaleString()} shs</span>
              </div>
            </div>
            <Button className="w-full" size="lg" data-testid="checkout-button">
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
