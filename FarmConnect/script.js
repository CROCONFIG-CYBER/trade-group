// Application State
let currentUser = null;
let currentRole = 'customer';
let cartItems = [];
let products = [];
let chatMessages = [];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadProducts();
    setupEventListeners();
    
    // Check for authentication state changes
    if (window.firebase && window.firebase.onAuthStateChanged) {
        window.firebase.onAuthStateChanged(window.firebase.auth, (user) => {
            currentUser = user;
            updateUI();
        });
    }
});

// Sample product data with Ugandan produce
const sampleProducts = [
    {
        id: 'prod-1',
        name: 'Fresh Matooke (Green Bananas)',
        description: 'Organic matooke from Buganda region, perfect for steaming',
        price: 15000,
        category: 'vegetables',
        discount: 0,
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
        sellerId: 'seller-1',
        quantity: 50
    },
    {
        id: 'prod-2',
        name: 'Sweet Yellow Bananas',
        description: 'Ripe sweet bananas from Mbale district',
        price: 8000,
        category: 'fruits',
        discount: 10,
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
        sellerId: 'seller-1',
        quantity: 30
    },
    {
        id: 'prod-3',
        name: 'Fresh Tomatoes',
        description: 'Juicy red tomatoes from Kasese valley',
        price: 5000,
        category: 'vegetables',
        discount: 0,
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
        sellerId: 'seller-1',
        quantity: 100
    },
    {
        id: 'prod-4',
        name: 'Posho (Maize Flour)',
        description: 'Fine white maize flour from Teso region',
        price: 3500,
        category: 'grains',
        discount: 5,
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
        sellerId: 'seller-1',
        quantity: 200
    },
    {
        id: 'prod-5',
        name: 'Fresh Milk',
        description: 'Pure cow milk from Ankole cattle',
        price: 2500,
        category: 'dairy',
        discount: 0,
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
        sellerId: 'seller-1',
        quantity: 25
    },
    {
        id: 'prod-6',
        name: 'Sweet Potatoes',
        description: 'Orange-fleshed sweet potatoes from Soroti',
        price: 4000,
        category: 'vegetables',
        discount: 0,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
        sellerId: 'seller-1',
        quantity: 75
    }
];

// Initialize application
function initializeApp() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('farmmarket-cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
    }
    
    // Load demo chat messages
    chatMessages = [
        { id: 1, sender: 'farmer', text: 'Hello! How can I help you today?', timestamp: new Date() },
        { id: 2, sender: 'user', text: 'Do you have fresh matooke available?', timestamp: new Date() }
    ];
    
    updateUI();
}

// Load products
function loadProducts() {
    products = [...sampleProducts];
    // Don't render products immediately since they're in HTML
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.getElementById('modal-close')?.addEventListener('click', closeAuthModal);
    document.getElementById('cart-close')?.addEventListener('click', closeCart);
    document.getElementById('chat-close')?.addEventListener('click', closeChat);
    
    // Auth forms
    document.getElementById('login-form')?.addEventListener('submit', handleLogin);
    document.getElementById('signup-form')?.addEventListener('submit', handleSignup);
    
    // Tabs
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
    });
    
    // Filters
    document.getElementById('category-filter')?.addEventListener('change', applyFilters);
    document.getElementById('price-filter')?.addEventListener('change', applyFilters);
    document.getElementById('search-input')?.addEventListener('input', applyFilters);
    
    // Chat
    document.getElementById('send-message')?.addEventListener('click', sendMessage);
    document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    // Overlay
    document.getElementById('overlay')?.addEventListener('click', closeAllModals);
}

