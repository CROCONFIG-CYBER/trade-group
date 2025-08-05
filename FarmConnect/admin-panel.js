// Admin Panel JavaScript

// Application State
let currentAdmin = {
    id: 'admin-1',
    name: 'Administrator',
    email: 'admin@ugandafarmmarket.com',
    role: 'admin'
};

let platformUsers = [
    {
        id: 'user-1',
        name: 'John Mukasa',
        email: 'john.mukasa@email.com',
        role: 'customer',
        joinedDate: 'Dec 15, 2024',
        ordersCount: 8,
        totalRevenue: 125000,
        status: 'active'
    },
    {
        id: 'user-2',
        name: 'Mary Nakato (Farm Owner)',
        email: 'mary.nakato@farmmail.com',
        role: 'seller',
        joinedDate: 'Nov 28, 2024',
        ordersCount: 45, // Products for sellers
        totalRevenue: 850000,
        status: 'active'
    },
    {
        id: 'user-3',
        name: 'Peter Ssali',
        email: 'peter.ssali@email.com',
        role: 'customer',
        joinedDate: 'Jan 03, 2025',
        ordersCount: 3,
        totalRevenue: 67500,
        status: 'active'
    }
];

let platformStats = {
    totalUsers: 1247,
    activeProducts: 856,
    totalOrders: 2341,
    totalRevenue: 45200000, // 45.2M shs
    monthlyGrowth: {
        users: 12,
        products: 8,
        orders: 25,
        revenue: 18
    }
};

let categoryStats = [
    { name: 'Vegetables', percentage: 45 },
    { name: 'Fruits', percentage: 28 },
    { name: 'Grains', percentage: 18 },
    { name: 'Dairy', percentage: 9 }
];

let regionalStats = [
    { name: 'Central (Kampala, Entebbe)', users: 562 },
    { name: 'Eastern (Jinja, Mbale)', users: 298 },
    { name: 'Western (Mbarara, Kasese)', users: 215 },
    { name: 'Northern (Gulu, Lira)', users: 172 }
];

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateDashboardStats();
});

// Setup event listeners
function setupEventListeners() {
    // Time filter buttons
    document.querySelectorAll('.time-filter .btn').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.time-filter .btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updateAnalytics();
        });
    });
    
    // User filter
    const userFilter = document.querySelector('.filter-select');
    if (userFilter) {
        userFilter.addEventListener('change', filterUsers);
    }
    
    // Overlay click
    document.getElementById('overlay')?.addEventListener('click', closeAllModals);
}

// Dashboard functions
function updateDashboardStats() {
    // Update stats cards
    const statsCards = document.querySelectorAll('.stat-value');
    if (statsCards.length >= 4) {
        statsCards[0].textContent = platformStats.totalUsers.toLocaleString();
        statsCards[1].textContent = platformStats.activeProducts.toLocaleString();
        statsCards[2].textContent = platformStats.totalOrders.toLocaleString();
        statsCards[3].textContent = (platformStats.totalRevenue / 1000000).toFixed(1) + 'M';
    }
    
    // Update growth indicators
    const growthElements = document.querySelectorAll('.stat-change');
    if (growthElements.length >= 4) {
        growthElements[0].textContent = `+${platformStats.monthlyGrowth.users}% this month`;
        growthElements[1].textContent = `+${platformStats.monthlyGrowth.products}% this week`;
        growthElements[2].textContent = `+${platformStats.monthlyGrowth.orders}% this month`;
        growthElements[3].textContent = `+${platformStats.monthlyGrowth.revenue}% this month`;
    }
}

// User management functions
function viewUser(userId) {
    const user = platformUsers.find(u => u.id === userId);
    if (user) {
        showNotification(`Viewing details for ${user.name}`, 'info');
        // In a real app, this would open a detailed user modal
    }
}

function editUser(userId) {
    const user = platformUsers.find(u => u.id === userId);
    if (user) {
        showNotification(`Edit functionality for ${user.name} coming soon!`, 'info');
        // In a real app, this would open an edit user modal
    }
}

