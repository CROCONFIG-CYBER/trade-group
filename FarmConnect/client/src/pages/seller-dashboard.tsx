import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Loading } from "@/components/ui/loading";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Product, OrderWithDetails } from "@shared/schema";
import { 
  DollarSign, 
  Package, 
  Clock, 
  Star, 
  Plus,
  ShoppingBag 
} from "lucide-react";

export default function SellerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    discount: "0"
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/sellers', user?.uid, 'products'],
    enabled: !!user?.uid,
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<OrderWithDetails[]>({
    queryKey: ['/api/orders', { sellerId: user?.uid }],
    enabled: !!user?.uid,
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      return await apiRequest('POST', '/api/products', {
        ...productData,
        sellerId: user?.uid,
        price: parseFloat(productData.price),
        quantity: parseInt(productData.quantity),
        discount: parseInt(productData.discount) || 0
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sellers', user?.uid, 'products'] });
      toast({ title: "Product added successfully!" });
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        quantity: "",
        discount: "0"
      });
    },
    onError: () => {
      toast({ title: "Failed to add product", variant: "destructive" });
    }
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.quantity) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    createProductMutation.mutate(newProduct);
  };

  // Calculate stats
  const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0);
  const activeProducts = products.filter(p => p.isActive).length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const avgRating = 4.8; // Mock rating

  const categories = ["vegetables", "fruits", "grains", "dairy"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'shipped': return 'bg-blue-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="seller-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="dashboard-title">
            Seller Dashboard
          </h1>
          <p className="text-gray-600" data-testid="dashboard-description">
            Manage your products, orders, and customer interactions
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Sales"
            value={`${Math.round(totalSales).toLocaleString()} shs`}
            icon={DollarSign}
            trend={{ value: "12.5%", isPositive: true }}
          />
          <StatsCard
            title="Active Products"
            value={activeProducts}
            icon={Package}
            iconBgColor="bg-amber-100"
            iconColor="text-amber-600"
          />
          <StatsCard
            title="Pending Orders"
            value={pendingOrders}
            icon={Clock}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          <StatsCard
            title="Customer Rating"
            value={avgRating.toFixed(1)}
            icon={Star}
          />
        </div>

        {/* Product Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add New Product */}
          <Card data-testid="add-product-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Add New Product
                <Button size="sm" className="hover:bg-green-600" data-testid="quick-add-button">
                  <Plus className="mr-2 h-4 w-4" />
                  Quick Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <Input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Organic Tomatoes"
                    required
                    data-testid="product-name-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Product description"
                    rows={3}
                    data-testid="product-description-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                      required
                      data-testid="product-price-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <Input
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, quantity: e.target.value }))}
                      placeholder="0"
                      required
                      data-testid="product-quantity-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <Select 
                    value={newProduct.category} 
                    onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}
                    data-testid="product-category-select"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount (%)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={newProduct.discount}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, discount: e.target.value }))}
                    placeholder="0"
                    data-testid="product-discount-input"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full hover:bg-green-600"
                  disabled={createProductMutation.isPending}
                  data-testid="add-product-submit"
                >
                  {createProductMutation.isPending ? "Adding..." : "Add Product"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card data-testid="recent-orders-card">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <Loading />
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500" data-testid="no-orders">
                  No orders yet
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div 
                      key={order.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      data-testid={`order-${order.id}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="text-primary h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900" data-testid={`order-id-${order.id}`}>
                            Order #{order.id.slice(-6)}
                          </p>
                          <p className="text-sm text-gray-600" data-testid={`order-details-${order.id}`}>
                            {order.quantity} items • {Math.round(parseFloat(order.totalPrice)).toLocaleString()} shs
                          </p>
                        </div>
                      </div>
                      <Badge 
                        className={`${getStatusColor(order.status)} text-white`}
                        data-testid={`order-status-${order.id}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              <Button 
                variant="outline" 
                className="w-full mt-4 hover:bg-gray-50"
                data-testid="view-all-orders"
              >
                View All Orders
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
