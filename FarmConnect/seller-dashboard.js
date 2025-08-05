// Seller Dashboard JavaScript

// Application State
let currentSeller = {
    id: 'seller-1',
    name: 'Farm Owner',
    email: 'farmowner@farmmail.com',
    role: 'seller'
};

let sellerProducts = [
    {
        id: 'prod-1',
        name: 'Fresh Matooke',
        description: 'Green bananas from Buganda',
        price: 15000,
        category: 'vegetables',
        stock: 50,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
        id: 'prod-3',
        name: 'Fresh Tomatoes',
        description: 'Juicy red tomatoes from Kasese',
        price: 5000,
        category: 'vegetables',
        stock: 100,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
        id: 'prod-5',
        name: 'Fresh Milk',
        description: 'Pure cow milk from Ankole cattle',
        price: 2500,
        category: 'dairy',
        stock: 25,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    }
];

let customerChats = [
    {
        customerId: 'customer-1',
        customerName: 'John Mukasa',
        lastMessage: 'Do you have fresh matooke available?',
        unreadCount: 2,
        messages: [
            {
                sender: 'customer',
                text: 'Hello! Do you have fresh matooke available for tomorrow?',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
            },
            {
                sender: 'seller',
                text: 'Yes, we have fresh matooke from our Buganda farm. How many bunches do you need?',
                timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
            },
            {
                sender: 'customer',
                text: 'I need about 5 bunches. What\'s the price?',
                timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
            }
        ]
    },
    {
        customerId: 'customer-2',
        customerName: 'Sarah Namukasa',
        lastMessage: 'When will my order be ready?',
        unreadCount: 1,
        messages: [
            {
                sender: 'customer',
                text: 'When will my order be ready?',
                timestamp: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
            }
        ]
    },
    {
        customerId: 'customer-3',
        customerName: 'Peter Ssali',
        lastMessage: 'Thank you for the quality produce!',
        unreadCount: 0,
        messages: [
            {
                sender: 'customer',
                text: 'Thank you for the quality produce!',
                timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
            },
            {
                sender: 'seller',
                text: 'Thank you for your order! We appreciate your business.',
                timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000) // 2.5 hours ago
            }
        ]
    }
];

let currentChatCustomer = 'customer-1';

// Initialize seller dashboard
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateChatDisplay();
});

// Setup event listeners
function setupEventListeners() {
    // Add product form
    document.getElementById('add-product-form')?.addEventListener('submit', handleAddProduct);
    
    // Overlay click
    document.getElementById('overlay')?.addEventListener('click', closeAllModals);
}

// Product management functions
function editProduct(productId) {
    showNotification('Edit product functionality coming soon!', 'info');
}

function toggleProduct(productId) {
    const product = sellerProducts.find(p => p.id === productId);
    if (product) {
        product.status = product.status === 'active' ? 'inactive' : 'active';
        showNotification(`Product ${product.status === 'active' ? 'activated' : 'deactivated'}`, 'success');
    }
}

function openAddProductModal() {
    document.getElementById('add-product-modal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function closeAddProductModal() {
    document.getElementById('add-product-modal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function handleAddProduct(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const newProduct = {
        id: 'prod-' + Date.now(),
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseInt(formData.get('price')),
        category: formData.get('category'),
        stock: parseInt(formData.get('stock')),
        status: 'active',
        image: formData.get('image') || 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    };
    
    sellerProducts.push(newProduct);
    showNotification('Product added successfully!', 'success');
    closeAddProductModal();
    
    // Reset form
    e.target.reset();
}

// Chat functions for sellers
function openSellerChat() {
    document.getElementById('seller-chat-modal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    updateChatDisplay();
}

function closeSellerChat() {
    document.getElementById('seller-chat-modal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function selectCustomer(customerId) {
    currentChatCustomer = customerId;
    updateChatDisplay();
    
    // Update active customer in list
    document.querySelectorAll('.customer-chat-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Find and activate the selected customer
    const customerItems = document.querySelectorAll('.customer-chat-item');
    const customerIndex = customerChats.findIndex(chat => chat.customerId === customerId);
    if (customerItems[customerIndex]) {
        customerItems[customerIndex].classList.add('active');
    }
}

function updateChatDisplay() {
    const currentChat = customerChats.find(chat => chat.customerId === currentChatCustomer);
    if (!currentChat) return;
    
    const messagesContainer = document.getElementById('seller-chat-messages');
    const chatInput = document.getElementById('seller-chat-input');
    
    if (messagesContainer) {
        messagesContainer.innerHTML = currentChat.messages.map(message => {
            const isOwn = message.sender === 'seller';
            return `
                <div class="chat-message ${isOwn ? 'own' : 'other'}">
                    ${!isOwn ? `<div class="message-sender">${currentChat.customerName}</div>` : ''}
                    <div class="message-text">${message.text}</div>
                    <div class="message-time">${formatMessageTime(message.timestamp)}</div>
                </div>
            `;
        }).join('');
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    if (chatInput) {
        chatInput.placeholder = `Type your response to ${currentChat.customerName}...`;
    }
    
    // Mark messages as read
    currentChat.unreadCount = 0;
    updateCustomersList();
}

function updateCustomersList() {
    const listContainer = document.querySelector('.chat-customers-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = customerChats.map(chat => `
        <div class="customer-chat-item ${chat.customerId === currentChatCustomer ? 'active' : ''}" onclick="selectCustomer('${chat.customerId}')">
            <div class="customer-avatar">${chat.customerName[0]}</div>
            <div class="customer-info">
                <div class="customer-name">${chat.customerName}</div>
                <div class="last-message">${chat.lastMessage}</div>
            </div>
            ${chat.unreadCount > 0 ? `<div class="message-badge">${chat.unreadCount}</div>` : ''}
        </div>
    `).join('');
}

function sendSellerMessage() {
    const input = document.getElementById('seller-chat-input');
    const text = input.value.trim();
    
    if (!text) return;
    
    const currentChat = customerChats.find(chat => chat.customerId === currentChatCustomer);
    if (!currentChat) return;
    
    const message = {
        sender: 'seller',
        text: text,
        timestamp: new Date()
    };
    
    currentChat.messages.push(message);
    currentChat.lastMessage = text;
    
    input.value = '';
    updateChatDisplay();
    showNotification('Message sent to customer', 'success');
}

// Handle Enter key in chat input
document.addEventListener('keypress', function(e) {
    if (e.target.id === 'seller-chat-input' && e.key === 'Enter') {
        sendSellerMessage();
    }
});

// Utility functions
function formatMessageTime(timestamp) {
    const now = new Date();
    const diffInHours = (now - timestamp) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
        return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)} hours ago`;
    } else {
        return timestamp.toLocaleDateString();
    }
}

function closeAllModals() {
    closeAddProductModal();
    closeSellerChat();
}

function showNotification(message, type = 'success') {
    const container = document.getElementById('notifications');
    if (!container) return;
    
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

function logout() {
    // Redirect to main page
    window.location.href = 'index.html';
}

// Export functions for global access
window.editProduct = editProduct;
window.toggleProduct = toggleProduct;
window.openAddProductModal = openAddProductModal;
window.closeAddProductModal = closeAddProductModal;
window.openSellerChat = openSellerChat;
window.closeSellerChat = closeSellerChat;
window.selectCustomer = selectCustomer;
window.sendSellerMessage = sendSellerMessage;
window.logout = logout;