function suspendUser(userId) {
    const user = platformUsers.find(u => u.id === userId);
    if (user) {
        const action = user.status === 'active' ? 'suspend' : 'activate';
        const confirmAction = confirm(`Are you sure you want to ${action} ${user.name}?`);
        
        if (confirmAction) {
            user.status = user.status === 'active' ? 'suspended' : 'active';
            showNotification(`User ${user.name} has been ${action}ed`, 'success');
            updateUsersTable();
        }
    }
}

function filterUsers() {
    const filterValue = document.querySelector('.filter-select').value;
    updateUsersTable(filterValue);
}

function updateUsersTable(filter = 'all') {
    const tbody = document.querySelector('.users-table tbody');
    if (!tbody) return;
    
    const filteredUsers = filter === 'all' 
        ? platformUsers 
        : platformUsers.filter(user => {
            if (filter === 'customers') return user.role === 'customer';
            if (filter === 'sellers') return user.role === 'seller';
            if (filter === 'admins') return user.role === 'admin';
            return true;
        });
    
    tbody.innerHTML = filteredUsers.map(user => `
        <tr>
            <td>
                <div class="user-cell">
                    <div class="user-avatar">${user.name[0]}</div>
                    <div>
                        <div class="user-name">${user.name}</div>
                        <div class="user-email">${user.email}</div>
                    </div>
                </div>
            </td>
            <td><span class="role-badge ${user.role}">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span></td>
            <td>${user.joinedDate}</td>
            <td>${user.ordersCount} ${user.role === 'seller' ? 'products' : 'orders'}</td>
            <td>${user.totalRevenue.toLocaleString()} shs</td>
            <td><span class="status-badge ${user.status}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></td>
            <td>
                <button class="btn btn-ghost btn-sm" onclick="viewUser('${user.id}')">
                    <i data-lucide="eye"></i>
                </button>
                <button class="btn btn-ghost btn-sm" onclick="editUser('${user.id}')">
                    <i data-lucide="edit"></i>
                </button>
                <button class="btn btn-ghost btn-sm text-red" onclick="suspendUser('${user.id}')">
                    <i data-lucide="ban"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    // Re-initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Analytics functions
function updateAnalytics() {
    // Update category statistics
    const categoryContainer = document.querySelector('.category-stats');
    if (categoryContainer) {
        categoryContainer.innerHTML = categoryStats.map(category => `
            <div class="category-item">
                <div class="category-info">
                    <span class="category-name">${category.name}</span>
                    <span class="category-percentage">${category.percentage}%</span>
                </div>
                <div class="category-bar">
                    <div class="category-fill" style="width: ${category.percentage}%"></div>
                </div>
            </div>
        `).join('');
    }
    
    // Update regional statistics
    const regionContainer = document.querySelector('.region-stats');
    if (regionContainer) {
        regionContainer.innerHTML = regionalStats.map(region => `
            <div class="region-item">
                <span class="region-name">${region.name}</span>
                <span class="region-value">${region.users} users</span>
            </div>
        `).join('');
    }
    
    // Update revenue trends
    const trendsContainer = document.querySelector('.trend-indicators');
    if (trendsContainer) {
        const currentMonth = (platformStats.totalRevenue / 1000000).toFixed(1);
        const lastMonth = ((platformStats.totalRevenue / 1000000) / (1 + platformStats.monthlyGrowth.revenue / 100)).toFixed(1);
        
        trendsContainer.innerHTML = `
            <div class="trend-item">
                <span class="trend-label">This Month</span>
                <span class="trend-value positive">+${currentMonth}M shs</span>
            </div>
            <div class="trend-item">
                <span class="trend-label">Last Month</span>
                <span class="trend-value">${lastMonth}M shs</span>
            </div>
        `;
    }
}

// System functions
function openSystemSettings() {
    showNotification('System settings panel coming soon!', 'info');
}

function exportUsers() {
    showNotification('User export functionality coming soon!', 'info');
}

// Utility functions
function closeAllModals() {
    // Close any open modals
    document.querySelectorAll('.modal.active').forEach(modal => {
        modal.classList.remove('active');
    });
    document.getElementById('overlay')?.classList.remove('active');
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

// Initialize data on load
updateUsersTable();
updateAnalytics();

// Export functions for global access
window.viewUser = viewUser;
window.editUser = editUser;
window.suspendUser = suspendUser;
window.openSystemSettings = openSystemSettings;
window.logout = logout;