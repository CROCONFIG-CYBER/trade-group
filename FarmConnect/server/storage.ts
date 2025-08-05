import { 
  User, 
  Product, 
  Order, 
  CartItem, 
  ChatMessage, 
  DiscountCode,
  InsertUser, 
  InsertProduct, 
  InsertOrder, 
  InsertCartItem, 
  InsertChatMessage, 
  InsertDiscountCode,
  ProductWithSeller,
  OrderWithDetails,
  CartItemWithProduct
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Products
  getProducts(limit?: number): Promise<ProductWithSeller[]>;
  getProduct(id: string): Promise<ProductWithSeller | undefined>;
  getProductsBySeller(sellerId: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  searchProducts(query: string, category?: string): Promise<ProductWithSeller[]>;
  
  // Orders
  getOrders(): Promise<OrderWithDetails[]>;
  getOrdersByCustomer(customerId: string): Promise<OrderWithDetails[]>;
  getOrdersBySeller(sellerId: string): Promise<OrderWithDetails[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  
  // Cart
  getCartItems(userId: string): Promise<CartItemWithProduct[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(userId: string): Promise<boolean>;
  
  // Chat
  getChatMessages(senderId: string, receiverId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Discount codes
  getDiscountCode(code: string): Promise<DiscountCode | undefined>;
  createDiscountCode(discountCode: InsertDiscountCode): Promise<DiscountCode>;
  
  // Admin stats
  getStats(): Promise<{
    totalUsers: number;
    totalSellers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private cartItems: Map<string, CartItem>;
  private chatMessages: Map<string, ChatMessage>;
  private discountCodes: Map<string, DiscountCode>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.cartItems = new Map();
    this.chatMessages = new Map();
    this.discountCodes = new Map();
    
    // Initialize with some demo data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo users
    const adminUser: User = {
      id: "admin-1",
      email: "admin@farmmarket.com",
      name: "Admin User",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32",
      createdAt: new Date(),
    };
    
    const seller1: User = {
      id: "seller-1",
      email: "farmer@greenvalley.com",
      name: "Green Valley Farm",
      role: "seller",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32",
      createdAt: new Date(),
    };
    
    const customer1: User = {
      id: "customer-1",
      email: "john@example.com",
      name: "John Doe",
      role: "customer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32",
      createdAt: new Date(),
    };
    
    this.users.set(adminUser.id, adminUser);
    this.users.set(seller1.id, seller1);
    this.users.set(customer1.id, customer1);

    // Create discount codes
    const discount1: DiscountCode = {
      id: "disc-1",
      code: "FRESH15",
      discount: 15,
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      createdAt: new Date(),
    };
    
    // Create demo products with Ugandan farm produce
    const product1: Product = {
      id: "prod-1",
      name: "Fresh Matooke (Green Bananas)",
      description: "Organic matooke from Buganda region, perfect for steaming",
      price: "15000", // 15,000 UGX
      category: "vegetables",
      quantity: 50,
      discount: 0,
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      sellerId: "seller-1",
      isActive: true,
      createdAt: new Date(),
    };

    const product2: Product = {
      id: "prod-2", 
      name: "Sweet Yellow Bananas",
      description: "Ripe sweet bananas from Mbale district",
      price: "8000", // 8,000 UGX
      category: "fruits",
      quantity: 30,
      discount: 10,
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      sellerId: "seller-1", 
      isActive: true,
      createdAt: new Date(),
    };

    const product3: Product = {
      id: "prod-3",
      name: "Fresh Tomatoes",
      description: "Juicy red tomatoes from Kasese valley",
      price: "5000", // 5,000 UGX per kg
      category: "vegetables",
      quantity: 100,
      discount: 0,
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      sellerId: "seller-1",
      isActive: true,
      createdAt: new Date(),
    };

    const product4: Product = {
      id: "prod-4",
      name: "Posho (Maize Flour)",
      description: "Fine white maize flour from Teso region",
      price: "3500", // 3,500 UGX per kg
      category: "grains",
      quantity: 200,
      discount: 5,
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      sellerId: "seller-1",
      isActive: true,
      createdAt: new Date(),
    };

    const product5: Product = {
      id: "prod-5",
      name: "Fresh Milk",
      description: "Pure cow milk from Ankole cattle",
      price: "2500", // 2,500 UGX per liter
      category: "dairy",
      quantity: 25,
      discount: 0,
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      sellerId: "seller-1",
      isActive: true,
      createdAt: new Date(),
    };

    this.products.set(product1.id, product1);
    this.products.set(product2.id, product2);
    this.products.set(product3.id, product3);
    this.products.set(product4.id, product4);
    this.products.set(product5.id, product5);
    
    this.discountCodes.set(discount1.id, discount1);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Products
  async getProducts(limit?: number): Promise<ProductWithSeller[]> {
    const products = Array.from(this.products.values())
      .filter(product => product.isActive)
      .slice(0, limit);
    
    return products.map(product => ({
      ...product,
      seller: {
        id: product.sellerId,
        name: this.users.get(product.sellerId)?.name || "Unknown Seller",
        avatar: this.users.get(product.sellerId)?.avatar || null,
      }
    }));
  }

  async getProduct(id: string): Promise<ProductWithSeller | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const seller = this.users.get(product.sellerId);
    return {
      ...product,
      seller: {
        id: product.sellerId,
        name: seller?.name || "Unknown Seller",
        avatar: seller?.avatar || null,
      }
    };
  }

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.sellerId === sellerId);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async searchProducts(query: string, category?: string): Promise<ProductWithSeller[]> {
    const products = Array.from(this.products.values())
      .filter(product => {
        const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) ||
                           (product.description?.toLowerCase().includes(query.toLowerCase()) || false);
        const matchesCategory = !category || product.category === category;
        return product.isActive && matchesQuery && matchesCategory;
      });
    
    return products.map(product => ({
      ...product,
      seller: {
        id: product.sellerId,
        name: this.users.get(product.sellerId)?.name || "Unknown Seller",
        avatar: this.users.get(product.sellerId)?.avatar || null,
      }
    }));
  }

  // Orders
  async getOrders(): Promise<OrderWithDetails[]> {
    const orders = Array.from(this.orders.values());
    return orders.map(order => ({
      ...order,
      product: this.products.get(order.productId)!,
      customer: {
        id: order.customerId,
        name: this.users.get(order.customerId)?.name || "Unknown Customer",
        email: this.users.get(order.customerId)?.email || "",
      },
      seller: {
        id: order.sellerId,
        name: this.users.get(order.sellerId)?.name || "Unknown Seller",
      }
    }));
  }

  async getOrdersByCustomer(customerId: string): Promise<OrderWithDetails[]> {
    const orders = Array.from(this.orders.values()).filter(order => order.customerId === customerId);
    return orders.map(order => ({
      ...order,
      product: this.products.get(order.productId)!,
      customer: {
        id: order.customerId,
        name: this.users.get(order.customerId)?.name || "Unknown Customer",
        email: this.users.get(order.customerId)?.email || "",
      },
      seller: {
        id: order.sellerId,
        name: this.users.get(order.sellerId)?.name || "Unknown Seller",
      }
    }));
  }

  async getOrdersBySeller(sellerId: string): Promise<OrderWithDetails[]> {
    const orders = Array.from(this.orders.values()).filter(order => order.sellerId === sellerId);
    return orders.map(order => ({
      ...order,
      product: this.products.get(order.productId)!,
      customer: {
        id: order.customerId,
        name: this.users.get(order.customerId)?.name || "Unknown Customer",
        email: this.users.get(order.customerId)?.email || "",
      },
      seller: {
        id: order.sellerId,
        name: this.users.get(order.sellerId)?.name || "Unknown Seller",
      }
    }));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id,
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Cart
  async getCartItems(userId: string): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.userId === userId);
    return items.map(item => {
      const product = this.products.get(item.productId)!;
      const seller = this.users.get(product.sellerId);
      return {
        ...item,
        product: {
          ...product,
          seller: {
            id: product.sellerId,
            name: seller?.name || "Unknown Seller",
            avatar: seller?.avatar || null,
          }
        }
      };
    });
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.userId === insertCartItem.userId && item.productId === insertCartItem.productId
    );
    
    if (existingItem) {
      // Update quantity instead of creating new item
      const updatedItem = { ...existingItem, quantity: existingItem.quantity + insertCartItem.quantity };
      this.cartItems.set(existingItem.id, updatedItem);
      return updatedItem;
    }
    
    const id = randomUUID();
    const cartItem: CartItem = { 
      ...insertCartItem, 
      id,
      createdAt: new Date(),
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: string): Promise<boolean> {
    const userItems = Array.from(this.cartItems.entries()).filter(([_, item]) => item.userId === userId);
    userItems.forEach(([id]) => this.cartItems.delete(id));
    return true;
  }

  // Chat
  async getChatMessages(senderId: string, receiverId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => 
        (msg.senderId === senderId && msg.receiverId === receiverId) ||
        (msg.senderId === receiverId && msg.receiverId === senderId)
      )
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = { 
      ...insertMessage, 
      id,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  // Discount codes
  async getDiscountCode(code: string): Promise<DiscountCode | undefined> {
    return Array.from(this.discountCodes.values()).find(dc => dc.code === code && dc.isActive);
  }

  async createDiscountCode(insertDiscountCode: InsertDiscountCode): Promise<DiscountCode> {
    const id = randomUUID();
    const discountCode: DiscountCode = { 
      ...insertDiscountCode, 
      id,
      createdAt: new Date(),
    };
    this.discountCodes.set(id, discountCode);
    return discountCode;
  }

  // Admin stats
  async getStats(): Promise<{
    totalUsers: number;
    totalSellers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
  }> {
    const totalUsers = this.users.size;
    const totalSellers = Array.from(this.users.values()).filter(user => user.role === 'seller').length;
    const totalProducts = this.products.size;
    const totalOrders = this.orders.size;
    const totalRevenue = Array.from(this.orders.values())
      .reduce((sum, order) => sum + parseFloat(order.totalPrice), 0);

    return {
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      totalRevenue,
    };
  }
}

export const storage = new MemStorage();
