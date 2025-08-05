// TypeScript type definitions for Uganda FarmMarket

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'vegetables' | 'fruits' | 'grains' | 'dairy';
    discount: number;
    image: string;
    sellerId: string;
    quantity: number;
    isActive?: boolean;
    createdAt?: Date;
}

export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    product: Product;
}

export interface User {
    uid: string;
    email: string;
    name?: string;
    role: 'customer' | 'seller' | 'admin';
    createdAt?: Date;
}

export interface ChatMessage {
    id: number;
    sender: 'user' | 'farmer';
    text: string;
    timestamp: Date;
}

export interface DiscountCode {
    id: string;
    code: string;
    discount: number;
    isActive: boolean;
    expiresAt: Date;
    createdAt: Date;
}

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    totalPrice: string;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    quantity: number;
    createdAt: Date;
}

export type PriceRange = 'all' | '0-10000' | '10000-25000' | '25000-50000' | '50000+';
export type ProductCategory = 'all' | 'vegetables' | 'fruits' | 'grains' | 'dairy';
export type UserRole = 'customer' | 'seller' | 'admin';
export type NotificationType = 'success' | 'error' | 'warning' | 'info';