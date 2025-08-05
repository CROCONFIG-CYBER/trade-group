import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductWithSeller } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: ProductWithSeller;
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/cart', {
        userId: user?.uid,
        productId: product.id,
        quantity: 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', user?.uid] });
      toast({ title: "Added to cart successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to add to cart", variant: "destructive" });
    }
  });

  const handleAddToCart = () => {
    if (!user) {
      toast({ title: "Please log in to add items to cart", variant: "destructive" });
      return;
    }
    addToCartMutation.mutate();
  };

  const price = parseFloat(product.price);
  const discountedPrice = product.discount > 0 
    ? price * (1 - product.discount / 100)
    : price;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group" data-testid={`product-card-${product.id}`}>
      <img 
        src={product.image || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"} 
        alt={product.name}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
        data-testid={`product-image-${product.id}`}
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge 
            variant="secondary" 
            className="bg-primary text-white"
            data-testid={`product-category-${product.id}`}
          >
            {product.category}
          </Badge>
          {product.discount > 0 && (
            <Badge 
              variant="secondary" 
              className="bg-accent text-white"
              data-testid={`product-discount-${product.id}`}
            >
              {product.discount}% OFF
            </Badge>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 mb-2" data-testid={`product-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3" data-testid={`product-seller-${product.id}`}>
          From {product.seller.name}
        </p>
        {product.description && (
          <p className="text-gray-600 text-sm mb-3" data-testid={`product-description-${product.id}`}>
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900" data-testid={`product-price-${product.id}`}>
              {Math.round(discountedPrice).toLocaleString()} shs
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-500 line-through" data-testid={`product-original-price-${product.id}`}>
                {Math.round(price).toLocaleString()} shs
              </span>
            )}
          </div>
          <Button 
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending || product.quantity === 0}
            className="hover:bg-green-600"
            data-testid={`add-to-cart-${product.id}`}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
        {product.quantity === 0 && (
          <p className="text-red-500 text-sm mt-2" data-testid={`out-of-stock-${product.id}`}>
            Out of stock
          </p>
        )}
        {product.quantity > 0 && product.quantity < 10 && (
          <p className="text-amber-600 text-sm mt-2" data-testid={`low-stock-${product.id}`}>
            Only {product.quantity} left!
          </p>
        )}
      </div>
    </div>
  );
}
