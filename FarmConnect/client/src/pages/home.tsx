import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "@/components/product/product-card";
import { Loading } from "@/components/ui/loading";
import { ProductWithSeller } from "@shared/schema";
import { Search, Filter } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const { data: products = [], isLoading } = useQuery<ProductWithSeller[]>({
    queryKey: ['/api/products', { search: searchQuery || undefined, category: selectedCategory !== 'all' ? selectedCategory : undefined }],
  });

  const categories = ["all", "vegetables", "fruits", "grains", "dairy"];
  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-10000", label: "Under 10,000 shs" },
    { value: "10000-25000", label: "10,000 - 25,000 shs" },
    { value: "25000-50000", label: "25,000 - 50,000 shs" },
    { value: "50000+", label: "Over 50,000 shs" }
  ];

  const filteredProducts = products.filter(product => {
    const price = parseFloat(product.price);
    const discountedPrice = product.discount > 0 
      ? price * (1 - product.discount / 100)
      : price;

    // Price range filter
    if (priceRange !== "all") {
      if (priceRange === "0-10000" && discountedPrice >= 10000) return false;
      if (priceRange === "10000-25000" && (discountedPrice < 10000 || discountedPrice >= 25000)) return false;
      if (priceRange === "25000-50000" && (discountedPrice < 25000 || discountedPrice >= 50000)) return false;
      if (priceRange === "50000+" && discountedPrice < 50000) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50" data-testid="home-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-green-600 text-white py-16" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6" data-testid="hero-title">
                Fresh Ugandan Produce Direct From Farm
              </h1>
              <p className="text-xl mb-8 opacity-90" data-testid="hero-description">
                Connect with local Ugandan farmers and get the freshest matooke, posho, milk and more delivered to your home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100"
                  data-testid="shop-now-button"
                >
                  Shop Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white text-white hover:bg-white hover:text-primary"
                  data-testid="become-seller-button"
                >
                  Become a Seller
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Fresh vegetables and fruits" 
                className="rounded-xl shadow-2xl"
                data-testid="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white py-8 shadow-sm" data-testid="search-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for fresh produce..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
                data-testid="search-input"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory} data-testid="category-filter">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priceRange} onValueChange={setPriceRange} data-testid="price-filter">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="hover:bg-green-600" data-testid="apply-filter">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16" data-testid="products-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="products-title">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto" data-testid="products-description">
              Discover fresh Ugandan produce from local farmers across Uganda - from Buganda's matooke to Ankole's fresh milk
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loading size="lg" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500" data-testid="no-products">
              No products found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