// Authentication functions
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        showLoading();
        
        // Simulate login for demo
        currentUser = { email, uid: 'demo-user-' + Date.now(), name: email.split('@')[0] };
        
        showNotification('Welcome back!', 'success');
        closeAuthModal();
        updateUI();
    } catch (error) {
        showNotification('Login failed: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const role = document.getElementById('signup-role').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    try {
        showLoading();
        
        // Simulate signup for demo
        currentUser = { email, uid: 'demo-user-' + Date.now(), name, role };
        
        showNotification('Account created successfully!', 'success');
        closeAuthModal();
        updateUI();
    } catch (error) {
        showNotification('Signup failed: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

function logout() {
    currentUser = null;
    cartItems = [];
    localStorage.removeItem('farmmarket-cart');
    updateUI();
    showNotification('Logged out successfully', 'success');
}

// UI functions
function updateUI() {
    const navActions = document.getElementById('nav-actions');
    
    if (currentUser) {
        navActions.innerHTML = `
            <select id="role-switcher" onchange="switchRole(this.value)">
                <option value="customer" ${currentRole === 'customer' ? 'selected' : ''}>Customer View</option>
                <option value="seller" ${currentRole === 'seller' ? 'selected' : ''}>Seller Dashboard</option>
                <option value="admin" ${currentRole === 'admin' ? 'selected' : ''}>Admin Panel</option>
            </select>
            <button class="btn btn-ghost cart-button" onclick="openCart()">
                <i data-lucide="shopping-cart"></i>
                <span class="notification-badge" id="cart-count">${getCartCount()}</span>
            </button>
            <button class="btn btn-ghost chat-button" onclick="openChat()">
                <i data-lucide="message-circle"></i>
                <span class="notification-badge">2</span>
            </button>
            <div class="user-menu">
                <div class="user-avatar">${currentUser.name?.[0] || currentUser.email[0].toUpperCase()}</div>
                <div>
                    <div style="font-size: 14px; font-weight: 500;">${currentUser.name || currentUser.email}</div>
                    <button class="btn btn-ghost" style="padding: 0; font-size: 12px;" onclick="logout()">Logout</button>
                </div>
            </div>
        `;
    }
    
    // Re-initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }
    
    updateCartUI();
}

function switchRole(role) {
    currentRole = role;
    
    // Navigate to appropriate dashboard
    if (role === 'seller') {
        window.location.href = 'seller-dashboard.html';
    } else if (role === 'admin') {
        window.location.href = 'admin-panel.html';
    } else {
        // Stay on customer view (main page)
        showNotification(`Switched to ${role} view`, 'success');
    }
}

// Modal functions
function openAuthModal() {
    document.getElementById('auth-modal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function openCart() {
    document.getElementById('cart-sidebar').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function closeCart() {
    document.getElementById('cart-sidebar').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function openChat() {
    if (!currentUser) {
        showNotification('Please sign in to chat with farmers', 'warning');
        openAuthModal();
        return;
    }
    
    // Only sellers can initiate chats with customers
    if (currentUser.role !== 'seller') {
        showNotification('Only sellers can chat with customers. Contact sellers through their product pages.', 'warning');
        return;
    }
    
    document.getElementById('chat-modal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    renderChatMessages();
}

function closeChat() {
    document.getElementById('chat-modal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function closeAllModals() {
    closeAuthModal();
    closeCart();
    closeChat();
}

// Tab functions
function switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.getElementById(`${tab}-form`).classList.add('active');
}

// Product functions
function renderProducts() {
    const grid = document.getElementById('products-grid');
    const filteredProducts = getFilteredProducts();
    
    grid.innerHTML = filteredProducts.map(product => {
        const discountedPrice = product.discount > 0 
            ? product.price * (1 - product.discount / 100)
            : product.price;
            
        return `
            <div class="product-card fade-in">
                <img src="${product.image}" alt="${product.name}" class="product-image" />
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        <span class="current-price">${Math.round(discountedPrice).toLocaleString()} shs</span>
                        ${product.discount > 0 ? `
                            <span class="original-price">${Math.round(product.price).toLocaleString()} shs</span>
                            <span class="discount-badge">${product.discount}% OFF</span>
                        ` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart" onclick="addToCart('${product.id}')">
                            <i data-lucide="shopping-cart"></i>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Re-initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }
}

function getFilteredProducts() {
    const category = document.getElementById('category-filter')?.value || 'all';
    const priceRange = document.getElementById('price-filter')?.value || 'all';
    const search = document.getElementById('search-input')?.value?.toLowerCase() || '';
    
    return products.filter(product => {
        // Category filter
        if (category !== 'all' && product.category !== category) return false;
        
        // Search filter
        if (search && !product.name.toLowerCase().includes(search) && 
            !product.description.toLowerCase().includes(search)) return false;
        
        // Price filter
        const discountedPrice = product.discount > 0 
            ? product.price * (1 - product.discount / 100)
            : product.price;
            
        if (priceRange !== 'all') {
            if (priceRange === '0-10000' && discountedPrice >= 10000) return false;
            if (priceRange === '10000-25000' && (discountedPrice < 10000 || discountedPrice >= 25000)) return false;
            if (priceRange === '25000-50000' && (discountedPrice < 25000 || discountedPrice >= 50000)) return false;
            if (priceRange === '50000+' && discountedPrice < 50000) return false;
        }
        
        return true;
    });
}

// Apply filters to the static HTML products
function applyFilters() {
    const category = document.getElementById('category-filter')?.value || 'all';
    const priceRange = document.getElementById('price-filter')?.value || 'all';
    const search = document.getElementById('search-input')?.value?.toLowerCase() || '';
    
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        const product = products[index];
        if (!product) return;
        
        let shouldShow = true;
        
        // Category filter
        if (category !== 'all' && product.category !== category) {
            shouldShow = false;
        }
        
        // Search filter
        if (search && !product.name.toLowerCase().includes(search) && 
            !product.description.toLowerCase().includes(search)) {
            shouldShow = false;
        }
        
        // Price filter
        const discountedPrice = product.discount > 0 
            ? product.price * (1 - product.discount / 100)
            : product.price;
            
        if (priceRange !== 'all') {
            if (priceRange === '0-10000' && discountedPrice >= 10000) shouldShow = false;
            if (priceRange === '10000-25000' && (discountedPrice < 10000 || discountedPrice >= 25000)) shouldShow = false;
            if (priceRange === '25000-50000' && (discountedPrice < 25000 || discountedPrice >= 50000)) shouldShow = false;
            if (priceRange === '50000+' && discountedPrice < 50000) shouldShow = false;
        }
        
        // Show or hide the card
        card.style.display = shouldShow ? 'block' : 'none';
    });
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cartItems.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            id: 'cart-' + Date.now(),
            productId: productId,
            quantity: 1,
            product: product
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification(`${product.name} added to cart`, 'success');
}

function removeFromCart(itemId) {
    cartItems = cartItems.filter(item => item.id !== itemId);
    saveCart();
    updateCartUI();
}

function updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(itemId);
        return;
    }
    
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartUI();
    }
}

function getCartCount() {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartSubtotal() {
    return cartItems.reduce((sum, item) => {
        const price = item.product.price;
        const discountedPrice = item.product.discount > 0 
            ? price * (1 - item.product.discount / 100)
            : price;
        return sum + (discountedPrice * item.quantity);
    }, 0);
}

function updateCartUI() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = getCartCount();
        cartCountElement.style.display = getCartCount() > 0 ? 'flex' : 'none';
    }
    
    renderCartItems();
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummaryContainer = document.getElementById('cart-summary');
    
    if (!cartItemsContainer || !cartSummaryContainer) return;
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #6B7280; padding: 40px 0;">Your cart is empty</p>';
        cartSummaryContainer.innerHTML = '';
        return;
    }
    
    cartItemsContainer.innerHTML = cartItems.map(item => {
        const price = item.product.price;
        const discountedPrice = item.product.discount > 0 
            ? price * (1 - item.product.discount / 100)
            : price;
            
        return `
            <div class="cart-item">
                <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-image" />
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.product.name}</div>
                    <div class="cart-item-price">${Math.round(discountedPrice).toLocaleString()} shs</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        <button class="btn btn-ghost" onclick="removeFromCart('${item.id}')" style="margin-left: 8px; padding: 4px 8px; font-size: 12px;">Remove</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    const subtotal = getCartSubtotal();
    const shipping = subtotal > 50000 ? 0 : 5000;
    const total = subtotal + shipping;
    
    cartSummaryContainer.innerHTML = `
        <div class="summary-row">
            <span>Subtotal</span>
            <span>${Math.round(subtotal).toLocaleString()} shs</span>
        </div>
        <div class="summary-row">
            <span>Shipping</span>
            <span>${shipping === 0 ? 'Free' : Math.round(shipping).toLocaleString() + ' shs'}</span>
        </div>
        <div class="summary-row summary-total">
            <span>Total</span>
            <span>${Math.round(total).toLocaleString()} shs</span>
        </div>
        <button class="btn btn-primary" style="width: 100%; margin-top: 16px;" onclick="checkout()">
            Checkout
        </button>
    `;
}

function checkout() {
    if (!currentUser) {
        showNotification('Please sign in to complete your purchase', 'warning');
        openAuthModal();
        return;
    }
    showNotification('Checkout functionality coming soon!', 'success');
    closeCart();
}

function saveCart() {
    localStorage.setItem('farmmarket-cart', JSON.stringify(cartItems));
}

// Chat functions
function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    
    if (!text) return;
    
    const message = {
        id: Date.now(),
        sender: 'user',
        text: text,
        timestamp: new Date()
    };
    
    chatMessages.push(message);
    input.value = '';
    
    // Simulate farmer response
    setTimeout(() => {
        const responses = [
            "Thank you for your message! I'll get back to you soon.",
            "Yes, we have fresh produce available. What would you like to know?",
            "Our delivery is available within Kampala. Let me check the schedule.",
            "All our products are fresh from the farm. Quality guaranteed!"
        ];
        
        const response = {
            id: Date.now() + 1,
            sender: 'farmer',
            text: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date()
        };
        
        chatMessages.push(response);
        renderChatMessages();
    }, 1000);
    
    renderChatMessages();
}

function renderChatMessages() {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    
    container.innerHTML = chatMessages.map(message => `
        <div class="chat-message ${message.sender === 'user' ? 'own' : 'other'}">
            ${message.text}
        </div>
    `).join('');
    
    container.scrollTop = container.scrollHeight;
}

// Utility functions
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function showNotification(message, type = 'success') {
    const container = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = `notification ${type} fade-in`;
    notification.innerHTML = `
        <div style="font-weight: 500;">${message}</div>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showLoading() {
    document.body.classList.add('loading');
}

function hideLoading() {
    document.body.classList.remove('loading');
}

// New function for seller-specific signup
function openSellerSignup() {
    openAuthModal();
    // Switch to signup tab and pre-select seller role
    setTimeout(() => {
        switchTab('signup');
        const roleSelect = document.getElementById('signup-role');
        if (roleSelect) {
            roleSelect.value = 'seller';
        }
    }, 100);
}

// Export functions for global access
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.openCart = openCart;
window.closeCart = closeCart;
window.openChat = openChat;
window.closeChat = closeChat;
window.switchTab = switchTab;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.logout = logout;
window.switchRole = switchRole;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.checkout = checkout;
window.sendMessage = sendMessage;
window.scrollToProducts = scrollToProducts;
window.openSellerSignup = openSellerSignup;